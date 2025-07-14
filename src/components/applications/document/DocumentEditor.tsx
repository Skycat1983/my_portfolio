import React, { useState, useEffect } from "react";
import { useNewStore } from "@/hooks/useStore";
import { PAGES, WORD } from "@/constants/images";

// Import the new components
import { DocumentHeader } from "./DocumentHeader";
import { DocumentContent } from "./DocumentContent";
import { DocumentFooter } from "./DocumentFooter";
import type { DocumentEntry, NodeId } from "@/components/nodes/nodeTypes";
import type { WindowId } from "@/constants/applicationRegistry";
import { type DocumentConfig } from "@/constants/documentRegistry";
import { desktopRootId } from "@/constants/nodeHierarchy";

type TextAlignment = "left" | "center" | "right";

interface TextStyle {
  fontFamily: string;
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
  isUnderlined: boolean;
  color: string;
  textAlign: TextAlignment;
}

const DEFAULT_TEXT_STYLE: TextStyle = {
  fontFamily: "Times New Roman",
  fontSize: 14,
  isBold: false,
  isItalic: false,
  isUnderlined: false,
  color: "#000000",
  textAlign: "left",
};
interface DocumentEditorProps {
  windowId: WindowId;
  nodeId: NodeId;
}

export const DocumentEditor = ({ windowId, nodeId }: DocumentEditorProps) => {
  // ═══════════════════════════════════════════════════════════════════════════════
  // CONTENT STATE
  // ═══════════════════════════════════════════════════════════════════════════════
  const [content, setContent] = useState("");
  const [isModified, setIsModified] = useState(false);
  const [pageBackgroundColor, setPageBackgroundColor] = useState("#FFFFFF");
  const [textStyle, setTextStyle] = useState<TextStyle>(DEFAULT_TEXT_STYLE);
  const [zoom, setZoom] = useState(1.0); // 100% zoom by default
  const [documentLabel, setDocumentLabel] = useState("Untitled");

  // ═══════════════════════════════════════════════════════════════════════════════
  // WINDOW STORE
  // ═══════════════════════════════════════════════════════════════════════════════
  const window = useNewStore((s) =>
    s.findWindow((w) => w.windowId === windowId)
  );
  const updateWindowById = useNewStore((s) => s.updateWindowById);

  // ═══════════════════════════════════════════════════════════════════════════════
  // NODE STORE
  // ═══════════════════════════════════════════════════════════════════════════════
  const generateUniqueNodePropertyValue = useNewStore(
    (s) => s.generateUniqueNodePropertyValue
  );
  const createOneNode = useNewStore((s) => s.createOneNode);
  const getNodeByID = useNewStore((s) => s.getNodeByID);
  const updateNodeByID = useNewStore((s) => s.updateNodeByID);
  const isUniqueNodePropertyValue = useNewStore(
    (s) => s.isUniqueNodePropertyValue
  );

  // ═══════════════════════════════════════════════════════════════════════════════
  // DOCUMENT STORE
  // ═══════════════════════════════════════════════════════════════════════════════
  const generateConfigId = useNewStore((s) => s.generateConfigId);
  const getDocumentConfig = useNewStore((s) => s.getDocumentConfig);
  const setDocumentConfig = useNewStore((s) => s.setDocumentConfig);
  const configs = useNewStore((s) => s.configs);

  // Initialize document state from window configuration if available
  useEffect(() => {
    const node = getNodeByID(nodeId);
    if (node && node.type === "document") {
      const documentConfig = getDocumentConfig(node.documentConfigId);
      if (!documentConfig) {
        console.log("DocumentEditorDebug: document config not found");
        return;
      }
      console.log(
        "DocumentEditorDebug:  useEffect: documentConfig",
        documentConfig
      );
      const isWritable = documentConfig?.mutable;

      const docLabel = isWritable ? node.label : documentConfig.metadata.title;
      setContent(documentConfig.content);
      setTextStyle(documentConfig.textStyle);
      setPageBackgroundColor(documentConfig.pageSettings.backgroundColor);
      setDocumentLabel(docLabel);
      setIsModified(false); // Document is saved, so not modified initially
    }
  }, [nodeId, getNodeByID, getDocumentConfig]);

  if (!window) {
    return null;
  }

  // Responsive logic based on window width
  const windowWidth = window.width;
  const nextZIndex = window.zIndex + 1;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsModified(true);
  };

  const updateTextStyle = (updates: Partial<TextStyle>) => {
    setTextStyle((prev) => ({ ...prev, ...updates }));
    setIsModified(true);
  };

  const handlePageColorChange = (color: string) => {
    setPageBackgroundColor(color);
    setIsModified(true);
  };

  const handleModified = () => {
    setIsModified(true);
  };

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  const handleZoomReset = () => {
    setZoom(1.0);
  };

  const handleLabelChange = (newLabel: string) => {
    setDocumentLabel(newLabel);
  };

  // Calculate effective font size with zoom
  const effectiveFontSize = textStyle.fontSize * zoom;

  const handleSave = () => {
    console.log("DocumentEditorDebug: handleSave");
    const now = new Date();
    const wordCount = content
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const charCount = content.length;

    // get the node
    const node = getNodeByID(nodeId);
    console.log("DocumentEditorDebug: node", node);

    // type check the node
    if (node && node.type === "document") {
      // get the document config
      const documentConfig = getDocumentConfig(node.documentConfigId);
      console.log("DocumentEditorDebug: documentConfig", documentConfig);

      // check if the document config is mutable
      const isWritable = documentConfig?.mutable;

      // Check if we can overwrite the document config
      if (!isWritable) {
        // ! creating a new node + document config

        const newDocumentConfigId = generateConfigId();
        const newDocumentConfig: DocumentConfig = {
          id: newDocumentConfigId,
          mutable: true,
          content,
          textStyle,
          pageSettings: {
            backgroundColor: pageBackgroundColor,
          },
          metadata: {
            title: documentLabel,
            createdAt: now,
            modifiedAt: now,
            wordCount,
            charCount,
          },
        };
        const newConfig = setDocumentConfig(
          newDocumentConfigId,
          newDocumentConfig
        );
        console.log("DocumentEditorDebug: newConfig", newConfig);
        const baseNodeId = node.id;
        const uniqueNodeId = generateUniqueNodePropertyValue(baseNodeId, "id", {
          separator: "parentheses",
        });
        console.log("DocumentEditorDebug: document config is not writable");
        const isUniqueLabel = isUniqueNodePropertyValue(documentLabel, "label");
        const uniqueNodeLabel = isUniqueLabel
          ? documentLabel
          : generateUniqueNodePropertyValue(documentLabel, "label", {
              separator: "parentheses",
            });

        const newNode: DocumentEntry = {
          id: uniqueNodeId,
          parentId: desktopRootId,
          type: "document",
          label: uniqueNodeLabel,
          image: PAGES,
          alternativeImage: WORD,
          applicationId: "documentEditor",
          documentConfigId: newConfig.id,
          applicationRegistryId: "documentEditor",
          macExtension: ".txt",
          windowsExtension: ".txt",
          dateModified: now.toISOString(),
          size: charCount,
        };
        createOneNode(newNode);
        updateWindowById(window.windowId, {
          nodeId: newNode.id,
          title: newNode.label,
          documentConfig: newConfig,
        });
      } else {
        // Create new document configuration for first-time save
        const config = getDocumentConfig(node.documentConfigId);
        if (!config) {
          console.log("DocumentEditorDebug: config not found");
          return;
        }
        console.log("DocumentEditorDebug: config is writable", config);
        const newConfig = {
          id: config.id,
          mutable: true,
          content,
          textStyle,
          pageSettings: {
            backgroundColor: pageBackgroundColor,
          },
          metadata: {
            title: documentLabel,
            createdAt: now,
            modifiedAt: now,
            wordCount,
            charCount,
          },
        };

        console.log(
          "DocumentEditorDebug: creating new document config",
          config.id
        );
        const updatedConfig = setDocumentConfig(config.id, newConfig);
        console.log("DocumentEditorDebug: updated config", updatedConfig);

        // const uniqueNodeLabel = generateUniqueNodePropertyValue(
        //   node.label,
        //   "label",
        //   {
        //     separator: "parentheses",
        //   }
        // );

        console.log("DocumentEditorDebug: configs", configs);
        updateNodeByID(node.id, {
          documentConfigId: updatedConfig.id,
          label: documentLabel,
        });
        // updateWindowById(window.windowId, {
        //   documentConfig: updatedConfig,
        // });
      }

      setIsModified(false);
      console.log("DocumentEditor: document saved successfully");
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-100">
      {/* Header with all controls */}
      <DocumentHeader
        textStyle={textStyle}
        pageBackgroundColor={pageBackgroundColor}
        isModified={isModified}
        windowWidth={windowWidth}
        zoom={zoom}
        onTextStyleUpdate={updateTextStyle}
        onPageColorChange={handlePageColorChange}
        onSave={handleSave}
        onModified={handleModified}
        onZoomChange={handleZoomChange}
        onZoomReset={handleZoomReset}
        nextZIndex={nextZIndex}
        documentLabel={documentLabel}
        onLabelChange={handleLabelChange}
      />

      {/* Document content area */}
      <DocumentContent
        content={content}
        textStyle={textStyle}
        effectiveFontSize={effectiveFontSize}
        pageBackgroundColor={pageBackgroundColor}
        onChange={handleContentChange}
      />

      {/* Footer */}
      <DocumentFooter content={content} />
    </div>
  );
};

// Create new document node (save to root directory for now)
// const currentNode = getNodeByID(window.nodeId);
// const savedDocumentId = `saved-doc-${Date.now()}`;

// // if (currentNode) {
// //   // Get image from current node if it has one, otherwise use default document image
// //   const documentImage = PAGES;
// //   const documentAlternativeImage = WORD;

// //   // Generate unique label for the document
// //   const uniqueLabel = generateUniqueLabel(documentLabel, desktopRootId);

// //   const newDocumentNode = {
// //     id: savedDocumentId,
// //     parentId: desktopRootId, // Save to root directory
// //     type: "document" as const,
// //     label: uniqueLabel,
// //     image: documentImage,
// //     alternativeImage: documentAlternativeImage,
// //     componentKey: "documentEditor",
// //     documentConfigId: configId, // Link to the saved configuration
// //     applicationRegistryId: "documentEditor",
// //     applicationId: "documentEditor",
// //     macExtension: ".txt",
// //     windowsExtension: ".txt",
// //     dateModified: now.toISOString(),
// //     size: charCount,
// //   };

// //   console.log(
// //     "DocumentEditor: creating document node",
// //     savedDocumentId,
// //     "with label",
// //     uniqueLabel
// //   );
// //   createOneNode(newDocumentNode as DocumentEntry);

// //   // Update current window to reference the saved document
// //   updateWindowById(window.windowId, {
// //     nodeId: savedDocumentId,
// //     title: uniqueLabel,
// //     documentConfig: newConfig,
// //   });
// // }
