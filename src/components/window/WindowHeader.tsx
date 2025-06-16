import React from "react";
import { useNewStore } from "../../hooks/useStore";
import { useDragWindow } from "../newWindow/useDragWindow";

interface WindowHeaderProps {
  windowId: string;
  title?: string;
  showCloseButton?: boolean;
  showMinimizeButton?: boolean;
  showMaximizeButton?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const WindowHeader: React.FC<WindowHeaderProps> = ({
  windowId,
  title,
  showCloseButton = true,
  showMinimizeButton = false,
  showMaximizeButton = false,
  className = "",
  children,
}) => {
  const window = useNewStore((s) => s.getWindowById(windowId));
  const focusWindow = useNewStore((s) => s.focusWindow);
  const closeWindow = useNewStore((s) => s.closeWindow);
  const minimizeWindow = useNewStore((s) => s.minimizeWindow);
  const maximizeWindow = useNewStore((s) => s.maximizeWindow);
  const restoreWindow = useNewStore((s) => s.restoreWindow);
  const { onDragStart } = useDragWindow(windowId);

  if (!window) {
    return null;
  }

  const displayTitle = title || `Window ${windowId.slice(-8)}`;

  const handleHeaderClick = () => {
    focusWindow(windowId);
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeWindow(windowId);
  };

  const handleMinimizeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    minimizeWindow(windowId);
  };

  const handleMaximizeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.isMaximized) {
      restoreWindow(windowId);
    } else {
      maximizeWindow(windowId);
    }
  };

  const handleDragStart = (e: React.PointerEvent) => {
    // Focus window first, then start drag
    focusWindow(windowId);
    onDragStart(e);
  };

  return (
    <div
      className={`bg-gray-100 border-b border-gray-300 p-2 flex justify-between items-center cursor-move select-none ${className}`}
      onClick={handleHeaderClick}
      onPointerDown={handleDragStart}
    >
      {/* Left side - Title and custom content */}
      <div className="flex items-center flex-1 min-w-0">
        <span className="text-sm font-medium text-gray-700 truncate">
          {displayTitle}
        </span>
        {children && <div className="ml-2 flex items-center">{children}</div>}
      </div>

      {/* Right side - Window controls */}
      <div className="flex items-center space-x-1 ml-2">
        {showMinimizeButton && (
          <button
            onClick={handleMinimizeClick}
            className="text-gray-500 hover:text-blue-600 text-sm font-bold w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200"
            aria-label="Minimize window"
            title="Minimize"
          >
            −
          </button>
        )}

        {showMaximizeButton && (
          <button
            onClick={handleMaximizeClick}
            className="text-gray-500 hover:text-blue-600 text-sm font-bold w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200"
            aria-label={
              window.isMaximized ? "Restore window" : "Maximize window"
            }
            title={window.isMaximized ? "Restore" : "Maximize"}
          >
            {window.isMaximized ? "⧉" : "□"}
          </button>
        )}

        {showCloseButton && (
          <button
            onClick={handleCloseClick}
            className="text-gray-500 hover:text-red-500 text-lg font-bold w-6 h-6 flex items-center justify-center rounded hover:bg-red-100"
            aria-label="Close window"
            title="Close"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
