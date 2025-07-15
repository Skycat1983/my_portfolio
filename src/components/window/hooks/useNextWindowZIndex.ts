import { useNewStore } from "@/hooks/useStore";

/**
 * Custom hook to get the proper zIndex for dropdowns/menus
 * Since we don't have a windowId, we find the highest zIndex among all windows
 * and add a buffer to ensure dropdowns are always on top
 */
export const useDropdownZIndex = () => {
  const { windows, nextZIndex } = useNewStore();

  // Find the highest zIndex among all windows
  const highestWindowZIndex =
    windows.length > 0
      ? Math.max(...windows.map((window) => window.zIndex))
      : 0;

  // Return the higher of nextZIndex or highest window zIndex, plus buffer
  const dropdownZIndex = Math.max(nextZIndex, highestWindowZIndex) + 1000;

  console.log(
    "useDropdownZIndex: calculated zIndex",
    dropdownZIndex,
    "from windows:",
    windows.length
  );

  return dropdownZIndex;
};
