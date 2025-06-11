import { useCallback } from "react";
import { useNewStore } from "../../hooks/useNewStore";
import { useNodeDrag } from "../../hooks/useNodeDrag";
import type { IconEntry } from "../../types/nodeTypes";
import {
  containerClasses,
  imageSize,
  labelClasses,
  tileFrame,
  tileWrapper,
  titleBase,
} from "./node.styles";

type Props = { icon: IconEntry };

export const IconNode = ({ icon }: Props) => {
  const selectNode = useNewStore((s) => s.selectNode);
  const isSelected = useNewStore((s) => s.selectedNodeId === icon.id);
  const moveNode = useNewStore((s) => s.moveNode);
  const deleteNode = useNewStore((s) => s.deleteNode);
  const isNodeInTrash = useNewStore((s) => s.isNodeInTrash);

  // ─────────── drag & drop functionality ───────────
  const dragHandlers = useNodeDrag();

  // ─────────── click / dbl-click handlers ───────────
  const handleClick = () => {
    selectNode(icon.id);
  };

  const handleDoubleClick = useCallback(() => {
    console.log("Icon double-click:", icon.id);
  }, [icon.id]);

  // ─────────── Enter-key handler ───────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" && isSelected) {
        e.preventDefault();
        console.log("Icon Enter-press:", icon.id);
      }
      if (e.key === "Delete" && isSelected) {
        e.preventDefault();

        if (isNodeInTrash(icon.id)) {
          deleteNode(icon.id);
        } else {
          moveNode(icon.id, "trash");
        }
      }
    },
    [isSelected, icon.id, deleteNode, moveNode, isNodeInTrash]
  );

  // Icons are not drop targets (only directories are)
  const isDropTarget = false;

  // ─────────── render ───────────
  return (
    <div className={tileFrame}>
      <div
        role="button"
        tabIndex={0}
        aria-selected={isSelected}
        // Click handlers
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onKeyDown={handleKeyDown}
        // Drag source (can be dragged)
        draggable="true"
        onDragStart={(e) => dragHandlers.handleDragStart(e, icon.id)}
        onDragEnd={dragHandlers.handleDragEnd}
        className={`${tileWrapper} ${containerClasses({
          selected: isSelected,
          drop: isDropTarget,
        })}`}
      >
        <img src={icon.image} alt={icon.label} className={imageSize} />
      </div>

      <h2 className={`${titleBase} ${labelClasses(isSelected)}`}>
        {icon.label}
      </h2>
    </div>
  );
};
