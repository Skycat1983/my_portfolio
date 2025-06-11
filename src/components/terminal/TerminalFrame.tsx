import { useState } from "react";
import { useWindowPosition } from "../../hooks/useWindowPosition";
import { TerminalHeader } from "./TerminalHeader";

interface TerminalFrameProps {
  pos?: { x: number; y: number };
  size?: { w: number; h: number };
  onPositionChange?: (pos: { x: number; y: number }) => void;
  children?: React.ReactNode;
  onClose?: () => void;
}

// The visual terminal frame (header + content area) with Mac terminal styling
export const TerminalFrame = ({
  pos,
  size,
  onPositionChange,
  children,
  onClose,
}: TerminalFrameProps) => {
  const titleBarHeight = 28;
  const [hoverCursor, setHoverCursor] = useState<string>("default");

  // Use provided pos/size or defaults from hook
  const {
    size: hookSize,
    isDragging,
    handleTitleBarPointerDown,
  } = useWindowPosition({
    initialPos: pos || { x: 150, y: 150 },
    initialSize: size || { w: 600, h: 400 },
    onPositionChange,
    currentPos: pos,
    currentSize: size,
  });

  // Handle hover to show appropriate cursor (move in title bar, default elsewhere)
  const handleTerminalPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) return; // Don't change cursor while dragging

    const { offsetY } = e.nativeEvent;

    if (offsetY <= titleBarHeight) {
      setHoverCursor("move"); // Show move cursor in title bar
    } else {
      setHoverCursor("default"); // Show default cursor in content area
    }
  };

  const handlePointerLeave = () => {
    if (!isDragging) {
      setHoverCursor("default");
    }
  };

  // Use props if provided, otherwise use hook values
  const terminalSize = size || hookSize;

  // Mac terminal styling - dark theme with characteristic appearance
  const terminalStyle: React.CSSProperties = {
    position: "relative", // Changed from absolute since wrapper handles positioning
    width: terminalSize.w,
    height: terminalSize.h,
    background: "#1a1a1a", // Very dark background like Mac terminal
    border: "1px solid #333333", // Dark border
    borderRadius: 8,
    boxShadow: "0 10px 25px rgba(0,0,0,0.4)", // Stronger shadow for depth
    touchAction: "none",
    cursor: isDragging ? "move" : hoverCursor,
    overflow: "hidden",
    fontFamily:
      "SF Mono, Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
  };

  const contentStyle: React.CSSProperties = {
    height: terminalSize.h - titleBarHeight,
    padding: "12px",
    overflow: "auto",
    color: "#00ff00", // Classic green terminal text
    background: "#000000", // Pure black background for content
    fontSize: "13px",
    lineHeight: "1.4",
  };

  return (
    <div
      style={terminalStyle}
      onPointerMove={handleTerminalPointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <TerminalHeader
        isDragging={isDragging}
        onPointerDown={handleTitleBarPointerDown}
        onClose={onClose}
      />
      <div style={contentStyle}>{children || "Terminal content area"}</div>
    </div>
  );
};
