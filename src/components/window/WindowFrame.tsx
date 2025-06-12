import { useState } from "react";
import { useWindowPosition } from "../../hooks/useWindowPosition";
import { createWindowFrameStyles } from "./WindowFrame.styles";
import { WindowHeader } from "./WindowHeader";

interface WindowFrameProps {
  pos?: { x: number; y: number };
  size?: { w: number; h: number };
  onPositionChange?: (pos: { x: number; y: number }) => void;
  title?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  onBack?: () => void;
  onForward?: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
}

// The visual window frame (header + content area)
export const WindowFrame = ({
  pos,
  size,
  onPositionChange,
  title,
  children,
  onClose,
  onBack,
  onForward,
  canGoBack,
  canGoForward,
}: WindowFrameProps) => {
  const titleBarHeight = 28;
  const [hoverCursor, setHoverCursor] = useState<string>("default");

  // Use provided pos/size or defaults from hook
  const {
    size: hookSize,
    isDragging,
    handleTitleBarPointerDown,
  } = useWindowPosition({
    initialPos: pos || { x: 100, y: 100 },
    initialSize: size || { w: 400, h: 300 },
    onPositionChange,
    currentPos: pos,
    currentSize: size,
  });

  // Handle hover to show appropriate cursor (move in title bar, default elsewhere)
  const handleWindowPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
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
  const windowSize = size || hookSize;
  const styles = createWindowFrameStyles({
    w: windowSize.w,
    h: windowSize.h,
    titleBarHeight,
    isDragging,
    hoverCursor,
  });

  return (
    <div
      style={styles.windowStyle}
      onPointerMove={handleWindowPointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <WindowHeader
        title={title}
        isDragging={isDragging}
        onPointerDown={handleTitleBarPointerDown}
        onClose={onClose}
        onBack={onBack}
        onForward={onForward}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
      />
      <div style={styles.contentStyle}>{children || "Window content area"}</div>
    </div>
  );
};
