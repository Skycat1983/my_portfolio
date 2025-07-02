import { Plus, Minus, Home } from "lucide-react";
import type { MapControlsProps } from "./types";
import { mapControlsStyles } from "./map.styles";

export const MapControls = ({
  onZoomIn,
  onZoomOut,
  onResetView,
  currentZoom,
  maxZoom,
  minZoom,
}: MapControlsProps) => {
  const handleZoomIn = () => {
    if (currentZoom < maxZoom) {
      onZoomIn();
    }
  };

  const handleZoomOut = () => {
    if (currentZoom > minZoom) {
      onZoomOut();
    }
  };

  const handleZoomInKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleZoomIn();
    }
  };

  const handleZoomOutKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleZoomOut();
    }
  };

  const handleResetViewKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onResetView();
    }
  };

  const isZoomInDisabled = currentZoom >= maxZoom;
  const isZoomOutDisabled = currentZoom <= minZoom;

  return (
    <div className={mapControlsStyles.container}>
      {/* Zoom In Button */}
      <button
        onClick={handleZoomIn}
        onKeyDown={handleZoomInKeyDown}
        disabled={isZoomInDisabled}
        className={`${mapControlsStyles.button} ${
          isZoomInDisabled ? mapControlsStyles.buttonDisabled : ""
        }`}
        aria-label="Zoom in"
        tabIndex={0}
        title="Zoom in"
      >
        <Plus className={mapControlsStyles.icon} />
      </button>

      {/* Zoom Out Button */}
      <button
        onClick={handleZoomOut}
        onKeyDown={handleZoomOutKeyDown}
        disabled={isZoomOutDisabled}
        className={`${mapControlsStyles.button} ${
          isZoomOutDisabled ? mapControlsStyles.buttonDisabled : ""
        }`}
        aria-label="Zoom out"
        tabIndex={0}
        title="Zoom out"
      >
        <Minus className={mapControlsStyles.icon} />
      </button>

      {/* Reset View Button */}
      <button
        onClick={onResetView}
        onKeyDown={handleResetViewKeyDown}
        className={mapControlsStyles.button}
        aria-label="Reset view to default"
        tabIndex={0}
        title="Reset view"
      >
        <Home className={mapControlsStyles.icon} />
      </button>
    </div>
  );
};
