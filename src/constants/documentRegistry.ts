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

You can find my CV and letter of recommendation in the PDFs folder. If you're a prospective employer, please feel free to contact me.

I have tried to recreate the behaviour of of a typical desktop/mobile environment. Try adjusting the window size to see how the application behaves.

There are lots of applications to use, and quite a few easter eggs to find.

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

// Personal introduction document config
export const PERSONAL_DOCUMENT_CONFIG: DocumentConfig = {
  id: "personal_document_config",
  mutable: true,
  content: `Personal Introduction

Hello! I'm Heron Laoutaris, a passionate software developer with expertise in modern web technologies.

Professional Background:
• Frontend Development (React, TypeScript, Next.js)
• UI/UX Design with modern frameworks
• Full-stack application development
• Progressive Web Applications

This Portfolio Hub:
This interactive portfolio showcases my technical skills through a fully functional desktop environment built with React and TypeScript. You can:
• Browse my applications and games
• View my CV and recommendations in the PDFs folder
• Explore various interactive demos
• Test responsive design across different screen sizes

Technical Features:
• Advanced drag and drop functionality
• Multi-window management system
• Progressive Web App capabilities
• Cross-platform compatibility
• Modern UI/UX principles

Contact Information:
Feel free to reach out through LinkedIn or GitHub links available throughout the portfolio.

Thank you for exploring my work!`,
  textStyle: {
    fontFamily: "Inter",
    fontSize: 16,
    isBold: false,
    isItalic: false,
    isUnderlined: false,
    color: "#1f2937",
    textAlign: "left" as const,
  },
  pageSettings: {
    backgroundColor: "#ffffff",
  },
  metadata: {
    title: "Personal Introduction",
    createdAt: new Date("2024-03-20T09:00:00Z"),
    modifiedAt: new Date("2024-03-20T09:00:00Z"),
    wordCount: 142,
    charCount: 1056,
  },
};

export const MY_STACK_DOCUMENT_CONFIG: DocumentConfig = {
  id: "my_stack_document_config",
  mutable: true,
  content: `
Core Languages & Fundamentals:

HTML
CSS
JavaScript
TypeScript

Frontend Frameworks & Libraries:

React
Next.js
Zustand
Tailwind CSS
Bootstrap

Backend & APIs:

Node.js
Express
RESTful APIs

Databases & Storage:

MongoDB
Firebase

Testing & Dev Tools:

Jest
Git

Design & Prototyping

Figma  `,
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
    title: "My Stack",
    createdAt: new Date("2024-03-20T09:00:00Z"),
    modifiedAt: new Date("2024-03-20T09:00:00Z"),
    wordCount: 142,
    charCount: 1056,
  },
};

export const PRIVATE_DOCUMENT_CONFIG: DocumentConfig = {
  id: "private_document_config",
  mutable: true,
  content: `
All of you achievements have been reset.
  `,
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
    title: "Private",
    createdAt: new Date("2024-03-20T09:00:00Z"),
    modifiedAt: new Date("2024-03-20T09:00:00Z"),
    wordCount: 142,
    charCount: 1056,
  },
};

// Document Config Registry for type safety (similar to WINDOW_COMPONENT_REGISTRY)
export const DOCUMENT_CONFIG_REGISTRY = {
  sample_document_config: SAMPLE_DOCUMENT_CONFIG,
  default_document_config: DEFAULT_DOCUMENT_CONFIG,
  personal_document_config: PERSONAL_DOCUMENT_CONFIG,
  my_stack_document_config: MY_STACK_DOCUMENT_CONFIG,
  private_document_config: PRIVATE_DOCUMENT_CONFIG,
} as const;

export const SAMPLE_DOCUMENT_ID = "sample_document_config";

export const getDocumentConfig = (id: string) => {
  return DOCUMENT_CONFIG_REGISTRY[id as keyof typeof DOCUMENT_CONFIG_REGISTRY];
};
