import { useNewStore } from "@/hooks/useStore";
import { useNodeDrag } from "@/components/nodes/hooks/useNodeDrag";

import { DirectoryLayout } from "../../../pages/DesktopLayout";
import { desktopRootId } from "@/constants/nodeHierarchy";

interface DirectoryContentProps {
  windowId: string;
  nodeId: string;
}

export const DirectoryContent = ({
  windowId,
  nodeId,
}: DirectoryContentProps) => {
  const isWindow = nodeId !== desktopRootId;

  const getChildrenByParentID = useNewStore((s) => s.getChildrenByParentID);
  const children = getChildrenByParentID(nodeId);

  // Add drag handlers for the directory content (like Desktop does for root)
  const dragHandlers = useNodeDrag();

  const padding = isWindow ? "p-10" : "p-0";

  return (
    <div
      className={`w-full h-full ${padding}`}
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
      <DirectoryLayout nodes={children} windowId={windowId} />
    </div>
  );
};
