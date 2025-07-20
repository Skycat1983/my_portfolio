import DataDisplayToggles from "./controls/DataDisplayToggle";
import GraphTypeToggle from "./controls/GraphTypeToggle";
import RangeControls from "./controls/RangeControls";
import ValueTypeToggle from "./controls/ValueTypeToggle";

interface AnalysisToolbarProps {
  // Graph Type
  graphType: "area" | "bar";
  toggleGraphType: () => void;

  // Value Type
  valueType: "accumulated" | "growth";
  toggleValueType: () => void;

  // Data Display
  showAverage: boolean;
  showRange: boolean;
  toggleShowAverage: () => void;
  toggleShowRange: () => void;

  // Range Controls
  onZoomIn: () => void;
  onZoomOut: () => void;
  onShiftLeft: () => void;
  onShiftRight: () => void;
  canZoomIn?: boolean;
  canZoomOut?: boolean;
  canShiftLeft?: boolean;
  canShiftRight?: boolean;
}

const AnalysisToolbar = ({
  // Graph Type
  graphType,
  toggleGraphType,

  // Value Type
  valueType,
  toggleValueType,

  // Data Display
  showAverage,
  showRange,
  toggleShowAverage,
  toggleShowRange,

  // Range Controls
  onZoomIn,
  onZoomOut,
  onShiftLeft,
  onShiftRight,
  canZoomIn = true,
  canZoomOut = true,
  canShiftLeft = true,
  canShiftRight = true,
}: AnalysisToolbarProps) => {
  return (
    <div className="w-full border border-1 border-gray-100 rounded-lg sm:rounded-full p-2 hover:shadow-md">
      <div className="overflow-x-auto">
        <div className="flex items-center gap-4 min-w-max px-2 justify-center">
          <GraphTypeToggle
            graphType={graphType}
            toggleGraphType={toggleGraphType}
          />

          <ValueTypeToggle
            valueType={valueType}
            toggleValueType={toggleValueType}
          />

          <DataDisplayToggles
            showAverage={showAverage}
            showRange={showRange}
            toggleShowAverage={toggleShowAverage}
            toggleShowRange={toggleShowRange}
          />

          <div className="pl-2">
            <RangeControls
              onZoomIn={onZoomIn}
              onZoomOut={onZoomOut}
              onShiftLeft={onShiftLeft}
              onShiftRight={onShiftRight}
              canZoomIn={canZoomIn}
              canZoomOut={canZoomOut}
              canShiftLeft={canShiftLeft}
              canShiftRight={canShiftRight}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisToolbar;
