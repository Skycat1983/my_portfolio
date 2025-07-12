import { useCallback } from "react";
import { useNewStore } from "@/hooks/useStore";
import { useNodeEvents } from "./hooks/useNodeEvents";
import type { DocumentEntry } from "@/components/nodes/nodeTypes";
import {
  getContainerClasses,
  getImageSize,
  getLabelClasses,
  getTileWrapper,
  getTitleBase,
  getTitleFrame,
} from "./node.styles";

type Props = { node: DocumentEntry; view: "icons" | "list" | "columns" };

export const DocumentNode = ({ node, view }: Props) => {
  const { id, applicationId, documentConfigId } = node;
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  console.log(
    "DOC_NODE_01: document",
    id,
    applicationId,
    documentConfigId,
    node
  );

  // ─────────── node-specific store actions ───────────
  const openWindow = useNewStore((s) => s.openWindow);
  // const openWindowWithDocumentConfig = useNewStore(
  //   (s) => s.openWindowWithDocumentConfig
  // );
  // const getWindowByApplicationId = useNewStore(
  //   (s) => s.getWindowByApplicationId
  // );
  // const focusWindow = useNewStore((s) => s.focusWindow);
  // const getDocumentConfig = useNewStore((s) => s.getDocumentConfig);

  // ─────────── node-specific activation ───────────
  const handleActivate = useCallback(() => {
    console.log("DOC_NODE_02: handleActivate called for document", node);
    openWindow(node);
  }, [openWindow, node]);

  // ─────────── shared node behavior ───────────
  const nodeBehavior = useNodeEvents({
    id: node.id,
    nodeType: node.label,
    enableLogging: true,
    onActivate: handleActivate,
    parentId: node.parentId,
  });

  const showLabel = node.parentId !== "dock-root";
  const image =
    operatingSystem === "mac"
      ? node.image
      : node.alternativeImage
      ? node.alternativeImage
      : node.image;

  // ─────────── render ───────────
  return (
    <div
      {...nodeBehavior.accessibilityProps}
      // Click handlers
      onDoubleClick={nodeBehavior.handleDoubleClick}
      onKeyDown={nodeBehavior.handleKeyDown}
      // Drag source
      {...nodeBehavior.dragSourceHandlers}
      // Drop target (empty for non-directories)
      {...nodeBehavior.dropTargetHandlers}
      onClick={nodeBehavior.handleClick}
      className={getTitleFrame(view, nodeBehavior.isSelected)}
    >
      <div
        className={`${getTileWrapper(view)} ${getContainerClasses({
          selected: nodeBehavior.isSelected,
          drop: nodeBehavior.isDropTarget,
          view,
        })}`}
      >
        <img src={image} alt={node.label} className={getImageSize(view)} />
      </div>

      {showLabel && (
        <h2
          className={`${getTitleBase(view)} ${getLabelClasses(
            view,
            nodeBehavior.isSelected
          )}`}
        >
          {node.label}
        </h2>
      )}
    </div>
  );
};

// Get the document configuration
// const documentConfig = getDocumentConfig(documentConfigId);
// // if (!documentConfig) {
// //   console.warn(
// //     "DOC_NODE_03: Document config not found for",
// //     documentConfigId
// //   );
// //   return;
// // }

// // Find the application node that handles this document type
// const applicationNode = Object.values(useNewStore.getState().nodeMap).find(
//   (node) =>
//     node.type === "application" &&
//     (node as import("@/components/nodes/nodeTypes").ApplicationEntry)
//       .applicationId === applicationId
// );

// if (!applicationNode) {
//   console.warn("DOC_NODE_04: Application not found for", applicationId);
//   return;
// }

// // Use applicationId for focus logic to handle dock/desktop instances
// const windowAlreadyOpen = getWindowByApplicationId(applicationId);

// if (windowAlreadyOpen) {
//   console.log(
//     "DOC_NODE_05: focusing existing window and switching document",
//     windowAlreadyOpen.windowId
//   );
//   // TODO: In the future, we could update the existing window to show this document
//   // For now, just focus the existing window
//   focusWindow(windowAlreadyOpen.windowId);
//   return;
// }

// console.log("DOC_NODE_06: opening new window for document", id);
// openWindowWithDocumentConfig(
//   node,
//   applicationNode as import("@/components/nodes/nodeTypes").ApplicationEntry,
//   documentConfig
// );
