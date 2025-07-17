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
  const addChildToDirectory = useNewStore((s) => s.addChildToDirectory);

  // ═══════════════════════════════════════════════════════════════════════════════
  // DOCUMENT STORE
  // ═══════════════════════════════════════════════════════════════════════════════
  const generateConfigId = useNewStore((s) => s.generateConfigId);
  const getDocumentConfig = useNewStore((s) => s.getDocumentConfig);
  const setDocumentConfig = useNewStore((s) => s.setDocumentConfig);

  // ═══════════════════════════════════════════════════════════════════════════════
  // SYSTEM STATE
  // ═══════════════════════════════════════════════════════════════════════════════
  const resetAchievements = useNewStore((s) => s.resetAchievements);

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
      if (documentConfig.id === "private_document_config") {
        resetAchievements();
      }
      const isWritable = documentConfig?.mutable;

      const docLabel = isWritable ? node.label : documentConfig.metadata.title;
      setContent(documentConfig.content);
      setTextStyle(documentConfig.textStyle);
      setPageBackgroundColor(documentConfig.pageSettings.backgroundColor);
      setDocumentLabel(docLabel);
      setIsModified(false); // Document is saved, so not modified initially
    }
  }, [nodeId, getNodeByID, getDocumentConfig, resetAchievements]);

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
    console.log("DocumentEditorDebug: 1 handleSave");
    const now = new Date();
    const wordCount = content
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const charCount = content.length;

    // get the node
    const node = getNodeByID(nodeId);
    console.log("DocumentEditorDebug: 2 node", node);

    // type check the node
    if (node) {
      // get the document config
      const defaultDocumentConfig = getDocumentConfig(
        "default_document_config"
      );
      const documentConfig =
        node.type === "document"
          ? getDocumentConfig(node.documentConfigId)
          : defaultDocumentConfig;
      console.log("DocumentEditorDebug: documentConfig", documentConfig);

      // check if the document config is mutable
      const isWritable = documentConfig?.mutable;

      // Check if we can overwrite the document config
      if (!isWritable) {
        const location = desktopRootId;
        console.log("DocumentEditorDebug: 3 isWritable", isWritable);
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
        console.log("DocumentEditorDebug: 4 newConfig", newConfig);
        const baseNodeId = node.id;
        const uniqueNodeId = generateUniqueNodePropertyValue(baseNodeId, "id", {
          separator: "parentheses",
        });
        const isUniqueLabel = isUniqueNodePropertyValue(documentLabel, "label");
        console.warn("DocumentEditorDebug: isUniqueLabel", isUniqueLabel);
        const uniqueNodeLabel = isUniqueLabel
          ? documentLabel
          : generateUniqueNodePropertyValue(documentLabel, "label", {
              separator: "parentheses",
            });
        console.warn("DocumentEditorDebug: uniqueNodeLabel", uniqueNodeLabel);

        console.log("DocumentEditorDebug: 5 uniqueNodeId", uniqueNodeId);

        const newNode: DocumentEntry = {
          id: uniqueNodeId,
          parentId: location,
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
          protected: false,
        };
        console.log("DocumentEditorDebug: 6 createOneNode", newNode);
        createOneNode(newNode);
        addChildToDirectory(location, newNode.id);
        console.log("DocumentEditorDebug: 7 updateWindowById", window.windowId);
        updateWindowById(window.windowId, {
          nodeId: newNode.id,
          title: newNode.label,
          documentConfig: newConfig,
        });
        console.log("DocumentEditorDebug: 8 updateWindowById", window.windowId);
      } else {
        // Create new document configuration for first-time save
        console.log("DocumentEditorDebug: 9 isWritable", isWritable);
        const newConfig = {
          id: documentConfig.id,
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
          "DocumentEditorDebug: 10 creating new document config",
          documentConfig.id
        );
        const updatedConfig = setDocumentConfig(documentConfig.id, newConfig);
        console.log("DocumentEditorDebug: 11 updated config", updatedConfig);

        updateNodeByID(node.id, {
          documentConfigId: updatedConfig.id,
          label: documentLabel,
          dateModified: now.toISOString(),
          size: charCount,
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
