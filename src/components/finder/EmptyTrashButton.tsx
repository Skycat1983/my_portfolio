import React from "react";
import { Trash2 } from "lucide-react";
import { useNewStore } from "@/hooks/useStore";
import type { WindowId } from "@/constants/applicationRegistry";

interface EmptyTrashButtonProps {
  windowId: WindowId;
}

export const EmptyTrashButton: React.FC<EmptyTrashButtonProps> = ({
  windowId,
}) => {
  const window = useNewStore((s) => s.findWindowById(windowId));
  const screenDimensions = useNewStore((s) => s.screenDimensions);
  const getChildrenByParentID = useNewStore((s) => s.getChildrenByParentID);
  const deleteOneNode = useNewStore((s) => s.deleteOneNode);
  const nodeId = window?.nodeId;
  const isTrashWindow = nodeId === "trash";

  const handleEmptyTrash = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (nodeId === "trash") {
      const trashChildren = getChildrenByParentID("trash");
      if (trashChildren.length > 0) {
        console.log(
          "EmptyTrash: deleting",
          trashChildren.length,
          "nodes from trash"
        );

        // Delete each node individually using deleteOneNode
        trashChildren.forEach((childNode) => {
          const success = deleteOneNode((node) => node.id === childNode.id);
          console.log(
            "EmptyTrash: deleted node",
            childNode.id,
            "success:",
            success
          );
        });
      }
    }
  };

  // Don't render if not in trash window
  if (!isTrashWindow) {
    return null;
  }

  // Mobile-specific styling
  const buttonSize = screenDimensions.isMobile ? "p-2" : "p-1";
  const iconSize = screenDimensions.isMobile ? 24 : 20;

  return (
    <div
      onPointerDown={(e) => {
        e.stopPropagation();
        handleEmptyTrash(e);
      }}
      tabIndex={0}
      aria-label="Empty trash"
      className={`${buttonSize} rounded transition-colors bg-neutral-400 hover:bg-red-600 border-red-400 cursor-pointer touch-manipulation active:scale-95 ${
        screenDimensions.isMobile ? "ml-2" : "ml-2"
      }`}
    >
      <Trash2 size={iconSize} className="text-white" />
    </div>
  );
};
