import React from "react";
import { Separator } from "../../ui/separator";
import { FontControls } from "./FontControls";
import { TextFormattingControls } from "./TextFormattingControls";
import { AlignmentControls } from "./AlignmentControls";
import { ColorControls } from "./ColorControls";
import { SaveButton } from "./SaveButton";

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
  onTextStyleUpdate: (updates: Partial<TextStyle>) => void;
  onPageColorChange: (color: string) => void;
  onSave: () => void;
  onModified: () => void;
  nextZIndex: number;
}

export const DocumentHeader = ({
  textStyle,
  pageBackgroundColor,
  isModified,
  windowWidth,
  onTextStyleUpdate,
  onPageColorChange,
  onSave,
  onModified,
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
      <div className="flex items-center gap-3 overflow-x-auto">
        {/* Save button - always visible, aligned to the right */}
        <div className="mr-auto">
          <SaveButton
            isModified={isModified}
            onSave={onSave}
            windowWidth={windowWidth}
          />
        </div>
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
      </div>
    </div>
  );
};
