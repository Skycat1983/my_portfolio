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
  const selectNode = useNewStore((s) => s.selectNode);
  const isSelected = useNewStore((s) => s.selectedNodeId === link.id);

  // ─────────── drag & drop functionality ───────────
  const dragHandlers = useNodeDrag();

  const handleClick = useCallback(() => {
    console.log("Link single-click:", link.id);
    selectNode(link.id);
  }, [link.id, selectNode]);

  const handleDoubleClick = useCallback(() => {
    console.log("Link double-click: opening URL", link.url);
    // Open URL in new tab
    window.open(link.url, "_blank", "noopener,noreferrer");
  }, [link.url]);

  // Links are not drop targets (only directories are)
  const isDropTarget = false;

  return (
    <div className={tileFrame}>
      <div
        // Click handlers
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
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
