import React from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useWindowHistory } from "../../window/hooks/useWindowHistory";

interface DirectoryNavigationProps {
  windowId: string;
}

export const DirectoryNavigation: React.FC<DirectoryNavigationProps> = ({
  windowId,
}) => {
  const {
    canGoBackInWindowHistory,
    canGoForwardInWindowHistory,
    handleGoBackInWindowHistory,
    handleGoForwardInWindowHistory,
  } = useWindowHistory(windowId);

  const handleBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (canGoBackInWindowHistory(windowId)) {
      handleGoBackInWindowHistory();
    }
  };

  const handleForward = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (canGoForwardInWindowHistory(windowId)) {
      handleGoForwardInWindowHistory();
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
        e.stopPropagation(); // Prevent window drag

        console.log("DirectoryNavigation container pointerDown");
      }}
      onClick={(e) => {
        e.stopPropagation(); // Prevent window focus/drag

        console.warn("DirectoryNavigation container click!!!!!");
      }}
    >
      {/* Back button */}

      <div
        onPointerDown={(e) => {
          console.log("Back button pointerDown");
          e.stopPropagation();
          handleBack(e);
        }}
        tabIndex={0}
        aria-label="Navigate back"
        className={`
          p-1 rounded transition-colors 
          ${
            canGoBackInWindowHistory(windowId)
              ? "bg-white hover:bg-gray-100 border-gray-300 cursor-pointer"
              : "bg-gray-100 border-gray-200 cursor-not-allowed opacity-50"
          }
        `}
      >
        <ChevronLeft
          size={20}
          className={
            canGoBackInWindowHistory(windowId)
              ? "text-gray-700 dark:text-gray-300"
              : "text-gray-400"
          }
        />
      </div>

      <div
        onPointerDown={(e) => {
          console.log("Forward button pointerDown");
          e.stopPropagation(); // Critical: stop window drag
          handleForward(e);
        }}
        tabIndex={0}
        aria-label="Navigate forward"
        className={`
          p-1 rounded transition-colors 
          ${
            canGoForwardInWindowHistory(windowId)
              ? "bg-white hover:bg-gray-100 border-gray-300 cursor-pointer"
              : "bg-gray-100 border-gray-200 cursor-not-allowed opacity-50"
          }
        `}
      >
        <ChevronRight
          size={20}
          className={
            canGoForwardInWindowHistory(windowId)
              ? "text-gray-700 dark:text-gray-300"
              : "text-gray-400"
          }
        />
      </div>
    </div>
  );
};
