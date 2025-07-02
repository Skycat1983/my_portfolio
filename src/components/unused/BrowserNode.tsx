import { useCallback } from "react";
import { useNewStore } from "@/hooks/useStore";
import { useNodeEvents } from "../nodes/hooks/useNodeEvents";
import type { BrowserEntry } from "@/types/nodeTypes";
import {
  containerClasses,
  imageSize,
  labelClasses,
  tileWrapper,
  titleBase,
  tileFrame,
} from "../nodes/node.styles";
import { EDGE, SAFARI } from "@/constants/images";

type Props = { browserEntry: BrowserEntry };

export const BrowserNode = ({ browserEntry }: Props) => {
  console.log("BrowserNode");
  // ─────────── node-specific store actions ───────────
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  const openWindow = useNewStore((s) => s.openWindow);
  const focusWindow = useNewStore((s) => s.focusWindow);
  const getWindowByNodeId = useNewStore((s) => s.getWindowByNodeId);

  // ─────────── node-specific activation ───────────
  const handleActivate = useCallback(() => {
    const browserWindowAlreadyOpen = getWindowByNodeId(browserEntry.id);

    if (browserWindowAlreadyOpen) {
      focusWindow(browserWindowAlreadyOpen.windowId);
      return;
    }
    const startPageUrl = "";

    openWindow(browserEntry, startPageUrl);
  }, [browserEntry, getWindowByNodeId, focusWindow, openWindow]);

  // ─────────── shared node behavior ───────────
  const nodeBehavior = useNodeEvents({
    id: browserEntry.id,
    nodeType: "browser",
    enableLogging: true,
    onActivate: handleActivate,
  });

  // ─────────── image resolution logic ───────────
  const folderImage = operatingSystem === "mac" ? SAFARI : EDGE;

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
        // Drop target (empty for non-directories)
        {...nodeBehavior.dropTargetHandlers}
        className={`${tileWrapper} ${containerClasses({
          selected: nodeBehavior.isSelected,
          drop: nodeBehavior.isDropTarget,
        })}`}
      >
        <img src={folderImage} alt={browserEntry.label} className={imageSize} />
      </div>
      <h2 className={`${titleBase} ${labelClasses(nodeBehavior.isSelected)}`}>
        {browserEntry.label}
      </h2>
    </div>
  );
};
