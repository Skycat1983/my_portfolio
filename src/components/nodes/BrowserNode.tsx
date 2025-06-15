import { useCallback } from "react";
import { useNewStore } from "../../hooks/useStore";
import { useNodeBehavior } from "../../hooks/useNodeEvents";
import type { BrowserEntry } from "../../types/nodeTypes";
import {
  containerClasses,
  imageSize,
  labelClasses,
  tileWrapper,
  titleBase,
  tileFrame,
} from "./node.styles";
import { EDGE, SAFARI } from "../../constants/images";

type Props = { browser: BrowserEntry };

export const BrowserNode = ({ browser }: Props) => {
  // ─────────── node-specific store actions ───────────
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  const openBrowser = useNewStore((s) => s.openBrowser);

  // ─────────── node-specific activation ───────────
  const handleActivate = useCallback(() => {
    console.log("Browser activate: opening browser");
    openBrowser();
  }, [openBrowser]);

  // ─────────── shared node behavior ───────────
  const nodeBehavior = useNodeBehavior({
    id: browser.id,
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
        <img src={folderImage} alt={browser.label} className={imageSize} />
      </div>
      <h2 className={`${titleBase} ${labelClasses(nodeBehavior.isSelected)}`}>
        {browser.label}
      </h2>
    </div>
  );
};
