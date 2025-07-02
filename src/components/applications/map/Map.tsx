import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useTheme } from "next-themes";
import "leaflet/dist/leaflet.css";
import type { MapMarkerData, MapViewport } from "./types";
import { MapControls } from "./MapControls";
import { MapMarker } from "./MapMarker";
import { mapContainerStyles, leafletOverrides } from "./map.styles";

// Default map configuration
const DEFAULT_CENTER: [number, number] = [37.7749, -122.4194]; // San Francisco
const DEFAULT_ZOOM = 13;
const MIN_ZOOM = 3;
const MAX_ZOOM = 18;

// Sample markers for demonstration
const SAMPLE_MARKERS: MapMarkerData[] = [
  {
    id: "1",
    position: { lat: 37.7749, lng: -122.4194 },
    title: "San Francisco",
    description: "Beautiful city by the bay",
  },
  {
    id: "2",
    position: { lat: 37.7849, lng: -122.4094 },
    title: "Financial District",
    description: "Heart of business in SF",
  },
];

// Component to handle map instance and zoom controls
const MapController = ({
  onMapReady,
}: {
  onMapReady: (mapInstance: L.Map) => void;
}) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  return null;
};

export const Map = () => {
  const { theme } = useTheme();
  const mapRef = useRef<L.Map | null>(null);
  const [viewport, setViewport] = useState<MapViewport>({
    center: { lat: DEFAULT_CENTER[0], lng: DEFAULT_CENTER[1] },
    zoom: DEFAULT_ZOOM,
  });
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  // Handle map instance ready
  const handleMapReady = (mapInstance: L.Map) => {
    mapRef.current = mapInstance;

    // Update viewport when map moves
    mapInstance.on("moveend", () => {
      const center = mapInstance.getCenter();
      const zoom = mapInstance.getZoom();
      setViewport({
        center: { lat: center.lat, lng: center.lng },
        zoom,
      });
    });
  };

  // Zoom controls handlers
  const handleZoomIn = () => {
    if (mapRef.current && viewport.zoom < MAX_ZOOM) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current && viewport.zoom > MIN_ZOOM) {
      mapRef.current.zoomOut();
    }
  };

  const handleResetView = () => {
    if (mapRef.current) {
      mapRef.current.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    }
  };

  // Marker click handler
  const handleMarkerClick = (marker: MapMarkerData) => {
    setSelectedMarker(marker.id === selectedMarker ? null : marker.id);
    if (mapRef.current) {
      mapRef.current.setView(
        [marker.position.lat, marker.position.lng],
        viewport.zoom
      );
    }
  };

  // Apply theme-based styling
  const containerClass = `${mapContainerStyles.base} ${
    theme === "dark" ? mapContainerStyles.dark : mapContainerStyles.light
  }`;

  return (
    <div className="w-full h-full relative">
      {/* Inject custom CSS for Leaflet */}
      <style dangerouslySetInnerHTML={{ __html: leafletOverrides }} />

      <div className={containerClass}>
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          className="w-full h-full"
          zoomControl={false}
          attributionControl={true}
        >
          <MapController onMapReady={handleMapReady} />

          {/* Tile layer - OpenStreetMap */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Render markers */}
          {SAMPLE_MARKERS.map((marker) => (
            <MapMarker
              key={marker.id}
              marker={marker}
              isSelected={selectedMarker === marker.id}
              onClick={handleMarkerClick}
            />
          ))}
        </MapContainer>

        {/* Custom Controls */}
        <MapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetView={handleResetView}
          currentZoom={viewport.zoom}
          maxZoom={MAX_ZOOM}
          minZoom={MIN_ZOOM}
        />
      </div>
    </div>
  );
};
