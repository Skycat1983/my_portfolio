import { useCallback } from "react";
import { useNewStore } from "@/hooks/useStore";
import { useNodeEvents } from "./hooks/useNodeEvents";
import { useFinderHistory } from "@/components/finder/hooks/useFinderHistory";
import type { DirectoryEntry } from "@/components/nodes/nodeTypes";
import {
  getTileWrapper,
  getContainerClasses,
  getTitleFrame,
  getImageSize,
  getLabelClasses,
  getTitleBase,
} from "./node.styles";
import { BIN_EMPTY, BIN_FULL, FINDER } from "@/constants/images";

type LayoutType = "desktop" | "window" | "dock";

type Props = {
  nodeEntry: DirectoryEntry;
  layout?: LayoutType;
  windowId: string;
  view: "icons" | "list" | "columns";
};

export const FinderNode = ({
  nodeEntry,
  layout = "window",
  windowId,
  view,
}: Props) => {
  console.log("DIR_NODE_01: DirectoryNode rendering", {
    nodeId: nodeEntry.id,
    layout,
    windowId,
    nodeLabel: nodeEntry.label,
  });

  // ─────────── node-specific store actions ───────────
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  const openWindowWithComponentKey = useNewStore(
    (s) => s.openWindowWithComponentKey
  );
  const focusWindow = useNewStore((s) => s.focusWindow);
  const getWindowByNodeId = useNewStore((s) => s.getWindowByNodeId);

  // Always call the hook (React rules), but only use when in window context
  const finderHistory = useFinderHistory(windowId || "dummy");
  const isInPath = finderHistory.getColumnPath().includes(nodeEntry.id);

  // ─────────── node-specific activation ───────────
  const handleActivate = useCallback(() => {
    const windowAlreadyOpen = getWindowByNodeId(nodeEntry.id);

    if (windowAlreadyOpen) {
      focusWindow(windowAlreadyOpen.windowId);
      return;
    }

    // Context-aware navigation logic
    if (layout === "desktop" || !windowId) {
      // Desktop context: open new window
      openWindowWithComponentKey(nodeEntry, nodeEntry.componentKey, "finder");
    } else {
      // Window context: use finder history for navigation
      const success = finderHistory.navigateToNode(nodeEntry.id);
      if (!success) {
        openWindowWithComponentKey(nodeEntry, nodeEntry.componentKey, "finder");
      }
    }
  }, [
    getWindowByNodeId,
    layout,
    windowId,
    openWindowWithComponentKey,
    focusWindow,
    finderHistory,
    nodeEntry,
  ]);

  // ─────────── shared node behavior ───────────
  const nodeBehavior = useNodeEvents({
    id: nodeEntry.id,
    nodeType: "directory",
    enableLogging: true,
    onActivate: handleActivate,
  });

  // ─────────── image resolution logic ───────────
  let folderImage =
    operatingSystem === "mac"
      ? nodeEntry.image
      : nodeEntry.alternativeImage ?? nodeEntry.image;

  if (nodeEntry.id === "trash") {
    folderImage = BIN_EMPTY;

    if (nodeEntry.children.length > 0) {
      folderImage = BIN_FULL;
    }
  }
  if (nodeEntry.id === "finder") {
    folderImage = FINDER;
  }
  const showLabel = nodeEntry.parentId !== "dock-root";

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
      // Drop target (directories accept drops)
      {...nodeBehavior.dropTargetHandlers}
      className={getTitleFrame(view, nodeBehavior.isSelected, isInPath, true)}
    >
      <div
        className={`${getTileWrapper(view)} ${getContainerClasses({
          selected: nodeBehavior.isSelected,
          drop: nodeBehavior.isDropTarget,
          view,
          isInPath,
        })}`}
      >
        <img
          src={folderImage}
          alt={nodeEntry.label}
          className={getImageSize(view)}
        />
      </div>
      {showLabel && (
        <h2
          className={`${getTitleBase(view)} ${getLabelClasses(
            view,
            nodeBehavior.isSelected,
            isInPath
          )}`}
        >
          {nodeEntry.label}
        </h2>
      )}
    </div>
  );
};
