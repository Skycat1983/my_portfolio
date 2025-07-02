import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "../../ui/button";

interface ZoomControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onZoomReset: () => void;
}

export const ZoomControls = ({
  zoom,
  onZoomChange,
  onZoomReset,
}: ZoomControlsProps) => {
  const zoomPercentage = Math.round(zoom * 100);

  const handleZoomIn = () => {
    const newZoom = Math.min(3.0, zoom + 0.25);
    onZoomChange(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(0.5, zoom - 0.25);
    onZoomChange(newZoom);
  };

  return (
    <div className="flex items-center gap-1">
      {/* Zoom In */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleZoomIn}
        disabled={zoom >= 3.0}
        title="Zoom In"
        className="p-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
      >
        <ZoomIn size={16} />
      </Button>

      {/* Zoom Display */}
      <button
        onClick={onZoomReset}
        title="Reset to 100%"
        className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded whitespace-nowrap"
      >
        {zoomPercentage}%
      </button>

      {/* Zoom Out */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleZoomOut}
        disabled={zoom <= 0.5}
        title="Zoom Out"
        className="p-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
      >
        <ZoomOut size={16} />
      </Button>
    </div>
  );
};
