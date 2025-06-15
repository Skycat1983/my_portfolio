import { useCallback } from "react";
import { useNewStore } from "../../hooks/useStore";
import { useNodeBehavior } from "../../hooks/useNodeEvents";
import type { TerminalEntry } from "../../types/nodeTypes";
import {
  containerClasses,
  imageSize,
  labelClasses,
  tileFrame,
  tileWrapper,
  titleBase,
} from "./node.styles";
import { TERMINAL } from "../../constants/images";

type Props = { terminal: TerminalEntry };

export const TerminalNode = ({ terminal }: Props) => {
  // ─────────── node-specific store actions ───────────
  const openTerminal = useNewStore((s) => s.openTerminal);

  // ─────────── node-specific activation ───────────
  const handleActivate = useCallback(() => {
    console.log("Terminal activate: opening terminal");
    openTerminal();
  }, [openTerminal]);

  // ─────────── shared node behavior ───────────
  const nodeBehavior = useNodeBehavior({
    id: terminal.id,
    nodeType: "terminal",
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
        <img src={TERMINAL} alt={terminal.label} className={imageSize} />
      </div>

      <h2 className={`${titleBase} ${labelClasses(nodeBehavior.isSelected)}`}>
        {terminal.label}
      </h2>
    </div>
  );
};
