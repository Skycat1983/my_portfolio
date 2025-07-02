import React, { useRef } from "react";

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

interface DocumentContentProps {
  content: string;
  textStyle: TextStyle;
  pageBackgroundColor: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const DocumentContent = ({
  content,
  textStyle,
  pageBackgroundColor,
  onChange,
}: DocumentContentProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // A4 dimensions: 210mm x 297mm
  // At 96 DPI: 794px x 1123px
  // Scaled down to fit better in viewport: ~600px x 850px
  const pageWidth = 600;
  const pageHeight = 850;

  return (
    <div className="flex-1 p-8 overflow-auto bg-gray-100">
      <div className="flex justify-center">
        <div
          className="bg-white shadow-lg border border-gray-300"
          style={{
            backgroundColor: pageBackgroundColor,
            width: `${pageWidth}px`,
            height: `${pageHeight}px`,
          }}
        >
          {/* Document content */}
          <div className="p-12 h-full">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={onChange}
              placeholder="Start writing your document..."
              className="w-full h-full resize-none border-none outline-none bg-transparent"
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
