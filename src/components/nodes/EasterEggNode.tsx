import { useCallback } from "react";
import { useNewStore } from "../../hooks/useStore";
import { useNodeBehavior } from "../../hooks/useNodeEvents";
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
  // ─────────── node-specific store actions ───────────
  const cycleEgg = useNewStore((s) => s.cycleEasterEgg);
  const breakEgg = useNewStore((s) => s.breakEasterEgg);
  const currentImg = useNewStore((s) => s.getEasterEggCurrentImage(egg.id));

  // ─────────── node-specific activation ───────────
  const handleActivate = useCallback(() => {
    breakEgg(egg.id);
  }, [egg.id, breakEgg]);

  // ─────────── shared node behavior ───────────
  const nodeBehavior = useNodeBehavior({
    id: egg.id,
    nodeType: "easter-egg",
    enableLogging: true,
    onActivate: handleActivate,
  });

  // ─────────── special click behavior (cycle + select) ───────────
  const handleSpecialClick = useCallback(() => {
    nodeBehavior.log("special-click");
    // First select the node (shared behavior)
    const selectNode = useNewStore.getState().selectNode;
    selectNode(egg.id);
    // Then cycle the egg (special behavior)
    cycleEgg(egg.id);
  }, [egg.id, cycleEgg, nodeBehavior]);

  // ─────────── render ───────────
  return (
    <div className={tileFrame}>
      <div
        {...nodeBehavior.accessibilityProps}
        // Click handlers - using special click for single-click
        onClick={handleSpecialClick}
        onDoubleClick={nodeBehavior.handleDoubleClick}
        onKeyDown={nodeBehavior.handleKeyDown}
        // Drag source
        {...nodeBehavior.dragSourceHandlers}
        // Drop target (empty for non-directories)
        {...nodeBehavior.dropTargetHandlers}
        className={`${tileWrapper} ${containerClasses({
          selected: nodeBehavior.isSelected,
          drop: nodeBehavior.isDropTarget,
        })}`}
      >
        <img src={currentImg} alt={egg.label} className={imageSize} />
      </div>

      <h2 className={`${titleBase} ${labelClasses(nodeBehavior.isSelected)}`}>
        {egg.label}
      </h2>
    </div>
  );
};
