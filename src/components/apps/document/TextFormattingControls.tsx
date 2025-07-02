import React from "react";
import { Button } from "../../ui/button";

interface TextFormattingControlsProps {
  isBold: boolean;
  isItalic: boolean;
  isUnderlined: boolean;
  onToggleBold: () => void;
  onToggleItalic: () => void;
  onToggleUnderline: () => void;
}

export const TextFormattingControls = ({
  isBold,
  isItalic,
  isUnderlined,
  onToggleBold,
  onToggleItalic,
  onToggleUnderline,
}: TextFormattingControlsProps) => {
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
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      title={title}
      className={`px-3 py-1 text-sm font-medium ${
        active
          ? "bg-blue-500 text-white hover:bg-blue-600"
          : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
      }`}
    >
      {children}
    </Button>
  );

  return (
    <div className="flex items-center">
      <FormatButton active={isBold} onClick={onToggleBold} title="Bold">
        <strong>B</strong>
      </FormatButton>
      <FormatButton active={isItalic} onClick={onToggleItalic} title="Italic">
        <em>I</em>
      </FormatButton>
      <FormatButton
        active={isUnderlined}
        onClick={onToggleUnderline}
        title="Underline"
      >
        <u>U</u>
      </FormatButton>
    </div>
  );
};
