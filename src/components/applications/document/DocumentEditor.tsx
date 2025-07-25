import React, { useState, useEffect, useCallback } from "react";
import { useNewStore } from "@/hooks/useStore";
import { PAGES, WORD } from "@/constants/images";

// Import the new components
import { DocumentHeader } from "./DocumentHeader";
import { DocumentContent } from "./DocumentContent";
import { DocumentFooter } from "./DocumentFooter";
import { SaveLocationDialog } from "@/components/dialogs/SaveLocationDialog";
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
  const [saveLocation] = useState(desktopRootId);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

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

  // Handle save from dialog with selected location and label
  const handleDialogSave = useCallback(
    (location: string, finalLabel: string) => {
      const now = new Date();
      const wordCount = content
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
      const charCount = content.length;
      const node = getNodeByID(nodeId);

      if (!node) return;

      // Create new document config
      const newDocumentConfigId = generateConfigId();
      const newDocumentConfig: DocumentConfig = {
        id: newDocumentConfigId,
        mutable: true,
        content,
        textStyle,
        pageSettings: { backgroundColor: pageBackgroundColor },
        metadata: {
          title: finalLabel,
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

      // Generate unique node ID
      const baseNodeId = node.id;
      const uniqueNodeId = generateUniqueNodePropertyValue(baseNodeId, "id", {
        separator: "parentheses",
      });

      // Create new node with selected location and final label
      const newNode: DocumentEntry = {
        id: uniqueNodeId,
        parentId: location, // Use selected location
        type: "document",
        label: finalLabel, // Use final label from dialog
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

      // Execute save operations
      createOneNode(newNode);
      addChildToDirectory(location, newNode.id);

      if (window) {
        updateWindowById(window.windowId, {
          nodeId: newNode.id,
          title: newNode.label,
          documentConfig: newConfig,
        });
      }

      // Update local state
      setDocumentLabel(finalLabel);
      setIsModified(false);
      setShowSaveDialog(false); // Close dialog
    },
    [
      content,
      textStyle,
      pageBackgroundColor,
      nodeId,
      window,
      generateConfigId,
      setDocumentConfig,
      generateUniqueNodePropertyValue,
      createOneNode,
      addChildToDirectory,
      updateWindowById,
      getNodeByID,
    ]
  );

  // Initialize document state from window configuration if available
  useEffect(() => {
    const node = getNodeByID(nodeId);
    if (node && node.type === "document") {
      const documentConfig = getDocumentConfig(node.documentConfigId);
      if (!documentConfig) {
        return;
      }
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
    const now = new Date();
    const wordCount = content
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const charCount = content.length;

    // get the node
    const node = getNodeByID(nodeId);

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

      // check if the document config is mutable
      const isWritable = documentConfig?.mutable;

      // Check if we can overwrite the document config
      if (!isWritable) {
        // Open dialog instead of immediate save
        setShowSaveDialog(true);
        return; // Exit early, let dialog handle the save
      } else {
        // Create new document configuration for first-time save
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

        const updatedConfig = setDocumentConfig(documentConfig.id, newConfig);

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

      {/* Save Location Dialog */}
      <SaveLocationDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        initialLocation={saveLocation}
        initialLabel={documentLabel}
        onSave={handleDialogSave}
      />
    </div>
  );
};
