import React, { useState, useRef, useEffect } from "react";
import type { WindowContentProps } from "../../../types/storeTypes";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Pen,
  PaintBucket,
  Save,
} from "lucide-react";

type TextAlignment = "left" | "center" | "right" | "justify";

interface TextStyle {
  fontFamily: string;
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
  isUnderlined: boolean;
  color: string;
  textAlign: TextAlignment;
}

// Predefined color palette
const COLOR_PALETTE = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Red", value: "#EF4444" },
  { name: "Orange", value: "#F97316" },
  { name: "Yellow", value: "#EAB308" },
  { name: "Green", value: "#22C55E" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Purple", value: "#A855F7" },
  { name: "Pink", value: "#EC4899" },
  { name: "Gray", value: "#6B7280" },
];

export const DocumentEditor = ({ window }: WindowContentProps) => {
  const [content, setContent] = useState(
    "Welcome to Document Editor\n\nThis is a professional document editing experience similar to Microsoft Word or Apple Pages. Use the toolbar above to format your text.\n\nStart typing to create your document..."
  );
  const [isModified, setIsModified] = useState(false);
  const [pageBackgroundColor, setPageBackgroundColor] = useState("#FFFFFF");
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showPageColorPicker, setShowPageColorPicker] = useState(false);
  const [textStyle, setTextStyle] = useState<TextStyle>({
    fontFamily: "Times New Roman",
    fontSize: 14,
    isBold: false,
    isItalic: false,
    isUnderlined: false,
    color: "#000000",
    textAlign: "left",
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textColorRef = useRef<HTMLDivElement>(null);
  const pageColorRef = useRef<HTMLDivElement>(null);

  // Responsive logic based on window width
  const windowWidth = window.width;
  const showLabels = windowWidth > 900; // Hide labels when window is narrow
  const showColourPickers = windowWidth > 750;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsModified(true);
  };

  const updateTextStyle = (updates: Partial<TextStyle>) => {
    setTextStyle((prev) => ({ ...prev, ...updates }));
    setIsModified(true);
  };

  const adjustFontSize = (delta: number) => {
    const newSize = Math.max(8, Math.min(72, textStyle.fontSize + delta));
    updateTextStyle({ fontSize: newSize });
  };

  const toggleFormat = (format: "isBold" | "isItalic" | "isUnderlined") => {
    updateTextStyle({ [format]: !textStyle[format] });
  };

  const handleSave = () => {
    setIsModified(false);
    console.log("Document saved:", {
      windowId: window.windowId,
      content,
      style: textStyle,
      pageBackground: pageBackgroundColor,
    });
  };

  // Close color pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        textColorRef.current &&
        !textColorRef.current.contains(event.target as Node)
      ) {
        setShowTextColorPicker(false);
      }
      if (
        pageColorRef.current &&
        !pageColorRef.current.contains(event.target as Node)
      ) {
        setShowPageColorPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-focus the textarea when component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Generate CSS styles for the textarea
  const textareaStyles: React.CSSProperties = {
    fontFamily: textStyle.fontFamily,
    fontSize: `${textStyle.fontSize}px`,
    fontWeight: textStyle.isBold ? "bold" : "normal",
    fontStyle: textStyle.isItalic ? "italic" : "normal",
    textDecoration: textStyle.isUnderlined ? "underline" : "none",
    color: textStyle.color,
    textAlign: textStyle.textAlign,
    lineHeight: "1.6",
    backgroundColor: pageBackgroundColor,
  };

  const FormatButton = ({
    active,
    onClick,
    children,
    title,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      onClick={onClick}
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
        active
          ? "bg-blue-100 text-blue-700 border border-blue-300"
          : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );

  const ColorPickerDropdown = ({
    isOpen,
    onToggle,
    value,
    onChange,
    icon: Icon,
    title,
    containerRef,
  }: {
    isOpen: boolean;
    onToggle: () => void;
    value: string;
    onChange: (color: string) => void;
    icon: React.ComponentType<{ size?: number }>;
    title: string;
    containerRef: React.RefObject<HTMLDivElement | null>;
  }) => (
    <div className="relative" ref={containerRef}>
      <div
        onClick={onToggle}
        title={title}
        className="w-8 h-8 flex items-center justify-center rounded bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <Icon size={16} />
      </div>

      {isOpen && (
        <div className="absolute top-10 left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[200px]">
          <div className="grid grid-cols-5 gap-3">
            {COLOR_PALETTE.map((color) => (
              <button
                key={color.value}
                onClick={() => {
                  onChange(color.value);
                  onToggle();
                }}
                title={color.name}
                className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                  value === color.value
                    ? "border-blue-500 shadow-lg ring-2 ring-blue-200"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: color.value }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Modern Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="flex justify-center items-center gap-4 flex-nowrap overflow-x-auto">
          {/* Save Button - Icon Only */}
          <div
            onClick={handleSave}
            title={isModified ? "Save document" : "Document saved"}
            className={`w-8 h-8 flex items-center justify-center rounded transition-colors flex-shrink-0 bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer ${
              isModified
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-100 text-red-500 cursor-not-allowed"
            }`}
            // disabled={!isModified}
          >
            <Save size={16} className="text-gray-700" />
          </div>

          <div className="w-px h-8 bg-gray-200 flex-shrink-0" />

          {/* Font Family */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {showLabels && (
              <span className="text-sm text-gray-600 whitespace-nowrap">
                Font:
              </span>
            )}
            <select
              value={textStyle.fontFamily}
              onChange={(e) => updateTextStyle({ fontFamily: e.target.value })}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[140px] text-gray-800"
            >
              <option value="Times New Roman">Times New Roman</option>
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Georgia">Georgia</option>
            </select>
          </div>

          {/* Font Size Controls */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {showLabels && (
              <span className="text-sm text-gray-600 whitespace-nowrap">
                Size:
              </span>
            )}
            <button
              onClick={() => adjustFontSize(-1)}
              className="w-7 h-7 flex items-center justify-center rounded bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 text-sm"
              title="Decrease font size"
            >
              −
            </button>
            <div className="px-2 py-1 min-w-[40px] text-center text-sm border border-gray-200 bg-white text-gray-800 rounded">
              {textStyle.fontSize}
            </div>
            <button
              onClick={() => adjustFontSize(1)}
              className="w-7 h-7 flex items-center justify-center rounded bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 text-sm"
              title="Increase font size"
            >
              +
            </button>
          </div>

          <div className="w-px h-8 bg-gray-200 flex-shrink-0" />

          {/* Format Buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <FormatButton
              active={textStyle.isBold}
              onClick={() => toggleFormat("isBold")}
              title="Bold"
            >
              <strong>B</strong>
            </FormatButton>

            <FormatButton
              active={textStyle.isItalic}
              onClick={() => toggleFormat("isItalic")}
              title="Italic"
            >
              <em>I</em>
            </FormatButton>

            <FormatButton
              active={textStyle.isUnderlined}
              onClick={() => toggleFormat("isUnderlined")}
              title="Underline"
            >
              <u>U</u>
            </FormatButton>
          </div>

          {showColourPickers && (
            <div className="w-px h-8 bg-gray-200 flex-shrink-0" />
          )}
          {/* Text Color Picker */}
          {showColourPickers && (
            <div className="flex-shrink-0">
              <ColorPickerDropdown
                isOpen={showTextColorPicker}
                onToggle={() => setShowTextColorPicker(!showTextColorPicker)}
                value={textStyle.color}
                onChange={(color) => updateTextStyle({ color })}
                icon={Pen}
                title="Text color"
                containerRef={textColorRef}
              />
            </div>
          )}

          {/* Page Background Color Picker */}
          {showColourPickers && (
            <div className="flex-shrink-0">
              <ColorPickerDropdown
                isOpen={showPageColorPicker}
                onToggle={() => setShowPageColorPicker(!showPageColorPicker)}
                value={pageBackgroundColor}
                onChange={setPageBackgroundColor}
                icon={PaintBucket}
                title="Page background color"
                containerRef={pageColorRef}
              />
            </div>
          )}

          <div className="w-px h-8 bg-gray-200 flex-shrink-0" />

          {/* Text Alignment - Icons Only */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <div
              onClick={() => updateTextStyle({ textAlign: "left" })}
              title="Align left"
              className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                textStyle.textAlign === "left"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              <AlignLeft size={16} />
            </div>

            <div
              onClick={() => updateTextStyle({ textAlign: "center" })}
              title="Center"
              className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                textStyle.textAlign === "center"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              <AlignCenter size={16} />
            </div>

            <div
              onClick={() => updateTextStyle({ textAlign: "right" })}
              title="Align right"
              className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                textStyle.textAlign === "right"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              <AlignRight size={16} />
            </div>

            {/* <div
              onClick={() => updateTextStyle({ textAlign: "justify" })}
              title="Justify"
              className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                textStyle.textAlign === "justify"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              <AlignJustify size={16} />
            </div> */}
          </div>

          {/* Document Stats - Will be hidden on very small screens */}
          {/* {windowWidth > 600 && (
            <div className="ml-auto text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded flex-shrink-0">
              {content.length} chars •{" "}
              {content.split(/\s+/).filter((word) => word.length > 0).length}{" "}
              words
            </div>
          )} */}
        </div>
      </div>

      {/* Document Area */}
      <div className="flex-1 p-8 overflow-auto bg-gray-50">
        <div className="max-w-4xl mx-auto">
          {/* Document Paper */}
          <div
            className="shadow-lg min-h-[800px] rounded-lg overflow-hidden"
            style={{ backgroundColor: pageBackgroundColor }}
          >
            {/* Document Header */}
            {/* <div className="border-b border-gray-100 px-8 py-4 bg-gray-50/80 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold text-gray-800">
                  {isModified && <span className="text-orange-500">•</span>}
                </h1>
                <div className="text-sm text-gray-400">
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div> */}

            {/* Document Content */}
            <div className="p-8">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleContentChange}
                className="w-full min-h-[600px] p-6 border-none resize-none outline-none"
                style={textareaStyles}
                placeholder="Start typing your document..."
                spellCheck="true"
              />
            </div>
          </div>

          {/* Page Info */}
          <div className="mt-4 text-center text-sm text-gray-400">
            Page 1 • {Math.ceil(content.length / 3000)} pages estimated
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-white border-t border-gray-200 px-4 py-2 text-xs text-gray-500 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span>Ready {isModified ? "• Modified" : "• Saved"}</span>
          <span>•</span>
          <span>
            {textStyle.fontFamily} {textStyle.fontSize}pt
          </span>
          <span>•</span>
          <span>
            Background:{" "}
            {COLOR_PALETTE.find((c) => c.value === pageBackgroundColor)?.name ||
              "Custom"}
          </span>
        </div>
        <div>Document Editor v1.0</div>
      </div>
    </div>
  );
};
