import { useState, useMemo } from "react";
import ResizeWrapper from "./WindowWrapper";
import { WindowFrame } from "./WindowFrame";
import { WindowContent } from "./WindowContent";
import { useNewStore } from "../../hooks/useStore";
import {
  calculateWindowSize,
  calculateWindowPosition,
  getWindowSizeCategory,
} from "../../utils/windowSizing";
import { type DragHandlers } from "../../hooks/useNodeDrag";

interface WindowProps {
  nodeId: string;
  zIndex: number;
  dragHandlers?: DragHandlers;
}

// Main window component with both drag and resize functionality
export const Window = ({ nodeId, zIndex, dragHandlers }: WindowProps) => {
  const titleBarHeight = 28;

  const getNodeByID = useNewStore((s) => s.getNodeByID);
  const getParentByChildID = useNewStore((s) => s.getParentByChildID);
  const getChildrenByParentID = useNewStore((s) => s.getChildrenByParentID);

  const {
    closeWindow,
    focusWindow,
    getWindowByNodeId,
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    rootId,
    openWindows,
  } = useNewStore();

  const node = getNodeByID(nodeId);
  const windowState = getWindowByNodeId(nodeId);

  // Get the current node being viewed (for title and navigation)
  const currentNodeId = windowState?.currentNodeId || nodeId;
  const currentNode = getNodeByID(currentNodeId);

  // Calculate optimal size and position based on content
  const { optimalSize, optimalPosition } = useMemo(() => {
    console.log(
      "Window useMemo: calculating optimal size and position for nodeId",
      nodeId
    );

    if (!currentNode) {
      return {
        optimalSize: { w: 400, h: 300 },
        optimalPosition: { x: 100, y: 100 },
      };
    }

    // Get children to calculate content size
    const children =
      currentNode.type === "directory"
        ? getChildrenByParentID(currentNodeId)
        : [currentNode];
    const itemCount = children.length;
    const sizeCategory = getWindowSizeCategory(itemCount);

    console.log(
      "Window useMemo: found",
      itemCount,
      "items, size category:",
      sizeCategory
    );

    // Calculate size based on content
    const optimalSize = calculateWindowSize(itemCount);

    // Calculate position based on window index to stagger them
    const windowIndex = openWindows.findIndex((w) => w.id === nodeId);
    const optimalPosition = calculateWindowPosition(
      windowIndex >= 0 ? windowIndex : openWindows.length
    );

    return { optimalSize, optimalPosition };
  }, [nodeId, currentNodeId, currentNode, getChildrenByParentID, openWindows]);

  // Use calculated values as initial state, but allow user to override via resize/drag
  const [pos, setPos] = useState(optimalPosition);
  const [size, setSize] = useState(optimalSize);

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
  const parent = getParentByChildID(currentNodeId);
  const canShowBack = canGoBack(nodeId) && parent && parent.id !== rootId;
  const canShowForward = canGoForward(nodeId);

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
