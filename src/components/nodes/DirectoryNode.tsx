import { useCallback } from "react";
import { useNewStore } from "../../hooks/useStore";
import { useNodeEvents } from "../../hooks/useNodeEvents";
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

type Props = { directory: DirectoryEntry };

export const DirectoryNode = ({ directory }: Props) => {
  // ─────────── node-specific store actions ───────────
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  // const openDirectory = useNewStore((s) => s.openDirectory);
  const openOrFocusWindow = useNewStore((s) => s.openOrFocusWindow);

  // ─────────── node-specific activation ───────────
  const handleActivate = useCallback(() => {
    console.log("Directory activate: opening directory", directory.id);
    openOrFocusWindow(directory.id);
  }, [directory.id, openOrFocusWindow]);

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
