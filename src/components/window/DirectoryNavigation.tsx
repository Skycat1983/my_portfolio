import React from "react";
import { useNewStore } from "../../hooks/useStore";
import type { DirectoryWindow } from "../../types/storeTypes";

interface DirectoryNavigationProps {
  windowId: string;
}

export const DirectoryNavigation: React.FC<DirectoryNavigationProps> = ({
  windowId,
}) => {
  // Access directory navigation state from store
  const window = useNewStore((state) => state.getWindowById(windowId));

  // TODO: Uncomment when directoryOperationsSlice is integrated into main store
  // const navigateBack = useNewStore((state) => state.navigateBack);
  // const navigateForward = useNewStore((state) => state.navigateForward);
  // const navigateUp = useNewStore((state) => state.navigateUp);

  // Placeholder functions until store methods are available
  const navigateBack = (windowId: string) => {
    console.log("navigateBack placeholder called for window:", windowId);
  };
  const navigateForward = (windowId: string) => {
    console.log("navigateForward placeholder called for window:", windowId);
  };
  const navigateUp = (windowId: string) => {
    console.log("navigateUp placeholder called for window:", windowId);
  };

  if (!window || window.nodeType !== "directory") {
    return null;
  }

  // Cast to DirectoryWindow to access navigation properties
  const dirWindow = window as DirectoryWindow;
  const canGoBack = dirWindow.canGoBack || false;
  const canGoForward = dirWindow.canGoForward || false;

  const handleBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigateBack(windowId);
  };

  const handleForward = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigateForward(windowId);
  };

  const handleGoUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigateUp(windowId);
  };

  const handleBackKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.stopPropagation();
      navigateBack(windowId);
    }
  };

  const handleForwardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.stopPropagation();
      navigateForward(windowId);
    }
  };

  const handleGoUpKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.stopPropagation();
      navigateUp(windowId);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      <button
        onClick={handleBack}
        disabled={!canGoBack}
        className={`w-6 h-6 flex items-center justify-center rounded text-sm font-medium transition-colors ${
          canGoBack
            ? "text-gray-700 hover:bg-gray-200 cursor-pointer"
            : "text-gray-400 cursor-not-allowed"
        }`}
        aria-label="Go back"
        title="Back"
        tabIndex={0}
        onKeyDown={handleBackKeyDown}
      >
        ←
      </button>

      <button
        onClick={handleForward}
        disabled={!canGoForward}
        className={`w-6 h-6 flex items-center justify-center rounded text-sm font-medium transition-colors ${
          canGoForward
            ? "text-gray-700 hover:bg-gray-200 cursor-pointer"
            : "text-gray-400 cursor-not-allowed"
        }`}
        aria-label="Go forward"
        title="Forward"
        tabIndex={0}
        onKeyDown={handleForwardKeyDown}
      >
        →
      </button>

      <button
        onClick={handleGoUp}
        className="w-6 h-6 flex items-center justify-center rounded text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer transition-colors"
        aria-label="Go up one level"
        title="Up"
        tabIndex={0}
        onKeyDown={handleGoUpKeyDown}
      >
        ↑
      </button>
    </div>
  );
};
