import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FontControlsProps {
  fontFamily: string;
  fontSize: number;
  onFontFamilyChange: (fontFamily: string) => void;
  onFontSizeChange: (fontSize: number) => void;
  showLabels?: boolean;
  zIndex?: number;
}

const fontOptions = [
  "Times New Roman",
  "Arial",
  "Helvetica",
  "Georgia",
  "Verdana",
  "Courier New",
];

const sizeOptions = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];

export const FontControls = ({
  fontFamily,
  fontSize,
  onFontFamilyChange,
  onFontSizeChange,
  showLabels = true,
  zIndex = 0,
}: FontControlsProps) => {
  return (
    <div className="flex items-center gap-3">
      {/* Font family */}
      <div className="flex items-center gap-2">
        {showLabels && (
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Font:
          </label>
        )}
        <Select value={fontFamily} onValueChange={onFontFamilyChange}>
          <SelectTrigger className="w-[140px] text-gray-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            style={{ zIndex: zIndex + 1 }}
            className="bg-white text-gray-700 border-gray-300"
          >
            {fontOptions.map((font) => (
              <SelectItem key={font} value={font}>
                {font}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Font size */}
      <div className="flex items-center gap-2">
        {showLabels && (
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Size:
          </label>
        )}
        <div className="flex items-center">
          <Select
            value={fontSize.toString()}
            onValueChange={(value) => onFontSizeChange(parseInt(value))}
          >
            <SelectTrigger className="w-[60px] text-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              style={{ zIndex: zIndex + 1 }}
              className="bg-white text-gray-700 border-gray-300"
            >
              {sizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
