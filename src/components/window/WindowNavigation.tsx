import React from "react";
import { useNewStore } from "../../store/useStore";
import type { DirectoryWindow } from "../../types/storeTypes";

interface DirectoryNavigationProps {
  windowId: string;
}

export const DirectoryNavigation: React.FC<DirectoryNavigationProps> = ({
  windowId,
}) => {
  // Access directory navigation state and methods from store
  const window = useNewStore((state) => state.getWindowById(windowId));
  const navigateBack = useNewStore((state) => state.navigateBack);
  const navigateForward = useNewStore((state) => state.navigateForward);
  const navigateUp = useNewStore((state) => state.navigateUp);

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

  const handleUpKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.stopPropagation();
      navigateUp(windowId);
    }
  };

  return (
    <div className="flex items-center gap-1 px-2">
      {/* Back button */}
      <button
        onClick={handleBack}
        onKeyDown={handleBackKeyDown}
        disabled={!canGoBack}
        tabIndex={0}
        aria-label="Navigate back"
        className={`flex items-center justify-center w-6 h-6 rounded transition-colors ${
          canGoBack
            ? "hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
            : "opacity-50 cursor-not-allowed"
        }`}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={
            canGoBack ? "text-gray-700 dark:text-gray-300" : "text-gray-400"
          }
        >
          <path
            d="M7.5 2L3.5 6L7.5 10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Forward button */}
      <button
        onClick={handleForward}
        onKeyDown={handleForwardKeyDown}
        disabled={!canGoForward}
        tabIndex={0}
        aria-label="Navigate forward"
        className={`flex items-center justify-center w-6 h-6 rounded transition-colors ${
          canGoForward
            ? "hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
            : "opacity-50 cursor-not-allowed"
        }`}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={
            canGoForward ? "text-gray-700 dark:text-gray-300" : "text-gray-400"
          }
        >
          <path
            d="M4.5 2L8.5 6L4.5 10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Up button */}
      <button
        onClick={handleGoUp}
        onKeyDown={handleUpKeyDown}
        tabIndex={0}
        aria-label="Navigate to parent directory"
        className="flex items-center justify-center w-6 h-6 rounded transition-colors hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-gray-700 dark:text-gray-300"
        >
          <path
            d="M6 8.5L6 3.5M6 3.5L3 6.5M6 3.5L9 6.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};
