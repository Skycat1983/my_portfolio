import { useCallback } from "react";
import { useNewStore } from "@/hooks/useStore";
import { useNodeEvents } from "./hooks/useNodeEvents";
import type { DocumentEntry } from "@/types/nodeTypes";
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
  const { id, applicationId, documentConfigId } = document;
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  console.log(
    "DOC_NODE_01: document",
    id,
    applicationId,
    documentConfigId,
    document
  );

  // ─────────── node-specific store actions ───────────
  const openWindowWithDocumentConfig = useNewStore(
    (s) => s.openWindowWithDocumentConfig
  );
  const getWindowByApplicationId = useNewStore(
    (s) => s.getWindowByApplicationId
  );
  const focusWindow = useNewStore((s) => s.focusWindow);
  const getDocumentConfig = useNewStore((s) => s.getDocumentConfig);

  // ─────────── node-specific activation ───────────
  const handleActivate = useCallback(() => {
    console.log(
      "DOC_NODE_02: handleActivate called for document",
      id,
      "documentConfigId:",
      documentConfigId
    );

    // Get the document configuration
    const documentConfig = getDocumentConfig(documentConfigId);
    if (!documentConfig) {
      console.warn(
        "DOC_NODE_03: Document config not found for",
        documentConfigId
      );
      return;
    }

    // Find the application node that handles this document type
    const applicationNode = Object.values(useNewStore.getState().nodeMap).find(
      (node) =>
        node.type === "application" &&
        (node as import("@/types/nodeTypes").ApplicationEntry).applicationId ===
          applicationId
    );

    if (!applicationNode) {
      console.warn("DOC_NODE_04: Application not found for", applicationId);
      return;
    }

    // Use applicationId for focus logic to handle dock/desktop instances
    const windowAlreadyOpen = getWindowByApplicationId(applicationId);

    if (windowAlreadyOpen) {
      console.log(
        "DOC_NODE_05: focusing existing window and switching document",
        windowAlreadyOpen.windowId
      );
      // TODO: In the future, we could update the existing window to show this document
      // For now, just focus the existing window
      focusWindow(windowAlreadyOpen.windowId);
      return;
    }

    console.log("DOC_NODE_06: opening new window for document", id);
    openWindowWithDocumentConfig(
      document,
      applicationNode as import("@/types/nodeTypes").ApplicationEntry,
      documentConfig
    );
  }, [
    id,
    applicationId,
    documentConfigId,
    getDocumentConfig,
    getWindowByApplicationId,
    openWindowWithDocumentConfig,
    focusWindow,
    document,
  ]);

  // ─────────── shared node behavior ───────────
  const nodeBehavior = useNodeEvents({
    id: document.id,
    nodeType: document.label,
    enableLogging: true,
    onActivate: handleActivate,
    parentId: document.parentId,
  });

  const showLabel = document.parentId !== "dock-root";
  const image =
    operatingSystem === "mac"
      ? document.image
      : document.alternativeImage
      ? document.alternativeImage
      : document.image;

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
        className={`${tileWrapper()} ${containerClasses({
          selected: nodeBehavior.isSelected,
          drop: nodeBehavior.isDropTarget,
        })}`}
      >
        <img src={image} alt={document.label} className={imageSize} />
      </div>

      {showLabel && (
        <h2 className={`${titleBase} ${labelClasses(nodeBehavior.isSelected)}`}>
          {document.label}
        </h2>
      )}
    </div>
  );
};
