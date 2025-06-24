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
      className="w-full h-full"
      // Add drag event tracking to directory content
      onDragOver={(e) => {
        console.log("DIR_CONTENT_01: onDragOver on DirectoryContent", {
          windowId,
          nodeId,
          target: e.target,
          currentTarget: e.currentTarget,
          draggedData: e.dataTransfer.getData("nodeId"),
        });
        // Use drag handlers to handle drops on directory content (empty space)
        return dragHandlers.handleDragOver(e, nodeId);
      }}
      onDragEnter={(e) => {
        console.log("DIR_CONTENT_02: onDragEnter on DirectoryContent", {
          windowId,
          nodeId,
          target: e.target,
          currentTarget: e.currentTarget,
        });
        return dragHandlers.handleDragEnter(e, nodeId);
      }}
      onDragLeave={(e) => {
        console.log("DIR_CONTENT_03: onDragLeave on DirectoryContent", {
          windowId,
          nodeId,
          target: e.target,
          currentTarget: e.currentTarget,
          relatedTarget: e.relatedTarget,
        });
        return dragHandlers.handleDragLeave(e);
      }}
      onDrop={(e) => {
        console.log("DIR_CONTENT_04: onDrop on DirectoryContent", {
          windowId,
          nodeId,
          target: e.target,
          currentTarget: e.currentTarget,
          draggedData: e.dataTransfer.getData("nodeId"),
        });
        return dragHandlers.handleDrop(e, nodeId);
      }}
    >
      <DirectoryLayout nodes={children} layout="window" windowId={windowId} />
    </div>
  );
};
