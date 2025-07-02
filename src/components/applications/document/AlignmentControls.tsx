import React from "react";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type TextAlignment = "left" | "center" | "right";

interface AlignmentControlsProps {
  textAlign: TextAlignment;
  onAlignmentChange: (alignment: TextAlignment) => void;
}

export const AlignmentControls = ({
  textAlign,
  onAlignmentChange,
}: AlignmentControlsProps) => {
  const AlignButton = ({
    alignment,
    icon: Icon,
    title,
  }: {
    alignment: TextAlignment;
    icon: React.ComponentType<{ size?: number }>;
    title: string;
  }) => (
    <Button
      variant={textAlign === alignment ? "default" : "outline"}
      size="sm"
      onClick={() => onAlignmentChange(alignment)}
      title={title}
      className={`p-2 ${
        textAlign === alignment
          ? "bg-blue-500 text-white hover:bg-blue-600"
          : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
      }`}
    >
      <Icon size={16} />
    </Button>
  );

  return (
    <div className="flex items-center">
      <AlignButton alignment="left" icon={AlignLeft} title="Align Left" />
      <AlignButton alignment="center" icon={AlignCenter} title="Align Center" />
      <AlignButton alignment="right" icon={AlignRight} title="Align Right" />
    </div>
  );
};
