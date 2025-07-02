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
import type { ApplicationEntry } from "@/types/nodeTypes";

type Props = { application: ApplicationEntry };

export const ApplicationNode = ({ application }: Props) => {
  const { id, componentKey } = application;
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  console.log("APP_NODE_01: app", id, componentKey, application);
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
    openWindowWithComponentKey(application, id, componentKey);
  }, [
    id,
    application,
    getWindowByNodeId,
    openWindowWithComponentKey,
    focusWindow,
    componentKey,
  ]);

  // ─────────── shared node behavior ───────────
  const nodeBehavior = useNodeEvents({
    id: application.id,
    nodeType: application.label,
    enableLogging: true,
    onActivate: handleActivate,
    parentId: application.parentId,
  });

  const showLabel = application.parentId !== "dock-root";
  const image =
    operatingSystem === "mac"
      ? application.image
      : application.alternativeImage
      ? application.alternativeImage
      : application.image;

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
        <img src={image} alt={application.label} className={imageSize} />
      </div>

      {showLabel && (
        <h2 className={`${titleBase} ${labelClasses(nodeBehavior.isSelected)}`}>
          {application.label}
        </h2>
      )}
    </div>
  );
};
