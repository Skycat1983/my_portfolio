import { useCallback } from "react";
import { useNewStore } from "@/hooks/useStore";

import { useNodeEvents } from "./hooks/useNodeEvents";
import {
  getContainerClasses,
  getImageSize,
  getLabelClasses,
  getTileWrapper,
  getTitleFrame,
  getTitleBase,
} from "./node.styles";
import type { FunctionEntry } from "@/types/nodeTypes";
import { getNodeFunction } from "@/components/window/WindowComponentRegistry";

type Props = { node: FunctionEntry; view: "icons" | "list" | "columns" };

export const FunctionNode = ({ node, view }: Props) => {
  const { id, functionKey } = node;
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  // ─────────── node-specific store actions ───────────

  const getWindowByNodeId = useNewStore((s) => s.getWindowByNodeId);
  const focusWindow = useNewStore((s) => s.focusWindow);

  const nodeFunction = getNodeFunction(functionKey);

  // ─────────── node-specific activation ───────────
  const handleActivate = useCallback(() => {
    const windowAlreadyOpen = getWindowByNodeId(id);

    if (windowAlreadyOpen) {
      focusWindow(windowAlreadyOpen.windowId);
      return;
    }
    nodeFunction();
  }, [id, nodeFunction, getWindowByNodeId, focusWindow]);

  // ─────────── shared node behavior ───────────
  const nodeBehavior = useNodeEvents({
    id: node.id,
    nodeType: node.label,
    enableLogging: true,
    onActivate: handleActivate,
    parentId: node.parentId,
  });

  const showLabel = node.parentId !== "dock-root";
  const image =
    operatingSystem === "mac"
      ? node.image
      : node.alternativeImage
      ? node.alternativeImage
      : node.image;

  // ─────────── render ───────────
  return (
    <div className={getTitleFrame(view)}>
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
        className={`${getTileWrapper(view)} ${getContainerClasses({
          selected: nodeBehavior.isSelected,
          drop: nodeBehavior.isDropTarget,
          view,
        })}`}
      >
        <img src={image} alt={node.label} className={getImageSize(view)} />
      </div>

      {showLabel && (
        <h2
          className={`${getTitleBase(view)} ${getLabelClasses(
            view,
            nodeBehavior.isSelected
          )}`}
        >
          {node.label}
        </h2>
      )}
    </div>
  );
};
