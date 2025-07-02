import React, { useState, useEffect } from "react";
import type { WindowType } from "../../../types/storeTypes";
import { useNewStore } from "../../../hooks/useStore";
import { desktopRootId } from "../../../constants/nodes";
import { DOCUMENT } from "../../../constants/images";

// Import the new components
import { DocumentHeader } from "./DocumentHeader";
import { DocumentContent } from "./DocumentContent";
import { DocumentFooter } from "./DocumentFooter";

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

  // Store actions for save functionality
  const windowData = useNewStore((s) => s.getWindowById(windowId));
  const generateConfigId = useNewStore((s) => s.generateConfigId);
  const setDocumentConfig = useNewStore((s) => s.setDocumentConfig);
  const updateWindowById = useNewStore((s) => s.updateWindowById);
  const createOneNode = useNewStore((s) => s.createOneNode);
  const getNodeByID = useNewStore((s) => s.getNodeByID);

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
      const updatedConfig = {
        ...windowData.documentConfig!,
        content,
        textStyle,
        pageSettings: {
          backgroundColor: pageBackgroundColor,
        },
        metadata: {
          ...windowData.documentConfig!.metadata,
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
          title: windowData.title,
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
        const documentImage = DOCUMENT;

        const newDocumentNode = {
          id: savedDocumentId,
          parentId: desktopRootId, // Save to root directory
          type: "document" as const,
          label: (windowData.title || "Document") + " (Saved)",
          image: documentImage,
          documentConfigId: configId, // Link to the saved configuration
        };

        console.log("DocumentEditor: creating document node", savedDocumentId);
        createOneNode(newDocumentNode);

        // Update current window to reference the saved document
        updateWindowById(windowData.windowId, {
          nodeId: savedDocumentId,
          title: (windowData.title || "Document") + " (Saved)",
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
        onTextStyleUpdate={updateTextStyle}
        onPageColorChange={handlePageColorChange}
        onSave={handleSave}
        onModified={handleModified}
        nextZIndex={nextZIndex}
      />

      {/* Document content area */}
      <DocumentContent
        content={content}
        textStyle={textStyle}
        pageBackgroundColor={pageBackgroundColor}
        onChange={handleContentChange}
      />

      {/* Footer */}
      <DocumentFooter content={content} />
    </div>
  );
};
