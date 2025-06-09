import { useState } from "react";
import ResizeWrapper from "./WindowWrapper";
import { WindowFrame } from "./WindowFrame";
import { WindowContent } from "./WindowContent";
import { useStore } from "../../hooks/useStore";

interface WindowProps {
  nodeId: string;
  zIndex: number;
  isMinimized?: boolean;
}

// Main window component with both drag and resize functionality
export const Window = ({
  nodeId,
  zIndex,
  isMinimized = false,
}: WindowProps) => {
  const [pos, setPos] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ w: 400, h: 300 });
  const titleBarHeight = 28;

  const { getNode, closeWindow, focusWindow } = useStore();
  const node = getNode(nodeId);

  if (!node) {
    console.log("Window: Node not found for nodeId", nodeId);
    return null;
  }

  const handleSizeChange = (newSize: { w: number; h: number }) => {
    setSize(newSize);
  };

  const handlePositionChange = (newPos: { x: number; y: number }) => {
    setPos(newPos);
  };

  const handleClose = () => {
    console.log("handleClose in Window: closing window for nodeId", nodeId);
    closeWindow(nodeId);
  };

  const handleFocus = () => {
    console.log("handleFocus in Window: focusing window for nodeId", nodeId);
    focusWindow(nodeId);
  };

  // Don't render minimized windows (for now)
  if (isMinimized) {
    return null;
  }

  return (
    <div
      style={{ zIndex }}
      onClick={handleFocus}
      className="absolute opacity-95"
    >
      <ResizeWrapper
        pos={pos}
        size={size}
        titleBarHeight={titleBarHeight}
        onSizeChange={handleSizeChange}
        onPositionChange={handlePositionChange}
      >
        <WindowFrame
          pos={pos}
          size={size}
          title={node.label}
          onPositionChange={handlePositionChange}
          onClose={handleClose}
        >
          <WindowContent nodeId={nodeId} />
        </WindowFrame>
      </ResizeWrapper>
    </div>
  );
};

export default Window;
