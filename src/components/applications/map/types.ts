export interface MapPosition {
  lat: number;
  lng: number;
}

export interface MapMarkerData {
  id: string;
  position: MapPosition;
  title: string;
  description?: string;
  icon?: string;
}

export interface MapViewport {
  center: MapPosition;
  zoom: number;
}

export interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  currentZoom: number;
  maxZoom: number;
  minZoom: number;
}

export interface MapMarkerProps {
  marker: MapMarkerData;
  isSelected?: boolean;
  onClick?: (marker: MapMarkerData) => void;
}
