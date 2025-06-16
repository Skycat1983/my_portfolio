import { useNewStore } from "../../hooks/useStore";
import { WindowLayout } from "../windowContent/directory/Directory";
import type { DragHandlers } from "../../hooks/useNodeDrag";
import type { DirectoryEntry } from "../../types/nodeTypes";

interface WindowContentProps {
  nodeId: DirectoryEntry["id"];
  dragHandlers?: DragHandlers;
}

export const WindowContent = ({ nodeId, dragHandlers }: WindowContentProps) => {
  const { getWindowByNodeId } = useNewStore();

  const getNodeByID = useNewStore((s) => s.getNodeByID);
  const getChildrenByParentID = useNewStore((s) => s.getChildrenByParentID);

  // Get the window state to see what we're currently viewing
  const windowState = getWindowByNodeId(nodeId);
  const currentNodeId = windowState?.currentNodeId || nodeId;
  const node = getNodeByID(currentNodeId);

  if (!node) {
    return <div className="text-gray-400 text-center p-4">Node not found</div>;
  }

  // Determine what nodes to show
  const nodesToShow =
    node.type === "directory" ? getChildrenByParentID(currentNodeId) : [node];

  return (
    <div className="h-full flex flex-col">
      <div
        className="flex-1 overflow-auto"
        // Make the window content area a drop target for the current folder
        onDragOver={
          dragHandlers
            ? (e) => dragHandlers.handleDragOver(e, currentNodeId)
            : undefined
        }
        onDragEnter={
          dragHandlers
            ? (e) => dragHandlers.handleDragEnter(e, currentNodeId)
            : undefined
        }
        onDragLeave={dragHandlers?.handleDragLeave}
        onDrop={
          dragHandlers
            ? (e) => dragHandlers.handleDrop(e, currentNodeId)
            : undefined
        }
      >
        {nodesToShow.length === 0 ? (
          <div className="text-gray-400 text-center p-4">
            This folder is empty
          </div>
        ) : (
          <WindowLayout nodes={nodesToShow} layout="window" />
        )}
      </div>
    </div>
  );
};
