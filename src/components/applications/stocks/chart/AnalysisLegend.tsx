import { useNewStore } from "@/hooks/useStore";
import theme from "@/styles/theme";
import { BarChart3, LineChart, TrendingUp, Hash, Activity } from "lucide-react";

interface AnalysisLegendProps {
  graphType: "area" | "bar";
  valueType: "accumulated" | "growth";
  showAverage: boolean;
  showRange: boolean;
  toggleGraphType: () => void;
  toggleValueType: () => void;
  toggleShowAverage: () => void;
  toggleShowRange: () => void;
}

const AnalysisLegend = ({
  graphType,
  valueType,
  showAverage,
  showRange,
  toggleGraphType,
  toggleValueType,
  toggleShowAverage,
  toggleShowRange,
}: AnalysisLegendProps) => {
  const currentTheme = useNewStore((state) => state.theme);
  const colours = theme.colors.status.success[currentTheme];

  const getButtonStyle = (
    isActive: boolean,
    colorIndex: number,
    isAverage?: boolean
  ) => ({
    backgroundColor: isActive
      ? isAverage
        ? "#f97316" // Tailwind orange-500
        : colours[colorIndex]
      : undefined,
    color: isActive ? "white" : undefined,
  });

  return (
    <div className="flex items-center gap-4">
      {/* Graph Type Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleGraphType}
          className="p-2 rounded-full transition-colors hover:bg-gray-100"
          style={getButtonStyle(graphType === "area", 0)}
          aria-label={`Switch to ${
            graphType === "area" ? "bar" : "area"
          } chart`}
        >
          {graphType === "area" ? (
            <LineChart className="w-4 h-4" />
          ) : (
            <BarChart3 className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Value Type Toggle */}
      <div className="flex rounded-lg border border-gray-200 overflow-hidden">
        <button
          onClick={() => valueType !== "accumulated" && toggleValueType()}
          className="px-4 py-1.5 flex items-center gap-2 transition-colors hover:bg-gray-50"
          style={getButtonStyle(valueType === "accumulated", 0)}
          aria-label="Show total values"
        >
          <Hash className="w-4 h-4" />
          <span className="text-sm font-medium">Total</span>
        </button>
        <div className="w-px bg-gray-200" />
        <button
          onClick={() => valueType !== "growth" && toggleValueType()}
          className="px-4 py-1.5 flex items-center gap-2 transition-colors hover:bg-gray-50"
          style={getButtonStyle(valueType === "growth", 0)}
          aria-label="Show growth values"
        >
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">Growth</span>
        </button>
      </div>

      {/* Average Toggle */}
      <button
        onClick={toggleShowAverage}
        className="p-2 rounded-full transition-colors hover:bg-gray-100"
        style={getButtonStyle(showAverage, 0, true)}
        aria-label="Toggle average line"
      >
        <Activity className="w-4 h-4" />
      </button>

      {/* Range Toggle */}
      <button
        onClick={toggleShowRange}
        className="px-4 py-1.5 rounded-lg border border-gray-200 text-sm font-medium transition-colors hover:bg-gray-50"
        style={getButtonStyle(showRange, 1)}
      >
        Range
      </button>
    </div>
  );
};

export default AnalysisLegend;
