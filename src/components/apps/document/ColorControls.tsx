import React from "react";
import { Pen, PaintBucket } from "lucide-react";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

interface ColorControlsProps {
  textColor: string;
  pageBackgroundColor: string;
  onTextColorChange: (color: string) => void;
  onPageColorChange: (color: string) => void;
  onModified: () => void;
  zIndex?: number;
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

export const ColorControls = ({
  textColor,
  pageBackgroundColor,
  onTextColorChange,
  onPageColorChange,
  onModified,
  zIndex = 0,
}: ColorControlsProps) => {
  const ColorPickerDropdown = ({
    value,
    onChange,
    icon: Icon,
    title,
  }: {
    value: string;
    onChange: (color: string) => void;
    icon: React.ComponentType<{ size?: number }>;
    title: string;
  }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          title={title}
          className="p-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
        >
          <Icon size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-48 p-3 bg-white text-gray-700 border-gray-300"
        sideOffset={5}
        side="bottom"
        align="end"
        style={{ zIndex: zIndex + 1 }}
      >
        <div className="grid grid-cols-5 gap-2">
          {COLOR_PALETTE.map((color) => (
            <div
              key={color.value}
              // type="button"
              onClick={() => {
                onChange(color.value);
                onModified();
              }}
              className={`w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform ${
                value === color.value
                  ? "border-gray-600 ring-2 ring-blue-500"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="flex items-center gap-1">
      <ColorPickerDropdown
        value={textColor}
        onChange={onTextColorChange}
        icon={Pen}
        title="Text Color"
      />
      <ColorPickerDropdown
        value={pageBackgroundColor}
        onChange={onPageColorChange}
        icon={PaintBucket}
        title="Page Background Color"
      />
    </div>
  );
};
