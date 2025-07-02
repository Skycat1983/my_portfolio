import { useCallback } from "react";
import { useNewStore } from "../../hooks/useStore";
import { useNodeEvents } from "./hooks/useNodeEvents";
import type { DirectoryEntry } from "../../types/nodeTypes";
import {
  containerClasses,
  imageSize,
  labelClasses,
  tileWrapper,
  titleBase,
  tileFrame,
} from "./node.styles";
import { BIN_EMPTY, BIN_FULL, FINDER } from "../../constants/images";

type LayoutType = "desktop" | "window";

type Props = {
  nodeEntry: DirectoryEntry;
  layout?: LayoutType;
  parentWindowId: string;
};

export const DirectoryNode = ({
  nodeEntry,
  layout = "window",
  parentWindowId,
}: Props) => {
  console.log("DIR_NODE_01: DirectoryNode rendering", {
    nodeId: nodeEntry.id,
    layout,
    parentWindowId,
    nodeLabel: nodeEntry.label,
  });

  // ─────────── node-specific store actions ───────────
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  const openWindowWithComponentKey = useNewStore(
    (s) => s.openWindowWithComponentKey
  );
  const focusWindow = useNewStore((s) => s.focusWindow);
  const updateWindowById = useNewStore((s) => s.updateWindowById);
  const getWindowByNodeId = useNewStore((s) => s.getWindowByNodeId);
  const window = useNewStore((s) => s.getWindowById(parentWindowId));

  // ─────────── node-specific activation ───────────
  const handleActivate = useCallback(() => {
    const windowAlreadyOpen = getWindowByNodeId(nodeEntry.id);

    if (windowAlreadyOpen) {
      focusWindow(windowAlreadyOpen.windowId);
      return;
    }

    // Context-aware navigation logic
    if (layout === "desktop" || !parentWindowId) {
      openWindowWithComponentKey(
        nodeEntry,
        nodeEntry.id,
        nodeEntry.componentKey
      );
    } else {
      const newHistoryIndex = (window?.currentHistoryIndex ?? 0) + 1;
      const success = updateWindowById(parentWindowId, {
        nodeId: nodeEntry.id,
        title: nodeEntry.label,
        itemHistory: [...(window?.itemHistory || []), nodeEntry.id],
        currentHistoryIndex: newHistoryIndex,
      });
      if (!success) {
        openWindowWithComponentKey(
          nodeEntry,
          nodeEntry.id,
          nodeEntry.componentKey
        );
      }
    }
  }, [
    getWindowByNodeId,
    layout,
    parentWindowId,
    openWindowWithComponentKey,
    focusWindow,
    updateWindowById,
    window,
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
