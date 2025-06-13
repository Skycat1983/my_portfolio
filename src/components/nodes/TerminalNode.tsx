import { useCallback } from "react";
import { useNewStore } from "../../hooks/useNewStore";
import { useNodeDrag } from "../../hooks/useNodeDrag";
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
  // ─────────── store actions & state ───────────
  const selectNode = useNewStore((s) => s.selectNode);
  const openTerminal = useNewStore((s) => s.openTerminal);
  const isSelected = useNewStore((s) => s.selectedNodeId === terminal.id);

  // ─────────── drag & drop functionality ───────────
  const dragHandlers = useNodeDrag();

  // ─────────── click / dbl-click handlers ───────────
  const handleClick = useCallback(() => {
    console.log("Terminal single-click:", terminal.id);
    selectNode(terminal.id);
  }, [terminal.id, selectNode]);

  const handleDoubleClick = useCallback(() => {
    console.log("Terminal double-click: opening terminal");
    openTerminal();
  }, [openTerminal]);

  // ─────────── Enter-key handler ───────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" && isSelected) {
        e.preventDefault();
        openTerminal();
      }
    },
    [isSelected, openTerminal]
  );

  // Terminals are not drop targets (only directories are)
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
        onDragStart={(e) => dragHandlers.handleDragStart(e, terminal.id)}
        onDragEnd={dragHandlers.handleDragEnd}
        className={`${tileWrapper} ${containerClasses({
          selected: isSelected,
          drop: isDropTarget,
        })}`}
      >
        <img src={TERMINAL} alt={terminal.label} className={imageSize} />
      </div>

      <h2 className={`${titleBase} ${labelClasses(isSelected)}`}>
        {terminal.label}
      </h2>
    </div>
  );
};
