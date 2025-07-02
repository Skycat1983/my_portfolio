import React, { useState, useEffect } from "react";
import type { WindowType } from "@/types/storeTypes";
import { useNewStore } from "@/hooks/useStore";
import { desktopRootId } from "@/constants/nodes";
import { PAGES, WORD } from "@/constants/images";

// Import the new components
import { DocumentHeader } from "./DocumentHeader";
import { DocumentContent } from "./DocumentContent";
import { DocumentFooter } from "./DocumentFooter";
import type { ApplicationEntry } from "@/types/nodeTypes";

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
  windowId: WindowType["windowId"];
  nodeId: WindowType["nodeId"];
}

export const DocumentEditor = ({ windowId }: DocumentEditorProps) => {
  const [content, setContent] = useState("");
  const [isModified, setIsModified] = useState(false);
  const [pageBackgroundColor, setPageBackgroundColor] = useState("#FFFFFF");
  const [textStyle, setTextStyle] = useState<TextStyle>(DEFAULT_TEXT_STYLE);
  const [zoom, setZoom] = useState(1.0); // 100% zoom by default
  const [documentLabel, setDocumentLabel] = useState("Untitled");

  // Store actions for save functionality
  const windowData = useNewStore((s) => s.getWindowById(windowId));
  const generateConfigId = useNewStore((s) => s.generateConfigId);
  const setDocumentConfig = useNewStore((s) => s.setDocumentConfig);
  const updateWindowById = useNewStore((s) => s.updateWindowById);
  const createOneNode = useNewStore((s) => s.createOneNode);
  const getNodeByID = useNewStore((s) => s.getNodeByID);
  const generateUniqueLabel = useNewStore((s) => s.generateUniqueLabel);
  const updateNodeByID = useNewStore((s) => s.updateNodeByID);

  // Initialize document state from window configuration if available
  useEffect(() => {
    if (windowData?.documentConfig) {
      console.log(
        "DocumentEditor: initializing from saved config",
        windowData.documentConfig
      );

      const config = windowData.documentConfig;
      setContent(config.content);
      setTextStyle(config.textStyle);
      setPageBackgroundColor(config.pageSettings.backgroundColor);
      setDocumentLabel(config.metadata.title || "Untitled");
      setIsModified(false); // Document is saved, so not modified initially

      console.log(
        "DocumentEditor: loaded document with",
        config.metadata.wordCount,
        "words"
      );
    } else {
      console.log("DocumentEditor: initializing new document with defaults");
    }
  }, [windowData?.documentConfig]);

  if (!windowData) {
    return null;
  }

  // Responsive logic based on window width
  const windowWidth = windowData.width;
  const nextZIndex = windowData.zIndex + 1;

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

    // Check if this is an existing document or new document
    const isExistingDocument = !!windowData.documentConfig;

    if (isExistingDocument) {
      // Update existing document configuration
      const configId = windowData.documentConfig!.id;

      // Get the current node to update its label
      const nodeId = windowData.nodeId;
      const currentNode = getNodeByID(nodeId);
      let finalDocumentLabel = documentLabel;

      if (currentNode && nodeId && currentNode.parentId !== null) {
        // Generate unique label for the current directory
        finalDocumentLabel = generateUniqueLabel(
          documentLabel,
          currentNode.parentId
        );

        // Update the node's label
        updateNodeByID(nodeId, {
          label: finalDocumentLabel,
        });

        console.log(
          "DocumentEditor: updated node label to",
          finalDocumentLabel
        );
      }

      const updatedConfig = {
        ...windowData.documentConfig!,
        content,
        textStyle,
        pageSettings: {
          backgroundColor: pageBackgroundColor,
        },
        metadata: {
          ...windowData.documentConfig!.metadata,
          title: finalDocumentLabel,
          modifiedAt: now,
          wordCount,
          charCount,
        },
      };

      console.log(
        "DocumentEditor: updating existing document config",
        configId
      );
      setDocumentConfig(configId, updatedConfig);

      // Update window with new config
      updateWindowById(windowData.windowId, {
        title: finalDocumentLabel,
        documentConfig: updatedConfig,
      });
    } else {
      console.log("DocumentEditor: creating new document config");
      // Create new document configuration for first-time save
      const configId = generateConfigId();
      const newConfig = {
        id: configId,
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

      console.log("DocumentEditor: creating new document config", configId);
      setDocumentConfig(configId, newConfig);

      // Create new document node (save to root directory for now)
      const currentNode = getNodeByID(windowData.nodeId);
      const savedDocumentId = `saved-doc-${Date.now()}`;

      if (currentNode) {
        // Get image from current node if it has one, otherwise use default document image
        const documentImage = PAGES;
        const documentAlternativeImage = WORD;

        // Generate unique label for the document
        const uniqueLabel = generateUniqueLabel(documentLabel, desktopRootId);

        const newDocumentNode = {
          id: savedDocumentId,
          parentId: desktopRootId, // Save to root directory
          type: "application" as const,
          label: uniqueLabel,
          image: documentImage,
          alternativeImage: documentAlternativeImage,
          componentKey: "documentEditor",
          documentConfigId: configId, // Link to the saved configuration
        };

        console.log(
          "DocumentEditor: creating document node",
          savedDocumentId,
          "with label",
          uniqueLabel
        );
        createOneNode(newDocumentNode as ApplicationEntry);

        // Update current window to reference the saved document
        updateWindowById(windowData.windowId, {
          nodeId: savedDocumentId,
          title: uniqueLabel,
          documentConfig: newConfig,
        });
      }
    }

    setIsModified(false);
    console.log("DocumentEditor: document saved successfully");
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
