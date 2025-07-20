import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

interface RangeControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onShiftLeft: () => void;
  onShiftRight: () => void;
  canZoomIn?: boolean;
  canZoomOut?: boolean;
  canShiftLeft?: boolean;
  canShiftRight?: boolean;
}

const RangeControls = ({
  onZoomIn,
  onZoomOut,
  onShiftLeft,
  onShiftRight,
  canZoomIn = true,
  canZoomOut = true,
  canShiftLeft = true,
  canShiftRight = true,
}: RangeControlsProps) => {
  const buttonClass =
    "p-1.5 text-gray-700 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="flex items-center gap-2 bg-neutral-100">
      <button
        onClick={onShiftLeft}
        disabled={!canShiftLeft}
        className={buttonClass}
        aria-label="Shift left"
      >
        <ChevronLeft size={16} />
      </button>

      <button
        onClick={onZoomOut}
        disabled={!canZoomOut}
        className={buttonClass}
        aria-label="Zoom out"
      >
        <ZoomOut size={16} />
      </button>

      <button
        onClick={onZoomIn}
        disabled={!canZoomIn}
        className={buttonClass}
        aria-label="Zoom in"
      >
        <ZoomIn size={16} />
      </button>

      <button
        onClick={onShiftRight}
        disabled={!canShiftRight}
        className={buttonClass}
        aria-label="Shift right"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default RangeControls;
