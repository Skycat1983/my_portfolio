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

type Props = { terminal: TerminalEntry };

export const TerminalNode = ({ terminal }: Props) => {
  const selectNode = useNewStore((s) => s.selectNode);
  const openTerminal = useNewStore((s) => s.openTerminal);
  const isSelected = useNewStore((s) => s.selectedNodeId === terminal.id);

  // ─────────── drag & drop functionality ───────────
  const dragHandlers = useNodeDrag();

  const handleClick = useCallback(() => {
    console.log("Terminal single-click:", terminal.id);
    selectNode(terminal.id);
  }, [terminal.id, selectNode]);

  const handleDoubleClick = useCallback(() => {
    console.log("Terminal double-click: opening terminal");
    openTerminal();
  }, [openTerminal]);

  // Terminals are not drop targets (only directories are)
  const isDropTarget = false;

  return (
    <div className={tileFrame}>
      <div
        // Click handlers
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        // Drag source (can be dragged)
        draggable="true"
        onDragStart={(e) => dragHandlers.handleDragStart(e, terminal.id)}
        onDragEnd={dragHandlers.handleDragEnd}
        className={`${tileWrapper} ${containerClasses({
          selected: isSelected,
          drop: isDropTarget,
        })}`}
      >
        <img src={terminal.image} alt={terminal.label} className={imageSize} />
      </div>

      <h2 className={`${titleBase} ${labelClasses(isSelected)}`}>
        {terminal.label}
      </h2>
    </div>
  );
};
