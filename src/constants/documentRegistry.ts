import type { TextStyle } from "@/types/storeTypes";

export const RESUME_PATH = "/documents/resume.pdf";
export const RECOMMENDATIONS_PATH = "/documents/recommendation.pdf";
export const REVIEW_PATH = "/images/screenshot.png";

export const DOCUMENTS = {
  RESUME: RESUME_PATH,
  RECOMMENDATIONS: RECOMMENDATIONS_PATH,
  REVIEW: REVIEW_PATH,
};

export interface DocumentConfig {
  id: string; // Unique config identifier
  mutable: boolean; // Whether the document config is mutable
  content: string; // Document text content
  textStyle: TextStyle; // Font, size, colors, alignment
  pageSettings: {
    backgroundColor: string; // Page background color
  };
  metadata: {
    title: string;
    createdAt: Date;
    modifiedAt: Date;
    wordCount: number;
    charCount: number;
  };
}

// Default empty document config for when Pages app is opened directly
export const DEFAULT_DOCUMENT_CONFIG: DocumentConfig = {
  id: "default_document_config",
  mutable: false,
  content: ``,
  textStyle: {
    fontFamily: "Inter",
    fontSize: 14,
    isBold: false,
    isItalic: false,
    isUnderlined: false,
    color: "#000000",
    textAlign: "left" as const,
  },
  pageSettings: {
    backgroundColor: "#ffffff",
  },
  metadata: {
    title: "Untitled",
    createdAt: new Date(),
    modifiedAt: new Date(),
    wordCount: 0,
    charCount: 0,
  },
};

// Sample document configuration for demonstration
export const SAMPLE_DOCUMENT_CONFIG: DocumentConfig = {
  id: "sample_document_config",
  mutable: true,
  content: `Welcome to My Portfolio Hub

This is a sample document that demonstrates the document management system in this portfolio application. 

Key Features:
• Document type nodes that open in the Pages application
• Persistent document storage using the document registry
• Application focus logic that works across dock and desktop instances
• Proper cleanup when documents are deleted

Technical Architecture:
This document represents a new node type called "document" which links to both:
1. An application (Pages) via applicationId
2. A saved document configuration via documentConfigId

You can edit this document using the toolbar above. Changes are saved to the document registry if you click the 'save' button.

Best regards,
Heron`,
  textStyle: {
    fontFamily: "Inter",
    fontSize: 14,
    isBold: false,
    isItalic: false,
    isUnderlined: false,
    color: "#000000",
    textAlign: "left" as const,
  },
  pageSettings: {
    backgroundColor: "#ffffff",
  },
  metadata: {
    title: "Portfolio Document",
    createdAt: new Date("2024-01-01T10:00:00Z"),
    modifiedAt: new Date("2024-01-01T10:00:00Z"),
    wordCount: 156,
    charCount: 982,
  },
};

// Document Config Registry for type safety (similar to WINDOW_COMPONENT_REGISTRY)
export const DOCUMENT_CONFIG_REGISTRY = {
  sample_document_config: SAMPLE_DOCUMENT_CONFIG,
  default_document_config: DEFAULT_DOCUMENT_CONFIG,
} as const;

export const SAMPLE_DOCUMENT_ID = "sample_document_config";

export const getDocumentConfig = (id: string) => {
  return DOCUMENT_CONFIG_REGISTRY[id as keyof typeof DOCUMENT_CONFIG_REGISTRY];
};
