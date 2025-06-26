import { useCallback } from "react";
import { useNewStore } from "../../hooks/useStore";

import { useNodeEvents } from "./hooks/useNodeEvents";
import type { GameEntry } from "../../types/nodeTypes";
import {
  containerClasses,
  imageSize,
  labelClasses,
  tileFrame,
  tileWrapper,
  titleBase,
} from "./node.styles";

type Props = { game: GameEntry };

export const GameNode = ({ game }: Props) => {
  // ─────────── node-specific store actions ───────────
  // const openTerminal = useNewStore((s) => s.openTerminal);
  const openWindow = useNewStore((s) => s.openWindow);

  // ─────────── node-specific activation ───────────
  const handleActivate = useCallback(() => {
    console.log("Terminal activate: opening terminal");
    // openTerminal();
    openWindow(game, game.id);
  }, [game, openWindow]);

  // ─────────── shared node behavior ───────────
  const nodeBehavior = useNodeEvents({
    id: game.id,
    nodeType: game.label,
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
        <img src={game.image} alt={game.label} className={imageSize} />
      </div>

      <h2 className={`${titleBase} ${labelClasses(nodeBehavior.isSelected)}`}>
        {game.label}
      </h2>
    </div>
  );
};
