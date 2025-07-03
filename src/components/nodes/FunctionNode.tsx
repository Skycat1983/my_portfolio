import { useCallback } from "react";
import { useNewStore } from "@/hooks/useStore";

import { useNodeEvents } from "./hooks/useNodeEvents";
import {
  containerClasses,
  imageSize,
  labelClasses,
  tileFrame,
  tileWrapper,
} from "./node.styles";
import { titleBase } from "./node.styles";
import type { FunctionEntry } from "@/types/nodeTypes";
import { getNodeFunction } from "@/components/window/WindowComponentRegistry";

type Props = { node: FunctionEntry };

export const FunctionNode = ({ node }: Props) => {
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
        <img src={image} alt={node.label} className={imageSize} />
      </div>

      {showLabel && (
        <h2 className={`${titleBase} ${labelClasses(nodeBehavior.isSelected)}`}>
          {node.label}
        </h2>
      )}
    </div>
  );
};
