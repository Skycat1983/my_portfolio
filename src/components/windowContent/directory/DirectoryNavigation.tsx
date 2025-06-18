import React from "react";
import { useDirectoryWindow } from "../../../hooks/useWindowState";
import { useNewStore } from "../../../hooks/useStore";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface DirectoryNavigationProps {
  windowId: string;
}

export const DirectoryNavigation: React.FC<DirectoryNavigationProps> = ({
  windowId,
}) => {
  console.log("DirectoryNavigation rendering for windowId:", windowId);

  // Use new generic history system
  const window = useNewStore((state) => state.getWindowById(windowId));
  const directoryWindow = useDirectoryWindow(windowId);

  if (!window || window.nodeType !== "directory") {
    console.log("DirectoryNavigation: window not found or not directory type");
    return null;
  }

  // Use new generic history state
  const canGoBack = directoryWindow.canGoBack;
  const canGoForward = directoryWindow.canGoForward;

  const handleBack = (e: React.MouseEvent) => {
    console.log(
      "XXX DirectoryNavigation handleBack clicked for window:",
      windowId
    );
    e.stopPropagation();
    e.preventDefault();
    const result = directoryWindow.goBackToPath();
    console.log("DirectoryNavigation handleBack result:", result);
  };

  const handleForward = (e: React.MouseEvent) => {
    console.log(
      "XXX DirectoryNavigation handleForward clicked for window:",
      windowId
    );
    e.stopPropagation();
    e.preventDefault();
    const result = directoryWindow.goForwardToPath();
    console.log("DirectoryNavigation handleForward result:", result);
  };

  const handleBackKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      console.log("XXX DirectoryNavigation handleBackKeyDown Enter pressed");
      e.stopPropagation();
      e.preventDefault();
      directoryWindow.goBackToPath();
    }
  };

  const handleForwardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      console.log("XXX DirectoryNavigation handleForwardKeyDown Enter pressed");
      e.stopPropagation();
      e.preventDefault();
      directoryWindow.goForwardToPath();
    }
  };

  return (
    <div
      className="flex items-center gap-1 "
      style={{
        position: "relative",
        zIndex: 9999,
        // backgroundColor: "rgba(255,255,255,0.9)",
        pointerEvents: "auto",
      }}
      onPointerDown={(e) => {
        console.log("XXX DirectoryNavigation container pointerDown");
        e.stopPropagation(); // Prevent window drag
      }}
      onClick={(e) => {
        console.log("XXX DirectoryNavigation container click");
        e.stopPropagation(); // Prevent window focus/drag
      }}
    >
      {/* Back button */}

      <div
        onPointerDown={(e) => {
          console.log("XXX Back button pointerDown");
          e.stopPropagation();
          handleBack(e);
        }}
        tabIndex={0}
        aria-label="Navigate back"
        className={`
          p-1 rounded transition-colors 
          ${
            canGoBack
              ? "bg-white hover:bg-gray-100 border-gray-300 cursor-pointer"
              : "bg-gray-100 border-gray-200 cursor-not-allowed opacity-50"
          }
        `}
      >
        <ChevronLeft
          size={20}
          className={
            canGoBack ? "text-gray-700 dark:text-gray-300" : "text-gray-400"
          }
        />
      </div>

      {/* </button> */}

      {/* Forward button */}
      <div
        onClick={handleForward}
        onKeyDown={handleForwardKeyDown}
        onPointerDown={(e) => {
          console.log("XXX Forward button pointerDown");
          e.stopPropagation(); // Critical: stop window drag
          handleForward(e);
        }}
        tabIndex={0}
        aria-label="Navigate forward"
        className={`
          p-1 rounded transition-colors 
          ${
            canGoBack
              ? "bg-white hover:bg-gray-100 border-gray-300 cursor-pointer"
              : "bg-gray-100 border-gray-200 cursor-not-allowed opacity-50"
          }
        `}
      >
        <ChevronRight
          size={20}
          className={
            canGoForward ? "text-gray-700 dark:text-gray-300" : "text-gray-400"
          }
        />
      </div>
    </div>
  );
};
