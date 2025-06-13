import { useCallback } from "react";
import { useNodeBehavior } from "../../hooks/useNodeBehavior";
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
  // ─────────── node-specific activation ───────────
  const handleActivate = useCallback(() => {
    console.log("Link activate: opening URL", link.url);
    window.open(link.url, "_blank", "noopener,noreferrer");
  }, [link.url]);

  // ─────────── shared node behavior ───────────
  const nodeBehavior = useNodeBehavior({
    id: link.id,
    nodeType: "link",
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
        <img src={link.image} alt={link.label} className={imageSize} />
      </div>

      <h2 className={`${titleBase} ${labelClasses(nodeBehavior.isSelected)}`}>
        {link.label}
      </h2>
    </div>
  );
};
