import { useCallback } from "react";
import { useNewStore } from "@/hooks/useStore";
import {
  desktopRootId,
  dockRootId,
  EGG_BROKEN,
  mobileDockRootId,
  mobileRootId,
} from "@/constants/nodeHierarchy";
import { useNodeEvents } from "./hooks/useNodeEvents";
import type { EasterEggEntry } from "@/components/nodes/nodeTypes";
import {
  getTitleFrame,
  getImageSize,
  getTileWrapper,
  getContainerClasses,
  getLabelClasses,
  getTitleBase,
} from "./node.styles";
import type { WindowId } from "@/constants/applicationRegistry";
import type { RootDirectoryId } from "@/constants/nodeHierarchy";
import theme from "@/styles/theme";

type Props = {
  egg: EasterEggEntry;
  view: "icons" | "list" | "columns";
  windowId: WindowId | RootDirectoryId;
};

export const EasterEggNode = ({ egg, view, windowId }: Props) => {
  const isFinder =
    windowId !== desktopRootId &&
    windowId !== dockRootId &&
    windowId !== mobileRootId &&
    windowId !== mobileDockRootId;
  const themeMode = useNewStore((s) => s.theme);
  const textColor = theme.colors[themeMode].text.primary;
  const textStyle = isFinder ? textColor : "white";
  // ─────────── node-specific store actions ───────────
  const updateNodeByID = useNewStore((s) => s.updateNodeByID);
  const selectOneNode = useNewStore((s) => s.selectOneNode);

  // ─────────── node-specific activation ───────────
  const handleBreakEgg = useCallback(() => {
    const newDateModified = new Date().toISOString();
    updateNodeByID(egg.id, {
      isBroken: true,
      image: EGG_BROKEN,
      alternativeImage: EGG_BROKEN,
      dateModified: newDateModified,
    });
  }, [egg.id, updateNodeByID]);

  // ─────────── shared node behavior ───────────
  const nodeBehavior = useNodeEvents({
    id: egg.id,
    nodeType: "easter-egg",
    enableLogging: true,
    onActivate: handleBreakEgg,
  });

  // ─────────── special click behavior (swap images) ───────────
  const handleSpecialClick = useCallback(() => {
    const newDateModified = new Date().toISOString();
    nodeBehavior.log("special-click");
    // First select the node (shared behavior)
    selectOneNode(egg.id);

    // Don't swap if broken
    if (egg.isBroken) return;

    // Then swap the images (special behavior)
    updateNodeByID(egg.id, {
      image: egg.alternativeImage || egg.image,
      alternativeImage: egg.image,
      dateModified: newDateModified,
    });
  }, [egg, updateNodeByID, nodeBehavior, selectOneNode]);

  // ─────────── render ───────────
  return (
    <div
      {...nodeBehavior.accessibilityProps}
      // Click handlers - using special click for single-click
      onClick={handleSpecialClick}
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
        <img src={egg.image} alt={egg.label} className={getImageSize(view)} />
      </div>

      <h2
        className={`${getTitleBase(view)} ${getLabelClasses(
          view,
          nodeBehavior.isSelected
        )}`}
        style={{
          color: textStyle,
        }}
      >
        {egg.label}
      </h2>
    </div>
  );
};
