import { Separator } from "@/components/ui/separator";
import { FontControls } from "./FontControls";
import { TextFormattingControls } from "./TextFormattingControls";
import { AlignmentControls } from "./AlignmentControls";
import { ColorControls } from "./ColorControls";
import { SaveButton } from "./SaveButton";
import { ZoomControls } from "./ZoomControls";
import { DocumentLabelInput } from "./DocumentLabelInput";

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

interface DocumentHeaderProps {
  textStyle: TextStyle;
  pageBackgroundColor: string;
  isModified: boolean;
  windowWidth: number;
  zoom: number;
  documentLabel: string;
  onTextStyleUpdate: (updates: Partial<TextStyle>) => void;
  onPageColorChange: (color: string) => void;
  onSave: () => void;
  onModified: () => void;
  onZoomChange: (zoom: number) => void;
  onZoomReset: () => void;
  onLabelChange: (label: string) => void;
  nextZIndex: number;
}

export const DocumentHeader = ({
  textStyle,
  pageBackgroundColor,
  isModified,
  windowWidth,
  zoom,
  documentLabel,
  onTextStyleUpdate,
  onPageColorChange,
  onSave,
  onModified,
  onZoomChange,
  onZoomReset,
  onLabelChange,
  nextZIndex,
}: DocumentHeaderProps) => {
  // Responsive logic based on window width
  const showLabels = windowWidth > 100;
  const showColorPickers = windowWidth > 750;
  const showFontControls = windowWidth > 600;
  const showFormatting = windowWidth > 500;

  const handleToggleFormat = (
    format: "isBold" | "isItalic" | "isUnderlined"
  ) => {
    onTextStyleUpdate({ [format]: !textStyle[format] });
  };

  return (
    <div className="bg-white border-b border-gray-300 p-3">
      <div className="flex items-center justify-start gap-3 overflow-x-auto">
        {/* Save button - always visible, aligned to the right */}
        <div className="">
          <SaveButton
            isModified={isModified}
            onSave={onSave}
            windowWidth={windowWidth}
          />
        </div>
        {/* Document Label Input */}
        <DocumentLabelInput
          label={documentLabel}
          onLabelChange={onLabelChange}
          onModified={onModified}
        />
        <Separator orientation="vertical" className="h-6" />

        {/* Font controls */}
        {showFontControls && (
          <>
            <FontControls
              fontFamily={textStyle.fontFamily}
              fontSize={textStyle.fontSize}
              onFontFamilyChange={(fontFamily) =>
                onTextStyleUpdate({ fontFamily })
              }
              onFontSizeChange={(fontSize) => onTextStyleUpdate({ fontSize })}
              showLabels={showLabels}
              zIndex={nextZIndex}
            />
            <Separator orientation="vertical" className="h-6" />
          </>
        )}

        {/* Text formatting controls */}
        {showFormatting && (
          <>
            <TextFormattingControls
              isBold={textStyle.isBold}
              isItalic={textStyle.isItalic}
              isUnderlined={textStyle.isUnderlined}
              onToggleBold={() => handleToggleFormat("isBold")}
              onToggleItalic={() => handleToggleFormat("isItalic")}
              onToggleUnderline={() => handleToggleFormat("isUnderlined")}
            />
            <Separator orientation="vertical" className="h-6" />
          </>
        )}

        {/* Alignment controls */}
        <AlignmentControls
          textAlign={textStyle.textAlign}
          onAlignmentChange={(textAlign) => onTextStyleUpdate({ textAlign })}
        />

        {/* Color controls */}
        {showColorPickers && (
          <>
            <Separator orientation="vertical" className="h-6" />
            <ColorControls
              textColor={textStyle.color}
              pageBackgroundColor={pageBackgroundColor}
              onTextColorChange={(color) => onTextStyleUpdate({ color })}
              onPageColorChange={onPageColorChange}
              onModified={onModified}
              zIndex={nextZIndex}
            />
          </>
        )}

        {/* Zoom controls */}
        <Separator orientation="vertical" className="h-6" />
        <ZoomControls
          zoom={zoom}
          onZoomChange={onZoomChange}
          onZoomReset={onZoomReset}
        />
      </div>
    </div>
  );
};
