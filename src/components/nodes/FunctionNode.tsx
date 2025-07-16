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
import type { FunctionEntry } from "@/components/nodes/nodeTypes";
import { getNodeFunction } from "@/constants/functionNodeRegistry";
import type { WindowId } from "@/constants/applicationRegistry";
import {
  desktopRootId,
  dockRootId,
  mobileDockRootId,
  mobileRootId,
  type RootDirectoryId,
} from "@/constants/nodeHierarchy";
import theme from "@/styles/theme";

type Props = {
  node: FunctionEntry;
  view: "icons" | "list" | "columns";
  windowId: WindowId | RootDirectoryId;
};

export const FunctionNode = ({ node, view, windowId }: Props) => {
  const isFinder =
    windowId !== desktopRootId &&
    windowId !== dockRootId &&
    windowId !== mobileRootId &&
    windowId !== mobileDockRootId;
  const themeMode = useNewStore((s) => s.theme);
  const textColor = theme.colors[themeMode].text.primary;
  const textStyle = isFinder ? textColor : "white";
  const { functionKey } = node;
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  // ─────────── node-specific store actions ───────────

  const nodeFunction = getNodeFunction(functionKey);

  // ─────────── node-specific activation ───────────
  const handleActivate = useCallback(() => {
    // if (windowAlreadyOpen) {
    //   focusWindow(windowAlreadyOpen.windowId);
    //   return;
    // }
    nodeFunction();
  }, [nodeFunction]);

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
      className={getTitleFrame(view, nodeBehavior.isSelected)}
    >
      <div
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
          style={{
            color: textStyle,
          }}
        >
          {node.label}
        </h2>
      )}
    </div>
  );
};
