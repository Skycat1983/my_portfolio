import { useCallback } from "react";
import { useNewStore } from "../../hooks/useStore";
import { useNodeEvents } from "./hooks/useNodeEvents";
import type { DocumentEntry } from "../../types/nodeTypes";
import {
  containerClasses,
  imageSize,
  labelClasses,
  tileFrame,
  tileWrapper,
  titleBase,
} from "./node.styles";

type Props = { document: DocumentEntry };

export const DocumentNode = ({ document }: Props) => {
  console.log("DocumentNode");
  // ─────────── node-specific store actions ───────────
  const openWindow = useNewStore((s) => s.openWindow);
  const focusWindow = useNewStore((s) => s.focusWindow);
  const getWindowByNodeId = useNewStore((s) => s.getWindowByNodeId);

  // ─────────── node-specific activation ───────────
  const handleActivate = useCallback(() => {
    const documentWindowAlreadyOpen = getWindowByNodeId(document.id);

    if (documentWindowAlreadyOpen) {
      focusWindow(documentWindowAlreadyOpen.windowId);
      return;
    }

    openWindow(document, document.label);
  }, [document, getWindowByNodeId, focusWindow, openWindow]);

  // ─────────── shared node behavior ───────────
  const nodeBehavior = useNodeEvents({
    id: document.id,
    nodeType: "document",
    enableLogging: true,
    onActivate: handleActivate,
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
        // Drop target (empty for non-directories)
        {...nodeBehavior.dropTargetHandlers}
        className={`${tileWrapper} ${containerClasses({
          selected: nodeBehavior.isSelected,
          drop: nodeBehavior.isDropTarget,
        })}`}
      >
        <img src={document.image} alt={document.label} className={imageSize} />
      </div>
      <h2 className={`${titleBase} ${labelClasses(nodeBehavior.isSelected)}`}>
        {document.label}
      </h2>
    </div>
  );
};
