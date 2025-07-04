import { useCallback } from "react";
import { useNewStore } from "@/hooks/useStore";

import { useNodeEvents } from "./hooks/useNodeEvents";
import type { EasterEggEntry } from "@/types/nodeTypes";
import {
  getTitleFrame,
  getImageSize,
  getTileWrapper,
  getContainerClasses,
  getLabelClasses,
  getTitleBase,
} from "./node.styles";

type Props = { egg: EasterEggEntry; view: "icons" | "list" | "columns" };

export const EasterEggNode = ({ egg, view }: Props) => {
  // ─────────── node-specific store actions ───────────
  const cycleEgg = useNewStore((s) => s.cycleEasterEgg);
  const breakEgg = useNewStore((s) => s.breakEasterEgg);
  const currentImg = useNewStore((s) => s.getEasterEggCurrentImage(egg.id));
  const selectOneNode = useNewStore((s) => s.selectOneNode);

  // ─────────── node-specific activation ───────────
  const handleActivate = useCallback(() => {
    breakEgg(egg.id);
  }, [egg.id, breakEgg]);

  // ─────────── shared node behavior ───────────
  const nodeBehavior = useNodeEvents({
    id: egg.id,
    nodeType: "easter-egg",
    enableLogging: true,
    onActivate: handleActivate,
  });

  // ─────────── special click behavior (cycle + select) ───────────
  const handleSpecialClick = useCallback(() => {
    nodeBehavior.log("special-click");
    // First select the node (shared behavior)
    selectOneNode(egg.id);
    // Then cycle the egg (special behavior)
    cycleEgg(egg.id);
  }, [egg.id, cycleEgg, nodeBehavior, selectOneNode]);

  // ─────────── render ───────────
  return (
    <div className={getTitleFrame(view)}>
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
        className={`${getTileWrapper(view)} ${getContainerClasses({
          selected: nodeBehavior.isSelected,
          drop: nodeBehavior.isDropTarget,
          view,
        })}`}
      >
        <img src={currentImg} alt={egg.label} className={getImageSize(view)} />
      </div>

      <h2
        className={`${getTitleBase(view)} ${getLabelClasses(
          view,
          nodeBehavior.isSelected
        )}`}
      >
        {egg.label}
      </h2>
    </div>
  );
};
