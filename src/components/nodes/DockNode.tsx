import { useCallback } from "react";
import { useNewStore } from "@/hooks/useStore";
import { useNodeEvents } from "./hooks/useNodeEvents";
import type { NodeEntry } from "@/components/nodes/nodeTypes";
import {
  getTileWrapper,
  getContainerClasses,
  getTitleFrame,
  getImageSize,
  getLabelClasses,
  getTitleBase,
} from "./node.styles";
import { BIN_EMPTY, BIN_FULL, FINDER } from "@/constants/images";
import type { DockRootId } from "@/constants/nodeHierarchy";
import { getNodeFunction } from "../../constants/functionNodeRegistry";

type Props = {
  nodeEntry: NodeEntry;
  //   layout?: LayoutType;
  windowId: DockRootId;
  view: "icons" | "list" | "columns";
};

export const DockNode = ({
  nodeEntry,
  //   layout = "window",
  //   windowId,
  view,
}: Props) => {
  // ─────────── node-specific store actions ───────────
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  // const openWindowWithComponentKey = useNewStore(
  //   (s) => s.openWindowWithComponentKey
  // );
  const openWindow = useNewStore((s) => s.openWindow);
  // const focusWindow = useNewStore((s) => s.focusWindow);
  // const getWindowByNodeId = useNewStore((s) => s.getWindowByNodeId);

  // Always call the hook (React rules), but only use when in window context
  //   const finderHistory = useFinderHistory(windowId || "dummy");
  //   const isInPath = finderHistory.getColumnPath().includes(nodeEntry.id);

  // ─────────── node-specific activation ───────────
  const handleActivate = useCallback(() => {
    if (nodeEntry.type === "application" || nodeEntry.type === "directory") {
      openWindow(nodeEntry);
    }
    if (nodeEntry.type === "function") {
      const { functionKey } = nodeEntry;
      const nodeFunction = getNodeFunction(functionKey);
      nodeFunction();
    }
  }, [openWindow, nodeEntry]);

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

    if (nodeEntry?.type === "directory" && nodeEntry?.children.length > 0) {
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
        >
          {nodeEntry.label}
        </h2>
      )}
    </div>
  );
};
