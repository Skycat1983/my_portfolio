import React from "react";
import { useNewStore } from "../../hooks/useStore";

import { useWindowDrag } from "./hooks";
import { WindowControls } from "./WindowControls";
import { DirectoryNavigation } from "../apps/directory/DirectoryNavigation";

interface WindowHeaderProps {
  windowId: string;
  title?: string;
  nodeType?: string;
  className?: string;
  zIndex?: number;
  // children?: React.ReactNode;
}

export const WindowHeader: React.FC<WindowHeaderProps> = ({
  windowId,
  title,
  nodeType,
  className = "",
  // children,
}) => {
  const operatingSystem = useNewStore((state) => state.operatingSystem);
  const screenDimensions = useNewStore((state) => state.screenDimensions);
  const window = useNewStore((s) => s.getWindowById(windowId));
  const focusWindow = useNewStore((s) => s.focusWindow);
  const { onDragStart } = useWindowDrag(windowId);

  if (!window) {
    return null;
  }

  const displayTitle = title || `Window ${windowId.slice(-8)}`;

  const handleHeaderClick = () => {
    focusWindow(windowId);
  };

  const handleDragStart = (e: React.PointerEvent) => {
    // Focus window first, then start drag
    focusWindow(windowId);
    onDragStart(e);
  };

  // Use flex direction based on OS: mac = row, windows = row-reverse
  const flexDirection =
    operatingSystem === "mac" ? "flex-row" : "flex-row-reverse";

  // Mobile-specific styling
  const mobileHeaderClasses = screenDimensions.isMobile
    ? "p-2 min-h-[44px]" // Reduced from p-3 and min-h-[56px]
    : "p-2";

  const mobileTitleClasses = screenDimensions.isMobile
    ? "text-sm font-medium" // Reduced from text-base
    : "text-sm font-medium";

  return (
    <div
      className={`absolute w-full bg-gray-100 border-b border-gray-300 ${mobileHeaderClasses} flex ${flexDirection} justify-between items-center cursor-move select-none touch-manipulation ${className}`}
      onClick={handleHeaderClick}
      onPointerDown={handleDragStart}
    >
      {/* Window Controls - position determined by flex direction */}
      <div className="flex items-center space-x-1">
        <WindowControls windowId={windowId} />
      </div>

      {/* Title and custom content */}
      <div className="flex items-center min-w-0 mx-4">
        <span className={`text-gray-700 truncate ${mobileTitleClasses}`}>
          {displayTitle}
        </span>
      </div>

      <div className="flex justify-end items-center space-x-1 min-w-[10px]">
        {/* {nodeType === "directory" && (
          <DirectoryNavigation windowId={windowId} />
        )} */}
      </div>
    </div>
  );
};
