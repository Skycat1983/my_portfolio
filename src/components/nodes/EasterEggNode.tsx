import { useNewStore } from "../../hooks/useNewStore";
import { useNodeDrag } from "../../hooks/useNodeDrag";
import type { EasterEggEntry } from "../../types/nodeTypes";
import {
  containerClasses,
  labelClasses,
  tileWrapper,
  tileFrame,
  imageSize,
  titleBase,
} from "./node.styles";

type Props = { egg: EasterEggEntry };

export const EasterEggNode = ({ egg }: Props) => {
  // ────────────────────── store selectors ─────────────────────
  const cycleEgg = useNewStore((s) => s.cycleEasterEgg);
  const selectNode = useNewStore((s) => s.selectNode);
  const breakEgg = useNewStore((s) => s.breakEasterEgg);

  const currentImg = useNewStore((s) => s.getEasterEggCurrentImage(egg.id));
  const isSelected = useNewStore((s) => s.selectedNodeId === egg.id);

  // ─────────── drag & drop functionality ───────────
  const dragHandlers = useNodeDrag();

  // ────────────────────── handlers ────────────────────────────
  const handleClick = () => {
    selectNode(egg.id);
    cycleEgg(egg.id);
  };

  // Easter eggs are not drop targets (only directories are)
  const isDropTarget = false;

  // ────────────────────── render ──────────────────────────────
  return (
    <div className={tileFrame}>
      <div
        // Click handlers
        onClick={handleClick}
        onDoubleClick={() => breakEgg(egg.id)}
        // Drag source (can be dragged)
        draggable="true"
        onDragStart={(e) => dragHandlers.handleDragStart(e, egg.id)}
        onDragEnd={dragHandlers.handleDragEnd}
        className={`${tileWrapper} ${containerClasses({
          selected: isSelected,
          drop: isDropTarget,
        })}`}
      >
        <img src={currentImg} alt={egg.label} className={imageSize} />
      </div>

      <h2 className={`${titleBase} ${labelClasses(isSelected)}`}>
        {egg.label}
      </h2>
    </div>
  );
};
