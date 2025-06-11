import { useCallback } from "react";
import { useNewStore } from "../../hooks/useNewStore";
import { useNodeDrag } from "../../hooks/useNodeDrag";
import type { LinkEntry } from "../../types/nodeTypes";
import {
  containerClasses,
  imageSize,
  labelClasses,
  tileFrame,
  tileWrapper,
  titleBase,
} from "./node.styles";

type Props = { link: LinkEntry };

export const LinkNode = ({ link }: Props) => {
  // ─────────── store & state ───────────
  const selectNode = useNewStore((s) => s.selectNode);
  const isSelected = useNewStore((s) => s.selectedNodeId === link.id);
  const moveNode = useNewStore((s) => s.moveNode);
  const deleteNode = useNewStore((s) => s.deleteNode);
  const isNodeInTrash = useNewStore((s) => s.isNodeInTrash);

  // ─────────── drag & drop functionality ───────────
  const dragHandlers = useNodeDrag();

  // ─────────── click / dbl-click handlers ───────────
  const handleClick = useCallback(() => {
    console.log("Link single-click:", link.id);
    selectNode(link.id);
  }, [link.id, selectNode]);

  const openUrl = useCallback(() => {
    console.log("Link activate: opening URL", link.url);
    window.open(link.url, "_blank", "noopener,noreferrer");
  }, [link.url]);

  const handleDoubleClick = openUrl;

  // ─────────── Enter-key handler ───────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" && isSelected) {
        e.preventDefault();
        console.log("Link Enter-press:", link.id);
      }
      if (e.key === "Delete" && isSelected) {
        e.preventDefault();

        if (isNodeInTrash(link.id)) {
          deleteNode(link.id);
        } else {
          moveNode(link.id, "trash");
        }
      }
    },
    [isSelected, link.id, moveNode, deleteNode, isNodeInTrash]
  );

  // Links are not drop targets (only directories are)
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
        onDragStart={(e) => dragHandlers.handleDragStart(e, link.id)}
        onDragEnd={dragHandlers.handleDragEnd}
        className={`${tileWrapper} ${containerClasses({
          selected: isSelected,
          drop: isDropTarget,
        })}`}
      >
        <img src={link.image} alt={link.label} className={imageSize} />
      </div>

      <h2 className={`${titleBase} ${labelClasses(isSelected)}`}>
        {link.label}
      </h2>
    </div>
  );
};
