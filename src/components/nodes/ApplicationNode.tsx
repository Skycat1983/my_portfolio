import { useCallback } from "react";
import { useNewStore } from "@/hooks/useStore";

import { useNodeEvents } from "./hooks/useNodeEvents";
import {
  getContainerClasses,
  getImageSize,
  getLabelClasses,
  getTileWrapper,
  getTitleBase,
} from "./node.styles";
import type { ApplicationEntry } from "@/components/nodes/nodeTypes";
import { getTitleFrame } from "./node.styles";
import type { WindowId } from "@/constants/applicationRegistry";
import {
  desktopRootId,
  dockRootId,
  mobileDockRootId,
  mobileRootId,
  systemRootId,
  type RootDirectoryId,
} from "@/constants/nodeHierarchy";
import theme from "@/styles/theme";

type Props = {
  node: ApplicationEntry;
  view: "icons" | "list" | "columns";
  windowId: WindowId | RootDirectoryId;
};

export const ApplicationNode = ({ node, view, windowId }: Props) => {
  const isFinder =
    windowId !== desktopRootId &&
    windowId !== dockRootId &&
    windowId !== mobileRootId &&
    windowId !== mobileDockRootId;
  const themeMode = useNewStore((s) => s.theme);
  const textColor = theme.colors[themeMode].text.primary;
  const textStyle = isFinder ? textColor : "white";
  console.log("debug_columns", node);
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  const openWindow = useNewStore((s) => s.openWindow);
  const findOneNode = useNewStore((s) => s.findOneNode);

  // ─────────── node-specific activation ───────────
  const handleActivate = useCallback(() => {
    // this is a necessary hack to open the finder window without the finder nodes itself behaving like a directory (drag and drop etc)
    if (node.applicationRegistryId === "finder") {
      const rootDirectoryNode = findOneNode((n) => n.id === systemRootId);
      if (rootDirectoryNode && rootDirectoryNode.type === "directory") {
        openWindow(rootDirectoryNode);
      }
      return;
    }
    openWindow(node);
  }, [node, openWindow, findOneNode]);

  // ─────────── shared node behavior ───────────
  const nodeBehavior = useNodeEvents({
    id: node.id,
    nodeType: node.label,
    enableLogging: true,
    onActivate: handleActivate,
    parentId: node.parentId,
  });

  const showLabel = isFinder || windowId === desktopRootId;
  // node.parentId !== "dock-root" && node.parentId !== "mobile-dock-root";
  const image =
    operatingSystem === "mac"
      ? node.image
      : node.alternativeImage
      ? node.alternativeImage
      : node.image;

  // ─────────── render ───────────
  return (
    <div
      // Click handlers
      onClick={nodeBehavior.handleClick}
      {...nodeBehavior.accessibilityProps}
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
