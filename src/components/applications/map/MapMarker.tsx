import { Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { MapPin } from "lucide-react";
import type { MapMarkerProps } from "./types";

// Create custom icon for markers
const createCustomIcon = (color = "#3b82f6") =>
  new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

export const MapMarker = ({
  marker,
  isSelected = false,
  onClick,
}: MapMarkerProps) => {
  const handleMarkerClick = () => {
    if (onClick) {
      onClick(marker);
    }
  };

  const markerIcon = createCustomIcon(isSelected ? "#ef4444" : "#3b82f6");

  return (
    <Marker
      position={[marker.position.lat, marker.position.lng]}
      icon={markerIcon}
      eventHandlers={{
        click: handleMarkerClick,
      }}
    >
      <Popup>
        <div className="p-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {marker.title}
          </h3>
          {marker.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {marker.description}
            </p>
          )}
          <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-500">
            <MapPin className="w-3 h-3 mr-1" />
            <span>
              {marker.position.lat.toFixed(4)}, {marker.position.lng.toFixed(4)}
            </span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};
