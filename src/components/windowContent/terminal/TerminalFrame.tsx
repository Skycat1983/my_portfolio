import { useState } from "react";
import { useWindowPosition } from "../../hooks/useWindowPosition";
import { useNewStore } from "../../hooks/useStore";
import { createTerminalFrameStyles } from "./TerminalFrame.styles";
import { MacWindowControls } from "../controls/MacWindowControls";
import { WindowsWindowControls } from "../controls/WindowsWindowControls";

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

  // Get OS from store for window controls
  const { operatingSystem } = useNewStore();

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

  const terminalSize = size || hookSize;
  const styles = createTerminalFrameStyles({
    w: terminalSize.w,
    h: terminalSize.h,
    titleBarHeight,
    isDragging,
    hoverCursor,
  });

  const renderWindowControls = () => {
    if (operatingSystem === "mac") {
      return (
        <MacWindowControls
          onClose={onClose}
          onMinimize={() => console.log("Terminal minimize clicked")}
          onMaximize={() => console.log("Terminal maximize clicked")}
        />
      );
    } else {
      return (
        <WindowsWindowControls
          onClose={onClose}
          onMinimize={() => console.log("Terminal minimize clicked")}
          onMaximize={() => console.log("Terminal maximize clicked")}
        />
      );
    }
  };

  const renderHeaderContent = () => {
    if (operatingSystem === "mac") {
      // Mac: Controls on left, title in center
      return (
        <>
          <div className="flex items-center gap-2">
            {renderWindowControls()}
          </div>
          <span className="text-xs text-gray-300 font-medium">Terminal</span>
          <div className="flex items-center gap-1">
            {/* Empty space for symmetry */}
          </div>
        </>
      );
    } else {
      // Windows: Title on left, controls on right
      return (
        <>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-300 font-medium">Terminal</span>
          </div>
          {renderWindowControls()}
        </>
      );
    }
  };

  return (
    <div
      style={styles.terminalStyle}
      onPointerMove={handleTerminalPointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div style={styles.headerStyle} onPointerDown={handleTitleBarPointerDown}>
        {renderHeaderContent()}
      </div>
      <div style={styles.contentStyle}>
        {children || "Terminal content area"}
      </div>
    </div>
  );
};
