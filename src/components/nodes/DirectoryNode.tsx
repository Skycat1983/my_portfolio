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
  directory: DirectoryEntry;
  layout?: LayoutType;
  parentWindowId?: string;
};

export const DirectoryNode = ({
  directory,
  layout = "window",
  parentWindowId,
}: Props) => {
  // ─────────── node-specific store actions ───────────
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  const openOrFocusWindow = useNewStore((s) => s.openOrFocusWindow);
  const updateWindowById = useNewStore((s) => s.updateWindowById);

  // ─────────── node-specific activation ───────────
  const handleActivate = useCallback(() => {
    console.log(
      "Directory activate: context:",
      layout,
      "parentWindowId:",
      parentWindowId,
      "directory:",
      directory.id
    );

    // Context-aware navigation logic
    if (layout === "desktop" || !parentWindowId) {
      // Desktop context or no parent window - always open new window
      console.log(
        "DirectoryNode: opening new window for directory",
        directory.id
      );
      openOrFocusWindow(directory.id);
    } else {
      // Window context - navigate within existing window by updating nodeId
      console.log(
        "DirectoryNode: navigating within window",
        parentWindowId,
        "to directory",
        directory.id
      );
      const success = updateWindowById(parentWindowId, {
        nodeId: directory.id,
        title: directory.label,
      });
      if (!success) {
        console.warn(
          "DirectoryNode: failed to update window, falling back to opening new window"
        );
        openOrFocusWindow(directory.id);
      }
    }
  }, [
    directory.id,
    directory.label,
    layout,
    parentWindowId,
    openOrFocusWindow,
    updateWindowById,
  ]);

  // ─────────── shared node behavior ───────────
  const nodeBehavior = useNodeEvents({
    id: directory.id,
    nodeType: "directory",
    enableLogging: true,
    onActivate: handleActivate,
  });

  // ─────────── image resolution logic ───────────
  console.log("directory", directory);

  let folderImage = operatingSystem === "mac" ? FOLDER_MAC : FOLDER_WIN;

  if (directory.id === "trash") {
    folderImage = BIN_EMPTY;

    if (directory.children.length > 0) {
      folderImage = BIN_FULL;
    }
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
        className={`${tileWrapper} ${containerClasses({
          selected: nodeBehavior.isSelected,
          drop: nodeBehavior.isDropTarget,
        })}`}
      >
        <img src={folderImage} alt={directory.label} className={imageSize} />
      </div>
      <h2 className={`${titleBase} ${labelClasses(nodeBehavior.isSelected)}`}>
        {directory.label}
      </h2>
    </div>
  );
};
