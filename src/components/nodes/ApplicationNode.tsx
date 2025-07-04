import { useCallback } from "react";
import { useNewStore } from "@/hooks/useStore";

import { useNodeEvents } from "./hooks/useNodeEvents";
import {
  getContainerClasses,
  getImageSize,
  getLabelClasses,
  getTileWrapper,
} from "./node.styles";
import { titleBase } from "./node.styles";
import type { ApplicationEntry } from "@/types/nodeTypes";
import { getTitleFrame } from "./node.styles";

type Props = {
  node: ApplicationEntry;
  view: "icons" | "list" | "columns";
};

export const ApplicationNode = ({ node, view }: Props) => {
  const { id, componentKey } = node;
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  console.log("APP_NODE_01: app", id, componentKey, node);
  // ─────────── node-specific store actions ───────────
  // const openTerminal = useNewStore((s) => s.openTerminal);
  const openWindowWithComponentKey = useNewStore(
    (s) => s.openWindowWithComponentKey
  );
  const getWindowByApplicationId = useNewStore(
    (s) => s.getWindowByApplicationId
  );
  const focusWindow = useNewStore((s) => s.focusWindow);

  // ─────────── node-specific activation ───────────
  const handleActivate = useCallback(() => {
    console.log(
      "APP_NODE_03: handleActivate called for",
      node.id,
      "applicationId:",
      node.applicationId
    );

    // Use applicationId for focus logic to handle dock/desktop instances
    const windowAlreadyOpen = getWindowByApplicationId(node.applicationId);
    console.log("APP_NODE_02: windowAlreadyOpen", windowAlreadyOpen);
    console.log("APP_NODE_02: windowAlreadyOpen", node);

    if (windowAlreadyOpen) {
      console.log(
        "APP_NODE_04: focusing existing window",
        windowAlreadyOpen.windowId
      );
      focusWindow(windowAlreadyOpen.windowId);
      return;
    }

    console.log("APP_NODE_05: opening new window for", node.id);
    openWindowWithComponentKey(node, componentKey);
  }, [
    node,
    getWindowByApplicationId,
    openWindowWithComponentKey,
    focusWindow,
    componentKey,
  ]);

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
    <div onClick={nodeBehavior.handleClick} className={getTitleFrame(view)}>
      <div
        {...nodeBehavior.accessibilityProps}
        // Click handlers
        // onClick={nodeBehavior.handleClick}
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
          className={`${titleBase} ${getLabelClasses(
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
