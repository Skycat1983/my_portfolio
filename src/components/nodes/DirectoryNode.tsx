import { useCallback } from "react";
import { useNewStore } from "@/hooks/useStore";
import { useNodeEvents } from "./hooks/useNodeEvents";
// import { useFinderHistory } from "@/components/finder/hooks/useFinderHistory";
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
  nodeEntry: DirectoryEntry;
  windowId: WindowId | RootDirectoryId;
  view: "icons" | "list" | "columns";
};

export const DirectoryNode = ({ nodeEntry, windowId, view }: Props) => {
  const isFinder =
    windowId !== desktopRootId &&
    windowId !== dockRootId &&
    windowId !== mobileRootId &&
    windowId !== mobileDockRootId;
  const themeMode = useNewStore((s) => s.theme);
  const textColor = theme.colors[themeMode].text.primary;
  const textStyle = isFinder ? textColor : "white";

  // ─────────── node-specific store actions ───────────
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  const openWindow = useNewStore((s) => s.openWindow);
  const updateWindow = useNewStore((s) => s.updateWindow);
  // const history = useNewStore((s) => s.histories[windowId]);
  const addToHistory = useNewStore((s) => s.addToHistory);

  // ─────────── node-specific activation ───────────
  const handleActivate = useCallback(() => {
    const isRealWindow =
      windowId !== desktopRootId &&
      windowId !== dockRootId &&
      windowId !== mobileRootId &&
      windowId !== mobileDockRootId;
    if (isRealWindow) {
      addToHistory(windowId, nodeEntry.id);
      updateWindow((w) => w.windowId === windowId, { nodeId: nodeEntry.id });
    } else {
      // Open new window (desktop/dock context)
      openWindow(nodeEntry);
    }
  }, [nodeEntry, openWindow, updateWindow, windowId, addToHistory]);

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
      className={getTitleFrame(view, nodeBehavior.isSelected, true)}
    >
      <div
        className={`${getTileWrapper(view)} ${getContainerClasses({
          selected: nodeBehavior.isSelected,
          drop: nodeBehavior.isDropTarget,
          view,
          //   isInPath,
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
            nodeBehavior.isSelected
            // isInPath
          )}`}
          style={{
            color: textStyle,
          }}
        >
          {nodeEntry.label}
        </h2>
      )}
    </div>
  );
};

// const openWindowWithComponentKey = useNewStore(
//   (s) => s.openWindowWithComponentKey
// );
// const windows = useNewStore((s) => s.windows);
// const windowExists = useNewStore((s) => s.windowExists);
// const focusWindow = useNewStore((s) => s.focusWindow);
// const getWindowByNodeId = useNewStore((s) => s.getWindowByNodeId);

// Always call the hook (React rules), but only use when in window context
//   const finderHistory = useFinderHistory(windowId || "dummy");
//   const isInPath = finderHistory.getColumnPath().includes(nodeEntry.id);
