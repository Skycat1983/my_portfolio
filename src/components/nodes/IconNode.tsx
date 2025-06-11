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

  // ─────────── drag & drop functionality ───────────
  const dragHandlers = useNodeDrag();

  const handleClick = () => {
    selectNode(icon.id);
  };

  // Icons are not drop targets (only directories are)
  const isDropTarget = false;

  return (
    <div className={tileFrame}>
      <div
        // Click handlers
        onClick={handleClick}
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
