import React from "react";

import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useFinderHistory } from "./hooks/useFinderHistory";
import { useNewStore } from "@/hooks/useStore";

interface FinderNavigationProps {
  windowId: string;
}

export const FinderNavigation: React.FC<FinderNavigationProps> = ({
  windowId,
}) => {
  const window = useNewStore((s) => s.getWindowById(windowId));
  const screenDimensions = useNewStore((s) => s.screenDimensions);
  const getChildrenByParentID = useNewStore((s) => s.getChildrenByParentID);
  const deleteManyNodes = useNewStore((s) => s.deleteManyNodes);
  const nodeId = window?.nodeId;
  const isTrashWindow = nodeId === "trash";

  const { canGoBack, canGoForward, goBack, goForward } =
    useFinderHistory(windowId);

  const handleBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (canGoBack) {
      goBack();
    }
  };

  const handleForward = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (canGoForward) {
      goForward();
    }
  };

  const handleEmptyTrash = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (nodeId === "trash") {
      const trashChildren = getChildrenByParentID("trash");
      if (trashChildren.length > 0) {
        // Delete all nodes in trash
        deleteManyNodes((node) => node.parentId === "trash");
      }
    }
  };

  // Mobile-specific styling
  const buttonSize = screenDimensions.isMobile ? "p-2" : "p-1";
  const iconSize = screenDimensions.isMobile ? 24 : 20;
  const buttonGap = screenDimensions.isMobile ? "gap-2" : "gap-1";

  return (
    <div
      className={`flex items-center ${buttonGap}`}
      style={{
        position: "relative",
        zIndex: 9999,
        // backgroundColor: "rgba(255,255,255,0.9)",
        pointerEvents: "auto",
      }}
      onPointerDown={(e) => {
        e.stopPropagation(); // Prevent window drag
      }}
      onClick={(e) => {
        e.stopPropagation(); // Prevent window focus/drag
      }}
    >
      {/* Back button */}
      <div
        onPointerDown={(e) => {
          e.stopPropagation();
          handleBack(e);
        }}
        tabIndex={0}
        aria-label="Navigate back"
        className={`
          ${buttonSize} rounded transition-colors touch-manipulation
          ${
            canGoBack
              ? "bg-white hover:bg-gray-100 border-gray-300 cursor-pointer active:scale-95"
              : "bg-gray-100 border-gray-200 cursor-not-allowed opacity-50"
          }
        `}
      >
        <ChevronLeft
          size={iconSize}
          className={
            canGoBack ? "text-gray-700 dark:text-gray-300" : "text-gray-400"
          }
        />
      </div>

      {/* Forward button */}
      <div
        onPointerDown={(e) => {
          e.stopPropagation(); // Critical: stop window drag
          handleForward(e);
        }}
        tabIndex={0}
        aria-label="Navigate forward"
        className={`
          ${buttonSize} rounded transition-colors touch-manipulation
          ${
            canGoForward
              ? "bg-white hover:bg-gray-100 border-gray-300 cursor-pointer active:scale-95"
              : "bg-gray-100 border-gray-200 cursor-not-allowed opacity-50"
          }
        `}
      >
        <ChevronRight
          size={iconSize}
          className={
            canGoForward ? "text-gray-700 dark:text-gray-300" : "text-gray-400"
          }
        />
      </div>

      {/* Empty Trash Button - only show in trash window */}
      {isTrashWindow && (
        <div
          onPointerDown={(e) => {
            e.stopPropagation();
            handleEmptyTrash(e);
          }}
          tabIndex={0}
          aria-label="Empty trash"
          className={`${buttonSize} rounded transition-colors bg-neutral-400 hover:bg-red-600 border-red-400 cursor-pointer touch-manipulation active:scale-95 ${
            screenDimensions.isMobile ? "ml-2" : "ml-2"
          }`}
        >
          <Trash2 size={iconSize} className="text-white" />
        </div>
      )}
    </div>
  );
};
