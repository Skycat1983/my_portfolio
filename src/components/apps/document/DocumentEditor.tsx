import React, { useState, useRef, useEffect } from "react";
import type { WindowContentProps, WindowType } from "../../../types/storeTypes";
import { useNewStore } from "../../../hooks/useStore";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Pen,
  PaintBucket,
  Save,
} from "lucide-react";
import { desktopRootId } from "../../../constants/nodes";
import { DOCUMENT } from "../../../constants/images";

type TextAlignment = "left" | "center" | "right";

interface TextStyle {
  fontFamily: string;
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
  isUnderlined: boolean;
  color: string;
  textAlign: TextAlignment;
}

// now we need to handle choosing a name and location  on save. naturally the name will have to be recorded in the label. the location will require a bit more logic to it.

// i am wondering if the most robust way to do this is to

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
const DEFAULT_TEXT_STYLE: TextStyle = {
  fontFamily: "Times New Roman",
  fontSize: 14,
  isBold: false,
  isItalic: false,
  isUnderlined: false,
  color: "#000000",
  textAlign: "left",
};
interface DocumentEditorProps {
  windowId: WindowType["windowId"];
  nodeId: WindowType["nodeId"];
}

export const DocumentEditor = ({ windowId, nodeId }: DocumentEditorProps) => {
  const [content, setContent] = useState("");
  const [isModified, setIsModified] = useState(false);
  const [pageBackgroundColor, setPageBackgroundColor] = useState("#FFFFFF");
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showPageColorPicker, setShowPageColorPicker] = useState(false);
  const [textStyle, setTextStyle] = useState<TextStyle>(DEFAULT_TEXT_STYLE);

  // Store actions for save functionality
  const windowData = useNewStore((s) => s.getWindowById(windowId));
  // const saveLocation = useNewStore((s) => s.rootId);
  const generateConfigId = useNewStore((s) => s.generateConfigId);
  const setDocumentConfig = useNewStore((s) => s.setDocumentConfig);
  const updateWindowById = useNewStore((s) => s.updateWindowById);
  const createOneNode = useNewStore((s) => s.createOneNode);
  const getNodeByID = useNewStore((s) => s.getNodeByID);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textColorRef = useRef<HTMLDivElement>(null);
  const pageColorRef = useRef<HTMLDivElement>(null);

  // Initialize document state from window configuration if available
  useEffect(() => {
    if (windowData?.documentConfig) {
      console.log(
        "DocumentEditor: initializing from saved config",
        windowData.documentConfig
      );

      const config = windowData.documentConfig;
      setContent(config.content);
      setTextStyle(config.textStyle);
      setPageBackgroundColor(config.pageSettings.backgroundColor);
      setIsModified(false); // Document is saved, so not modified initially

      console.log(
        "DocumentEditor: loaded document with",
        config.metadata.wordCount,
        "words"
      );
    } else {
      console.log("DocumentEditor: initializing new document with defaults");
    }
  }, [windowData?.documentConfig]);

  if (!windowData) {
    return null;
  }

  // Responsive logic based on window width
  const windowWidth = windowData.width;
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
    const now = new Date();
    const wordCount = content
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const charCount = content.length;

    // Check if this is an existing document or new document
    const isExistingDocument = !!windowData.documentConfig;

    if (isExistingDocument) {
      // Update existing document configuration
      const configId = windowData.documentConfig!.id;
      const updatedConfig = {
        ...windowData.documentConfig!,
        content,
        textStyle,
        pageSettings: {
          backgroundColor: pageBackgroundColor,
        },
        metadata: {
          ...windowData.documentConfig!.metadata,
          modifiedAt: now,
          wordCount,
          charCount,
        },
      };

      console.log(
        "DocumentEditor: updating existing document config",
        configId
      );
      setDocumentConfig(configId, updatedConfig);

      // Update window with new config
      updateWindowById(windowData.windowId, {
        documentConfig: updatedConfig,
      });
    } else {
      console.log("DocumentEditor: creating new document config");
      // Create new document configuration for first-time save
      const configId = generateConfigId();
      const newConfig = {
        id: configId,
        content,
        textStyle,
        pageSettings: {
          backgroundColor: pageBackgroundColor,
        },
        metadata: {
          title: windowData.title,
          createdAt: now,
          modifiedAt: now,
          wordCount,
          charCount,
        },
      };

      console.log("DocumentEditor: creating new document config", configId);
      setDocumentConfig(configId, newConfig);

      // Create new document node (save to root directory for now)
      const currentNode = getNodeByID(windowData.nodeId);
      const savedDocumentId = `saved-doc-${Date.now()}`;

      if (currentNode) {
        // Get image from current node if it has one, otherwise use default document image
        const documentImage = DOCUMENT;

        const newDocumentNode = {
          id: savedDocumentId,
          parentId: desktopRootId, // Save to root directory
          type: "document" as const,
          label: (windowData.title || "Document") + " (Saved)",
          image: documentImage,
          documentConfigId: configId, // Link to the saved configuration
        };

        console.log("DocumentEditor: creating document node", savedDocumentId);
        createOneNode(newDocumentNode);

        // Update current window to reference the saved document
        updateWindowById(windowData.windowId, {
          nodeId: savedDocumentId,
          title: (windowData.title || "Document") + " (Saved)",
          documentConfig: newConfig,
        });
      }
    }

    setIsModified(false);
    console.log("DocumentEditor: document saved successfully");
  };

  // Click outside handlers for color pickers
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

    if (showTextColorPicker || showPageColorPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showTextColorPicker, showPageColorPicker]);

  // Word and character count
  // const wordCount = content
  //   .split(/\s+/)
  //   .filter((word) => word.length > 0).length;
  // const charCount = content.length;

  // Font options
  const fontOptions = [
    "Times New Roman",
    "Arial",
    "Helvetica",
    "Georgia",
    "Verdana",
    "Courier New",
  ];

  // Size options
  const sizeOptions = [
    8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72,
  ];

  // Format button component
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
      type="button"
      onClick={onClick}
      title={title}
      className={`px-3 py-1 text-sm font-medium border border-gray-300 ${
        active
          ? "bg-blue-500 text-white border-blue-500"
          : "bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );

  // Color picker dropdown component
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
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={onToggle}
        title={title}
        className="p-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
      >
        <Icon size={16} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-300 shadow-lg z-50">
          <div className="grid grid-cols-5 gap-1">
            {COLOR_PALETTE.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => {
                  onChange(color.value);
                  onToggle();
                }}
                className={`w-6 h-6 rounded-full border-2 hover:scale-110 transition-transform ${
                  value === color.value ? "border-gray-600" : "border-gray-300"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col bg-gray-100">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-300 p-3">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Font family */}
          <div className="flex items-center gap-2">
            {showLabels && (
              <label className="text-sm font-medium text-gray-700">Font:</label>
            )}
            <select
              value={textStyle.fontFamily}
              onChange={(e) => updateTextStyle({ fontFamily: e.target.value })}
              className="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {fontOptions.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* Font size */}
          <div className="flex items-center gap-2">
            {showLabels && (
              <label className="text-sm font-medium text-gray-700">Size:</label>
            )}
            <select
              value={textStyle.fontSize}
              onChange={(e) =>
                updateTextStyle({ fontSize: parseInt(e.target.value) })
              }
              className="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <div className="flex">
              <button
                type="button"
                onClick={() => adjustFontSize(-1)}
                className="px-2 py-1 text-xs border border-gray-300 bg-white hover:bg-gray-50 border-r-0"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => adjustFontSize(1)}
                className="px-2 py-1 text-xs border border-gray-300 bg-white hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Format buttons */}
          <div className="flex">
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

          {/* Alignment buttons */}
          <div className="flex">
            <button
              type="button"
              onClick={() => updateTextStyle({ textAlign: "left" })}
              title="Align Left"
              className={`p-2 border border-gray-300 border-r-0 ${
                textStyle.textAlign === "left"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <AlignLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => updateTextStyle({ textAlign: "center" })}
              title="Align Center"
              className={`p-2 border border-gray-300 border-r-0 ${
                textStyle.textAlign === "center"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <AlignCenter size={16} />
            </button>
            <button
              type="button"
              onClick={() => updateTextStyle({ textAlign: "right" })}
              title="Align Right"
              className={`p-2 border border-gray-300 ${
                textStyle.textAlign === "right"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <AlignRight size={16} />
            </button>
          </div>

          {/* Color controls */}
          {showColourPickers && (
            <div className="flex gap-1">
              <ColorPickerDropdown
                isOpen={showTextColorPicker}
                onToggle={() => setShowTextColorPicker(!showTextColorPicker)}
                value={textStyle.color}
                onChange={(color) => updateTextStyle({ color })}
                icon={Pen}
                title="Text Color"
                containerRef={textColorRef}
              />
              <ColorPickerDropdown
                isOpen={showPageColorPicker}
                onToggle={() => setShowPageColorPicker(!showPageColorPicker)}
                value={pageBackgroundColor}
                onChange={setPageBackgroundColor}
                icon={PaintBucket}
                title="Page Background Color"
                containerRef={pageColorRef}
              />
            </div>
          )}

          {/* Save button */}
          <button
            type="button"
            onClick={handleSave}
            className={`ml-auto flex items-center gap-2 px-4 py-2 rounded text-sm font-medium ${
              isModified
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!isModified}
            title="Save Document"
          >
            <Save size={16} />
          </button>
        </div>
      </div>

      {/* Document area */}
      <div className="flex-1 p-8 overflow-auto">
        <div
          className="max-w-4xl mx-auto bg-white shadow-lg"
          style={{ backgroundColor: pageBackgroundColor }}
        >
          {/* Document content */}
          <div className="p-24">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              placeholder="Start writing your document..."
              className="w-full h-96 resize-none border-none outline-none bg-transparent"
              style={{
                fontFamily: textStyle.fontFamily,
                fontSize: `${textStyle.fontSize}px`,
                fontWeight: textStyle.isBold ? "bold" : "normal",
                fontStyle: textStyle.isItalic ? "italic" : "normal",
                textDecoration: textStyle.isUnderlined ? "underline" : "none",
                color: textStyle.color,
                textAlign: textStyle.textAlign,
                lineHeight: 1.6,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
