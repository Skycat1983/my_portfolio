import { useCallback } from "react";
import { useNodeEvents } from "./hooks/useNodeEvents";
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
  // ─────────── node-specific activation ───────────
  const handleActivate = useCallback(() => {
    console.log("Icon activate in IconNode:", icon.id);
  }, [icon.id]);

  // ─────────── shared node behavior ───────────
  const nodeBehavior = useNodeEvents({
    id: icon.id,
    nodeType: "icon",
    enableLogging: true,
    onActivate: handleActivate,
  });

  // ─────────── render ───────────
  return (
    <div className={tileFrame}>
      <div
        {...nodeBehavior.accessibilityProps}
        // Click handlers
        onClick={nodeBehavior.handleClick}
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
        <img src={icon.image} alt={icon.label} className={imageSize} />
      </div>

      <h2 className={`${titleBase} ${labelClasses(nodeBehavior.isSelected)}`}>
        {icon.label}
      </h2>
    </div>
  );
};
