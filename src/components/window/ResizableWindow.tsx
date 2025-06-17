import React from "react";
import { useResizeWindow } from "../../hooks/useWindowResize";
import { WindowHeader } from "./WindowHeader";
import type { WindowType } from "../../types/storeTypes";
import { WindowContent } from "./WindowContent";

interface ResizableWindowProps {
  window: WindowType;
  // children?: React.ReactNode;
}

export const ResizableWindow: React.FC<ResizableWindowProps> = ({
  window,
  // children,
}) => {
  const { windowId, title, width, height, x, y, zIndex, isMinimized } = window;
  const { onResizeStart } = useResizeWindow(window.windowId);

  if (isMinimized) {
    return null; // Don't render minimized windows (or render as taskbar item)
  }

  return (
    <div
      className="absolute border border-gray-300 bg-white shadow-lg rounded-lg overflow-hidden"
      style={{
        left: x,
        top: y,
        width,
        height,
        zIndex,
      }}
    >
      {/* Window Header with drag functionality */}
      <WindowHeader
        windowId={windowId}
        title={title}
        nodeType={window.nodeType}
      />

      {/* Window Content */}
      <div className="p-4 h-full overflow-auto">
        <WindowContent window={window} />
      </div>

      {/* Resize Handles */}
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
    </div>
  );
};

{
  /* {children || (
          <div>
            <h3 className="text-lg font-semibold mb-2">Test Window</h3>
            <p>Window ID: {windowId}</p>
            <p>
              Position: ({x}, {y})
            </p>
            <p>
              Size: {width} × {height}
            </p>
            <p>Z-Index: {zIndex}</p>
          </div>
        )} */
}
