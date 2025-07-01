import { useCallback } from "react";
import { useNewStore } from "../../hooks/useStore";

import { useNodeEvents } from "./hooks/useNodeEvents";
import type { AppEntry } from "../../types/nodeTypes";
import {
  containerClasses,
  imageSize,
  labelClasses,
  tileFrame,
  tileWrapper,
} from "./node.styles";
import { titleBase } from "./node.styles";

type Props = { app: AppEntry };

export const AppNode = ({ app }: Props) => {
  const { id, componentKey } = app;
  console.log("APP_NODE_01: app", id, componentKey);
  // ─────────── node-specific store actions ───────────
  // const openTerminal = useNewStore((s) => s.openTerminal);
  const openWindowWithComponentKey = useNewStore(
    (s) => s.openWindowWithComponentKey
  );
  const getWindowByNodeId = useNewStore((s) => s.getWindowByNodeId);
  const focusWindow = useNewStore((s) => s.focusWindow);

  // ─────────── node-specific activation ───────────
  const handleActivate = useCallback(() => {
    const windowAlreadyOpen = getWindowByNodeId(id);

    if (windowAlreadyOpen) {
      focusWindow(windowAlreadyOpen.windowId);
      return;
    }
    openWindowWithComponentKey(app, id, componentKey);
  }, [
    id,
    app,
    getWindowByNodeId,
    openWindowWithComponentKey,
    focusWindow,
    componentKey,
  ]);

  // ─────────── shared node behavior ───────────
  const nodeBehavior = useNodeEvents({
    id: app.id,
    nodeType: app.label,
    enableLogging: true,
    onActivate: handleActivate,
    parentId: app.parentId,
  });

  const showLabel = app.parentId !== "dock-root";

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
        className={`${tileWrapper()} ${containerClasses({
          selected: nodeBehavior.isSelected,
          drop: nodeBehavior.isDropTarget,
        })}`}
      >
        <img src={app.image} alt={app.label} className={imageSize} />
      </div>

      {showLabel && (
        <h2 className={`${titleBase} ${labelClasses(nodeBehavior.isSelected)}`}>
          {app.label}
        </h2>
      )}
    </div>
  );
};
