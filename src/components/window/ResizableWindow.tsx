import React from "react";
import { useWindowResize } from "./hooks/useWindowResize";
import { WindowHeader } from "./WindowHeader";
import type { WindowType } from "../../types/storeTypes";
import { useNewStore } from "../../hooks/useStore";
import { getWindowComponent } from "./WindowComponentRegistry";

interface ResizableWindowProps {
  window: WindowType;
  // children?: React.ReactNode;
}

export const ResizableWindow: React.FC<ResizableWindowProps> = ({
  window,
  // children,
}) => {
  const {
    windowId,
    nodeId,
    componentKey,
    title,
    width,
    height,
    x,
    y,
    zIndex,
    isMinimized,
    isMaximized,
  } = window;
  const { onResizeStart } = useWindowResize(window.windowId);
  const focusWindow = useNewStore((s) => s.focusWindow);

  if (isMinimized || !componentKey) {
    return null;
  }

  const RegistryComponent = getWindowComponent(componentKey);

  const windowStyle = isMaximized
    ? {
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        zIndex: zIndex + 1000, // Ensure fullscreen windows are above everything
      }
    : {
        left: x,
        top: y,
        width,
        height,
        zIndex,
      };

  // Conditional classes for different window states
  const windowClasses = isMaximized
    ? "fixed inset-0 bg-black shadow-none rounded-none border-none"
    : "absolute border border-gray-300 bg-white shadow-lg rounded-lg overflow-hidden";

  return (
    <div
      className={windowClasses}
      style={windowStyle}
      onClick={() => {
        focusWindow(windowId);
      }}
    >
      {/* Window Header with drag functionality */}
      <WindowHeader windowId={windowId} title={title} />

      {/* Window Content */}
      <div className="pt-9 h-full overflow-auto bg-neutral-600">
        {RegistryComponent ? (
          <RegistryComponent
            windowId={windowId}
            nodeId={nodeId}
            window={window}
          />
        ) : (
          <div>No component found</div>
        )}
      </div>

      {/* Resize Handles - only show when not maximized */}
      {!isMaximized && (
        <>
          {/* North handle */}
          <div
            className="absolute top-0 left-2 right-2 h-2 cursor-n-resize"
            onPointerDown={onResizeStart("n")}
          />

          {/* South handle */}
          <div
            className="absolute bottom-0 left-2 right-2 h-2 cursor-s-resize"
            onPointerDown={onResizeStart("s")}
          />

          {/* East handle */}
          <div
            className="absolute top-2 bottom-2 right-0 w-2 cursor-e-resize"
            onPointerDown={onResizeStart("e")}
          />

          {/* West handle */}
          <div
            className="absolute top-2 bottom-2 left-0 w-2 cursor-w-resize"
            onPointerDown={onResizeStart("w")}
          />

          {/* Corner handles */}
          {/* Northwest */}
          <div
            className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize"
            onPointerDown={onResizeStart("nw")}
          />

          {/* Northeast */}
          <div
            className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize"
            onPointerDown={onResizeStart("ne")}
          />

          {/* Southwest */}
          <div
            className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize"
            onPointerDown={onResizeStart("sw")}
          />

          {/* Southeast */}
          <div
            className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize"
            onPointerDown={onResizeStart("se")}
          />
        </>
      )}
    </div>
  );
};
