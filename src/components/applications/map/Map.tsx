import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useTheme } from "next-themes";
import { useNewStore } from "@/hooks/useStore";
import "leaflet/dist/leaflet.css";
import type { MapMarkerData, MapViewport } from "./types";
import { MapControls } from "./MapControls";
import { MapMarker } from "./MapMarker";
import { mapContainerStyles, leafletOverrides } from "./map.styles";

// City coordinates mapping
const CITY_COORDINATES: Record<string, [number, number]> = {
  London: [51.5074, -0.1278],
  Paris: [48.8566, 2.3522],
  Berlin: [52.52, 13.405],
  Madrid: [40.4168, -3.7038],
  Rome: [41.9028, 12.4964],
  Amsterdam: [52.3676, 4.9041],
  Brussels: [50.8503, 4.3517],
  Vienna: [48.2082, 16.3738],
  Copenhagen: [55.6761, 12.5683],
  Stockholm: [59.3293, 18.0686],
  Oslo: [59.9139, 10.7522],
  Helsinki: [60.1699, 24.9384],
  Moscow: [55.7558, 37.6173],
  Tokyo: [35.6762, 139.6503],
  Beijing: [39.9042, 116.4074],
  Seoul: [37.5665, 126.978],
  Singapore: [1.3521, 103.8198],
  Sydney: [-33.8688, 151.2093],
  Wellington: [-41.2866, 174.7756],
  "New York": [40.7128, -74.006],
  "Los Angeles": [34.0522, -118.2437],
  Chicago: [41.8781, -87.6298],
  Toronto: [43.6532, -79.3832],
  "Mexico City": [19.4326, -99.1332],
  "Rio de Janeiro": [-22.9068, -43.1729],
  "Buenos Aires": [-34.6037, -58.3816],
  Cairo: [30.0444, 31.2357],
  Dubai: [25.2048, 55.2708],
  Mumbai: [19.076, 72.8777],
  Bangkok: [13.7563, 100.5018],
};

// Default map configuration
const DEFAULT_CENTER: [number, number] = [51.5074, -0.1278]; // London
const DEFAULT_ZOOM = 13;
const MIN_ZOOM = 3;
const MAX_ZOOM = 18;

// Component to handle map instance and zoom controls
const MapController = ({
  onMapReady,
}: {
  onMapReady: (mapInstance: L.Map) => void;
}) => {
  const map = useMap();
  const selectedCity = useNewStore((s) => s.selectedCity);

  useEffect(() => {
    if (map) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  // Update map view when selected city changes
  useEffect(() => {
    if (map && selectedCity && CITY_COORDINATES[selectedCity]) {
      const [lat, lng] = CITY_COORDINATES[selectedCity];
      map.setView([lat, lng], DEFAULT_ZOOM);
    }
  }, [map, selectedCity]);

  return null;
};

export const Map = () => {
  const { theme } = useTheme();
  const mapRef = useRef<L.Map | null>(null);
  const selectedCity = useNewStore((s) => s.selectedCity);
  const [viewport, setViewport] = useState<MapViewport>(() => {
    if (selectedCity && CITY_COORDINATES[selectedCity]) {
      const [lat, lng] = CITY_COORDINATES[selectedCity];
      return {
        center: { lat, lng },
        zoom: DEFAULT_ZOOM,
      };
    }
    return {
      center: { lat: DEFAULT_CENTER[0], lng: DEFAULT_CENTER[1] },
      zoom: DEFAULT_ZOOM,
    };
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
    if (mapRef.current && selectedCity && CITY_COORDINATES[selectedCity]) {
      const [lat, lng] = CITY_COORDINATES[selectedCity];
      mapRef.current.setView([lat, lng], DEFAULT_ZOOM);
    } else if (mapRef.current) {
      mapRef.current.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    }
  };

  // Generate markers for all cities
  const cityMarkers: MapMarkerData[] = Object.entries(CITY_COORDINATES).map(
    ([city, [lat, lng]]) => ({
      id: city,
      position: { lat, lng },
      title: city,
      description: `${city} - ${
        selectedCity === city ? "Current Location" : "Click to view"
      }`,
    })
  );

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
          center={[viewport.center.lat, viewport.center.lng]}
          zoom={viewport.zoom}
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

          {/* Render markers for all cities */}
          {cityMarkers.map((marker) => (
            <MapMarker
              key={marker.id}
              marker={marker}
              isSelected={
                selectedMarker === marker.id || selectedCity === marker.id
              }
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
