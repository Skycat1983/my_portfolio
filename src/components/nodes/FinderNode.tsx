import { useCallback } from "react";
import { useNewStore } from "@/hooks/useStore";
import { useNodeEvents } from "./hooks/useNodeEvents";
import { useFinderHistory } from "@/components/finder/hooks/useFinderHistory";
import type { DirectoryEntry } from "@/types/nodeTypes";
import {
  containerClasses,
  imageSize,
  labelClasses,
  tileWrapper,
  titleBase,
  tileFrame,
} from "./node.styles";
import { BIN_EMPTY, BIN_FULL, FINDER } from "@/constants/images";

type LayoutType = "desktop" | "window" | "dock";

type Props = {
  nodeEntry: DirectoryEntry;
  layout?: LayoutType;
  windowId: string;
};

export const FinderNode = ({
  nodeEntry,
  layout = "window",
  windowId,
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
      openWindowWithComponentKey(
        nodeEntry,
        // nodeEntry.id,
        nodeEntry.componentKey
      );
    } else {
      // Window context: use finder history for navigation
      const success = finderHistory.navigateToNode(nodeEntry.id);
      if (!success) {
        openWindowWithComponentKey(nodeEntry, nodeEntry.componentKey);
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
  console.log("directory", nodeEntry);

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
        // Drop target (directories accept drops)
        {...nodeBehavior.dropTargetHandlers}
        className={`${tileWrapper()} ${containerClasses({
          selected: nodeBehavior.isSelected,
          drop: nodeBehavior.isDropTarget,
        })}`}
      >
        <img src={folderImage} alt={nodeEntry.label} className={imageSize} />
      </div>
      <h2 className={`${titleBase} ${labelClasses(nodeBehavior.isSelected)}`}>
        {nodeEntry.label}
      </h2>
    </div>
  );
};
