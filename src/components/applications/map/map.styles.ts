export const mapContainerStyles = {
  base: "relative w-full h-full overflow-hidden rounded-lg",
  light: "brightness-100",
  dark: "brightness-90 contrast-110 hue-rotate-180 invert",
};

export const mapControlsStyles = {
  container: "absolute top-4 right-4 z-[1000] flex flex-col gap-2",
  button:
    "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 " +
    "border border-gray-300 dark:border-gray-600 rounded-md p-2 " +
    "shadow-lg transition-colors duration-200 focus:outline-none " +
    "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
  buttonDisabled: "opacity-50 cursor-not-allowed",
  icon: "w-4 h-4 text-gray-700 dark:text-gray-300",
};

export const mapMarkerStyles = {
  container:
    "relative cursor-pointer transition-transform duration-200 hover:scale-110",
  selected: "scale-125 z-[999]",
  tooltip:
    "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 " +
    "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 " +
    "px-2 py-1 rounded shadow-lg text-sm whitespace-nowrap " +
    "border border-gray-200 dark:border-gray-600",
  tooltipArrow:
    "absolute top-full left-1/2 transform -translate-x-1/2 " +
    "w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent " +
    "border-t-white dark:border-t-gray-800",
};

export const leafletOverrides = `
  .leaflet-container {
    font-family: inherit;
  }
  
  .leaflet-control-zoom {
    display: none !important;
  }
  
  .leaflet-control-attribution {
    background: rgba(255, 255, 255, 0.8) !important;
    font-size: 10px !important;
  }
  
  .dark .leaflet-control-attribution {
    background: rgba(31, 41, 55, 0.8) !important;
    color: #d1d5db !important;
  }
  
  .dark .leaflet-control-attribution a {
    color: #93c5fd !important;
  }
`;
