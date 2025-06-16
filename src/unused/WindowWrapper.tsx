import React from "react";
import { useResize } from "./useWindowResize";

interface ResizableWrapperProps {
  children: React.ReactNode;
  pos: { x: number; y: number };
  size: { w: number; h: number };
  titleBarHeight: number;
  onSizeChange?: (size: { w: number; h: number }) => void;
  onPositionChange?: (pos: { x: number; y: number }) => void;
}

export const WindowWrapper = ({
  children,
  pos,
  size,
  titleBarHeight,
  onSizeChange,
  onPositionChange,
}: ResizableWrapperProps) => {
  const {
    cursor,
    isResizing,
    handleWindowPointerMove,
    handleWindowPointerDown,
    handlePointerLeave,
  } = useResize({
    titleBarHeight: titleBarHeight + 4, // Account for 4px padding
    onSizeChange: onSizeChange || (() => {}),
    onPositionChange: onPositionChange || (() => {}),
    currentPos: pos,
    currentSize: size,
  });

  // Handle hover to show resize cursors only in padding area
  const handleWrapperPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const { clientWidth: w, clientHeight: h } = e.currentTarget;
    const edge = 4; // Only the padding area

    // Check if hover is in the padding area
    const isInPaddingArea =
      offsetX < edge || // left padding
      offsetX > w - edge || // right padding
      offsetY < edge || // top padding
      offsetY > h - edge; // bottom padding

    if (isInPaddingArea) {
      // Only show resize cursors in padding area
      handleWindowPointerMove(e);
    }
  };

  // Custom handler that only handles edge resize, lets inner content handle its events
  const handleWrapperPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const { clientWidth: w, clientHeight: h } = e.currentTarget;
    const edge = 4; // Only the padding area should trigger resize

    // Check if click is in the padding area (invisible border)
    const isInPaddingArea =
      offsetX < edge || // left padding
      offsetX > w - edge || // right padding
      offsetY < edge || // top padding
      offsetY > h - edge; // bottom padding

    if (isInPaddingArea) {
      // Only call resize handler if in padding area
      handleWindowPointerDown(e);
    }
    // Otherwise, let the event bubble to inner content (Window component)
  };

  // Invisible border area for resize detection
  const wrapperStyle: React.CSSProperties = {
    position: "absolute",
    top: pos.y - 4, // 4px invisible border
    left: pos.x - 4,
    width: size.w + 8, // 4px on each side
    height: size.h + 8,
    padding: "4px",
    cursor: isResizing ? cursor : "default",
    touchAction: "none",
  };

  return (
    <div
      style={wrapperStyle}
      onPointerDown={handleWrapperPointerDown}
      onPointerMove={handleWrapperPointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </div>
  );
};

export default WindowWrapper;
