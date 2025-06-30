import { useNewStore } from "../../../hooks/useStore";
import { useNodeDrag } from "../../nodes/hooks/useNodeDrag";

import type { DirectoryWindow } from "../../../types/storeTypes";
import { DirectoryLayout } from "./DirectoryLayout";

export const DirectoryContent = ({ window }: { window: DirectoryWindow }) => {
  const { nodeId, windowId } = window;
  const getChildrenByParentID = useNewStore((s) => s.getChildrenByParentID);
  const children = getChildrenByParentID(nodeId);

  // Add drag handlers for the directory content (like Desktop does for root)
  const dragHandlers = useNodeDrag();

  console.log("DIR_CONTENT_00: DirectoryContent setup", {
    windowId,
    nodeId,
    childrenCount: children.length,
    hasDragHandlers: !!dragHandlers,
  });
  console.log("children", children);

  return (
    <div
      className="w-full h-full p-10"
      // Add drag event tracking to directory content
      onDragOver={(e) => {
        // Use drag handlers to handle drops on directory content (empty space)
        return dragHandlers.handleDragOver(e, nodeId);
      }}
      onDragEnter={(e) => {
        return dragHandlers.handleDragEnter(e, nodeId);
      }}
      onDragLeave={(e) => {
        return dragHandlers.handleDragLeave(e);
      }}
      onDrop={(e) => {
        return dragHandlers.handleDrop(e, nodeId);
      }}
    >
      <DirectoryLayout nodes={children} isWindow={true} />
    </div>
  );
};
