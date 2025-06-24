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
import {
  BIN_EMPTY,
  BIN_FULL,
  FOLDER_MAC,
  FOLDER_WIN,
} from "../../constants/images";

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
  const openWindow = useNewStore((s) => s.openWindow);
  const updateWindowById = useNewStore((s) => s.updateWindowById);
  // const incrementWindowHistoryIndex = useNewStore(
  //   (s) => s.incrementWindowHistoryIndex
  // );

  const window = useNewStore((s) => s.getWindowById(parentWindowId));

  // ─────────── node-specific activation ───────────
  const handleActivate = useCallback(() => {
    console.log(
      "Directory activate: context:",
      layout,
      "parentWindowId:",
      parentWindowId,
      "directory:",
      nodeEntry.id
    );

    // Context-aware navigation logic
    if (layout === "desktop" || !parentWindowId) {
      // Desktop context or no parent window - always open new window
      console.log(
        "DirectoryNode: opening new window for directory",
        nodeEntry.id
      );
      openWindow(nodeEntry, nodeEntry.id);
    } else {
      // Window context - navigate within existing window by updating nodeId
      console.log(
        "DirectoryNode: navigating within window",
        parentWindowId,
        "to directory",
        nodeEntry.id
      );
      // incrementWindowHistoryIndex(parentWindowId);
      const newHistoryIndex = (window?.currentHistoryIndex ?? 0) + 1;
      const success = updateWindowById(parentWindowId, {
        nodeId: nodeEntry.id,
        title: nodeEntry.label,
        itemHistory: [...(window?.itemHistory || []), nodeEntry.id],
        currentHistoryIndex: newHistoryIndex,
        // currentItem: directory.id,
      });
      if (!success) {
        console.warn(
          "DirectoryNode: failed to update window, falling back to opening new window"
        );
        openWindow(nodeEntry, nodeEntry.id);
      }
    }
  }, [layout, parentWindowId, openWindow, updateWindowById, window, nodeEntry]);

  // ─────────── shared node behavior ───────────
  console.log("DIR_NODE_02: calling useNodeEvents", {
    nodeId: nodeEntry.id,
    nodeType: "directory",
  });

  const nodeBehavior = useNodeEvents({
    id: nodeEntry.id,
    nodeType: "directory",
    enableLogging: true,
    onActivate: handleActivate,
  });

  console.log("DIR_NODE_03: received nodeBehavior from useNodeEvents", {
    nodeId: nodeEntry.id,
    isSelected: nodeBehavior.isSelected,
    isDropTarget: nodeBehavior.isDropTarget,
    canBeDropTarget: nodeBehavior.canBeDropTarget,
    hasDragSourceHandlers:
      Object.keys(nodeBehavior.dragSourceHandlers).length > 0,
    hasDropTargetHandlers:
      Object.keys(nodeBehavior.dropTargetHandlers).length > 0,
  });

  // ─────────── image resolution logic ───────────
  console.log("directory", nodeEntry);

  let folderImage = operatingSystem === "mac" ? FOLDER_MAC : FOLDER_WIN;

  if (nodeEntry.id === "trash") {
    folderImage = BIN_EMPTY;

    if (nodeEntry.children.length > 0) {
      folderImage = BIN_FULL;
    }
  }

  console.log("DIR_NODE_04: about to render with drag handlers", {
    nodeId: nodeEntry.id,
    isSelected: nodeBehavior.isSelected,
    isDropTarget: nodeBehavior.isDropTarget,
    containerClasses: containerClasses({
      selected: nodeBehavior.isSelected,
      drop: nodeBehavior.isDropTarget,
    }),
  });

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
        className={`${tileWrapper} ${containerClasses({
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
