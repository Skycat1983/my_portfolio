import useScreenSize from "@/hooks/useScreenSize";
import { Activity, ArrowUpDown } from "lucide-react";

interface DataDisplayTogglesProps {
  showAverage: boolean;
  showRange: boolean;
  toggleShowAverage: () => void;
  toggleShowRange: () => void;
}

const DataDisplayToggles = ({
  showAverage,
  showRange,
  toggleShowAverage,
  toggleShowRange,
}: DataDisplayTogglesProps) => {
  const screenSize = useScreenSize();
  const isSmallScreen = screenSize.isMobile;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleShowAverage}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-full transition-colors ${
          showAverage
            ? "bg-orange-100 text-orange-700 border border-orange-200"
            : "text-gray-500 hover:bg-gray-50"
        }`}
      >
        <Activity size={16} className={showAverage ? "text-orange-500" : ""} />
        {!isSmallScreen && "Average"}
      </button>

      <button
        onClick={toggleShowRange}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-full transition-colors ${
          showRange
            ? "bg-blue-100 text-blue-700 border border-blue-200"
            : "text-gray-500 hover:bg-gray-50"
        }`}
      >
        <ArrowUpDown size={16} className={showRange ? "text-blue-500" : ""} />
        {!isSmallScreen && "Range"}
      </button>
    </div>
  );
};

export default DataDisplayToggles;
