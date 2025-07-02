import type { WINDOW_COMPONENT_REGISTRY } from "../components/window/WindowComponentRegistry";

// NEW SIMPLIFIED TYPE SYSTEM
export type NodeType = "easter-egg" | "application" | "directory" | "link";

// BASE INTERFACES
export interface BaseNodeObject {
  id: string;
  type: NodeType;
  label: string;
  image?: string;
  alternativeImage: string | null; // For state-dependent icon switching (null = no alternative)
}

export interface BaseNodeEntry extends BaseNodeObject {
  parentId: string | null;
}

// OBJECT TYPES (Human-readable nested structure)
export interface DirectoryObject extends BaseNodeObject {
  type: "directory";
  image: string; // Required for directories
  alternativeImage: string | null;
  componentKey: keyof typeof WINDOW_COMPONENT_REGISTRY;
  children: NodeObject[];
}

export interface ApplicationObject extends BaseNodeObject {
  type: "application";
  image: string; // Required for applications
  alternativeImage: string | null;
  componentKey: keyof typeof WINDOW_COMPONENT_REGISTRY;
}

export interface LinkObject extends BaseNodeObject {
  type: "link";
  image: string; // Required for links
  alternativeImage: string | null;
  url: string;
}

export interface EasterEggObject {
  id: string;
  type: "easter-egg";
  label: string;
  image: string[]; // Array for easter eggs
  currentImageIndex: number;
  isBroken: boolean;
}

// ENTRY TYPES (Flat map structure with parentId)
export interface DirectoryEntry extends BaseNodeEntry {
  type: "directory";
  image: string;
  alternativeImage: string | null;
  componentKey: keyof typeof WINDOW_COMPONENT_REGISTRY;
  children: string[]; // Array of child IDs
}

export interface ApplicationEntry extends BaseNodeEntry {
  type: "application";
  image: string;
  alternativeImage: string | null;
  componentKey: keyof typeof WINDOW_COMPONENT_REGISTRY;
}

export interface LinkEntry extends BaseNodeEntry {
  type: "link";
  image: string;
  alternativeImage: string | null;
  url: string;
}

export interface EasterEggEntry {
  id: string;
  parentId: string | null;
  type: "easter-egg";
  label: string;
  image: string[];
  currentImageIndex: number;
  isBroken: boolean;
}

// UNION TYPES
export type NodeObject =
  | DirectoryObject
  | ApplicationObject
  | LinkObject
  | EasterEggObject;
export type NodeEntry =
  | DirectoryEntry
  | ApplicationEntry
  | LinkEntry
  | EasterEggEntry;

// NODE MAP TYPE
export interface NodeMap {
  [id: string]: NodeEntry;
}
