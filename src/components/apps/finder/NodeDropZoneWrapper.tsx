import { useNewStore } from "../../../hooks/useStore";
import { useNodeDrag } from "../../nodes/hooks/useNodeDrag";

interface NodeDropZoneProps {
  nodeId: string;
  shrinkToFit: boolean;
  children: React.ReactNode;
}

export const NodeDropZoneWrapper = ({
  nodeId,
  shrinkToFit,
  children,
}: NodeDropZoneProps) => {
  const rootId = useNewStore((s) => s.rootId);
  const isWindow = nodeId !== rootId;

  const dragHandlers = useNodeDrag();

  const padding = shrinkToFit ? "p-0" : isWindow ? "p-10" : "p-0";
  const heightWidth = !shrinkToFit ? "h-full w-full" : "h-auto w-auto";

  return (
    <div
      className={`${heightWidth} ${padding} bg-red-200`}
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
      {children}
    </div>
  );
};

// console.log("NODE_DROP_ZONE_01: nodeId", nodeId);
// console.log("NODE_DROP_ZONE_01: isWindow", isWindow);
// console.log("NODE_DROP_ZONE_01: rootId", rootId);
// console.log("NODE_DROP_ZONE_01: children", children);
// console.log("NODE_DROP_ZONE_01: padding", padding);
// console.log("NODE_DROP_ZONE_01: dragHandlers", dragHandlers);
