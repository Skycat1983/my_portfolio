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
  const openWindowWithDocumentConfig = useNewStore(
    (s) => s.openWindowWithDocumentConfig
  );
  const focusWindow = useNewStore((s) => s.focusWindow);
  const getWindowByNodeId = useNewStore((s) => s.getWindowByNodeId);
  const getDocumentConfig = useNewStore((s) => s.getDocumentConfig);

  // ─────────── node-specific activation ───────────
  const handleActivate = useCallback(() => {
    const documentWindowAlreadyOpen = getWindowByNodeId(document.id);

    if (documentWindowAlreadyOpen) {
      focusWindow(documentWindowAlreadyOpen.windowId);
      return;
    }

    // Check if document has saved configuration
    const documentConfig = document.documentConfigId
      ? getDocumentConfig(document.documentConfigId)
      : undefined;

    console.log(
      "DocumentNode: opening document",
      document.id,
      "with config:",
      documentConfig
    );

    // Open window with document configuration
    openWindowWithDocumentConfig(document, document.label, documentConfig);
  }, [
    document,
    getWindowByNodeId,
    focusWindow,
    openWindowWithDocumentConfig,
    getDocumentConfig,
  ]);

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
