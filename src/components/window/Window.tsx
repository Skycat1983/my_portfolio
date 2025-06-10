import { useState } from "react";
import ResizeWrapper from "./WindowWrapper";
import { WindowFrame } from "./WindowFrame";
import { WindowContent } from "./WindowContent";
import { useStore } from "../../hooks/useStore";

// Define the drag handlers type (same as in other components)
interface DragHandlers {
  handleDragStart: (e: React.DragEvent, nodeId: string) => void;
  handleDragEnd: () => void;
  handleDragOver: (e: React.DragEvent, targetNodeId?: string) => void;
  handleDragEnter: (e: React.DragEvent, targetNodeId: string) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, targetNodeId: string) => void;
  currentDropTarget: string | null;
  isValidDropTarget: () => boolean;
  isDropTarget: (nodeId: string) => boolean;
}

interface WindowProps {
  nodeId: string;
  zIndex: number;
  isMinimized?: boolean;
  dragHandlers?: DragHandlers;
}

// Main window component with both drag and resize functionality
export const Window = ({
  nodeId,
  zIndex,
  isMinimized = false,
  dragHandlers,
}: WindowProps) => {
  const [pos, setPos] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ w: 400, h: 300 });
  const titleBarHeight = 28;

  const {
    getNode,
    closeWindow,
    focusWindow,
    getWindowByNodeId,
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    getParent,
    rootId,
  } = useStore();

  const node = getNode(nodeId);
  const windowState = getWindowByNodeId(nodeId);

  // Get the current node being viewed (for title and navigation)
  const currentNodeId = windowState?.currentNodeId || nodeId;
  const currentNode = getNode(currentNodeId);

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

  const handleBack = () => {
    console.log("handleBack in Window: going back for nodeId", nodeId);
    goBack(nodeId);
  };

  const handleForward = () => {
    console.log("handleForward in Window: going forward for nodeId", nodeId);
    goForward(nodeId);
  };

  // Check navigation availability with the same logic as WindowContent
  const parent = getParent(currentNodeId);
  const canShowBack = canGoBack(nodeId) && parent && parent.id !== rootId;
  const canShowForward = canGoForward(nodeId);

  // Don't render minimized windows (for now)
  if (isMinimized) {
    return null;
  }

  return (
    <div style={{ zIndex }} onClick={handleFocus} className="absolute">
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
          title={currentNode?.label || node.label}
          onPositionChange={handlePositionChange}
          onClose={handleClose}
          onBack={handleBack}
          onForward={handleForward}
          canGoBack={canShowBack}
          canGoForward={canShowForward}
        >
          <WindowContent nodeId={nodeId} dragHandlers={dragHandlers} />
        </WindowFrame>
      </ResizeWrapper>
    </div>
  );
};

export default Window;
