import type {
  NODE_FUNCTION_REGISTRY,
  WINDOW_COMPONENT_REGISTRY,
} from "../window/WindowComponentRegistry";
import type { DOCUMENT_CONFIG_REGISTRY } from "../../constants/documentRegistry";
import type { ApplicationRegistryId } from "@/constants/applicationRegistry";

// NEW SIMPLIFIED TYPE SYSTEM
export type NodeType =
  | "easter-egg"
  | "application"
  | "directory"
  | "link"
  | "function"
  | "document";

// BASE INTERFACES
export interface BaseNodeObject {
  id: string;
  type: NodeType;
  label: string;
  image: string;
  alternativeImage: string | null; // For state-dependent icon switching (null = no alternative)
  dateModified: string; // ISO date string
  size: number | null; // File size in bytes, null for directories
}

export type MacDirectoryExtensions = null;
export type WindowsDirectoryExtensions = null;
export type DirectoryExtensions =
  | MacDirectoryExtensions
  | WindowsDirectoryExtensions;

export type MacLinkExtensions = ".webloc" | ".png" | ".jpg" | ".pdf";
export type WindowsLinkExtensions = ".url" | ".png" | ".jpg" | ".pdf";
export type LinkExtensions = MacLinkExtensions | WindowsLinkExtensions;

export type MacApplicationExtensions = ".app" | ".command" | ".txt";
export type WindowsApplicationExtensions = ".exe" | ".bat" | ".txt";
export type ApplicationExtensions =
  | MacApplicationExtensions
  | WindowsApplicationExtensions;

export type MacEasterEggExtensions = ".egg";
export type WindowsEasterEggExtensions = ".egg";
export type EasterEggExtensions =
  | MacEasterEggExtensions
  | WindowsEasterEggExtensions;

export type MacDocumentExtensions = ".txt";
export type WindowsDocumentExtensions = ".txt";
export type DocumentExtensions =
  | MacDocumentExtensions
  | WindowsDocumentExtensions;

export type MacExtensions =
  | MacApplicationExtensions
  | MacLinkExtensions
  | MacEasterEggExtensions
  | MacDocumentExtensions;
export type WindowsExtensions =
  | WindowsApplicationExtensions
  | WindowsLinkExtensions
  | WindowsEasterEggExtensions
  | WindowsDocumentExtensions;

export interface BaseNodeEntry extends BaseNodeObject {
  parentId: string | null;
}

// OBJECT TYPES (Human-readable nested structure)
export interface DirectoryObject extends BaseNodeObject {
  type: "directory";
  image: string; // Required for directories
  alternativeImage: string | null;
  componentKey: keyof typeof WINDOW_COMPONENT_REGISTRY;
  macExtension: MacDirectoryExtensions;
  windowsExtension: WindowsDirectoryExtensions;
  applicationRegistryId: ApplicationRegistryId;
  children: NodeObject[];
  size: null; // Override size to always be null for directories
}
// ENTRY TYPES (Flat map structure with parentId)
export interface DirectoryEntry extends BaseNodeEntry {
  type: "directory";
  image: string;
  alternativeImage: string | null;
  componentKey: keyof typeof WINDOW_COMPONENT_REGISTRY;
  macExtension: MacDirectoryExtensions;
  windowsExtension: WindowsDirectoryExtensions;
  applicationRegistryId: ApplicationRegistryId;

  children: string[]; // Array of child IDs
}

export interface ApplicationObject extends BaseNodeObject {
  type: "application";
  image: string; // Required for applications
  alternativeImage: string | null;
  componentKey: keyof typeof WINDOW_COMPONENT_REGISTRY;
  applicationId: string; // Application identity separate from node identity
  applicationRegistryId: ApplicationRegistryId;
  macExtension: MacApplicationExtensions;
  windowsExtension: WindowsApplicationExtensions;
}

export interface ApplicationEntry extends BaseNodeEntry {
  type: "application";
  image: string;
  alternativeImage: string | null;
  componentKey: keyof typeof WINDOW_COMPONENT_REGISTRY;
  applicationId: string; // Application identity separate from node identity
  applicationRegistryId: ApplicationRegistryId;
  macExtension: MacApplicationExtensions;
  windowsExtension: WindowsApplicationExtensions;
}

export interface EasterEggObject extends BaseNodeObject {
  type: "easter-egg";
  image: string;
  alternativeImage: string | null;
  isBroken: boolean;
  macExtension: MacEasterEggExtensions;
  windowsExtension: WindowsEasterEggExtensions;
}

export interface EasterEggEntry extends BaseNodeEntry {
  type: "easter-egg";
  image: string;
  alternativeImage: string | null;
  isBroken: boolean;
  macExtension: MacEasterEggExtensions;
  windowsExtension: WindowsEasterEggExtensions;
}

export interface LinkObject extends BaseNodeObject {
  type: "link";
  image: string; // Required for links
  alternativeImage: string | null;
  url: string;
  macExtension: MacLinkExtensions;
  windowsExtension: WindowsLinkExtensions;
  // functionKey: keyof typeof NODE_FUNCTION_REGISTRY;
}

export interface LinkEntry extends BaseNodeEntry {
  type: "link";
  image: string;
  alternativeImage: string | null;
  url: string;
  macExtension: MacLinkExtensions;
  windowsExtension: WindowsLinkExtensions;
  // functionKey: keyof typeof NODE_FUNCTION_REGISTRY;
}

export interface FunctionObject extends BaseNodeObject {
  type: "function";
  image: string;
  alternativeImage: string | null;
  functionKey: keyof typeof NODE_FUNCTION_REGISTRY;
  macExtension: MacApplicationExtensions;
  windowsExtension: WindowsApplicationExtensions;
}

export interface FunctionEntry extends BaseNodeEntry {
  type: "function";
  image: string;
  alternativeImage: string | null;
  functionKey: keyof typeof NODE_FUNCTION_REGISTRY;
  macExtension: MacApplicationExtensions;
  windowsExtension: WindowsApplicationExtensions;
}

export interface DocumentObject extends BaseNodeObject {
  type: "document";
  image: string; // Required for documents
  alternativeImage: string | null;
  applicationId: string; // Application that handles this document type
  documentConfigId: string; // Type-safe config key
  applicationRegistryId: ApplicationRegistryId;
  macExtension: MacDocumentExtensions;
  windowsExtension: WindowsDocumentExtensions;
}

export interface DocumentEntry extends BaseNodeEntry {
  type: "document";
  image: string;
  alternativeImage: string | null;
  applicationId: string; // Application that handles this document type
  documentConfigId: string; // Type-safe config key
  // documentConfigId: keyof typeof DOCUMENT_CONFIG_REGISTRY; // Type-safe config key
  applicationRegistryId: ApplicationRegistryId;
  macExtension: MacDocumentExtensions;
  windowsExtension: WindowsDocumentExtensions;
}

// UNION TYPES
export type NodeObject =
  | DirectoryObject
  | ApplicationObject
  | LinkObject
  | EasterEggObject
  | FunctionObject
  | DocumentObject;
export type NodeEntry =
  | DirectoryEntry
  | ApplicationEntry
  | LinkEntry
  | EasterEggEntry
  | FunctionEntry
  | DocumentEntry;

// NODE MAP TYPE
export interface NodeMap {
  [id: string]: NodeEntry;
}

export type NodeId = string;
