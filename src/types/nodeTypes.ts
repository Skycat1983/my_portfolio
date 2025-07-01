// TODO: these types could be 'Entry extends BaseNodeObject' and just add the parentId?

import type { WINDOW_COMPONENT_REGISTRY } from "../components/window/WindowComponentRegistry";

export interface BaseNodeObject {
  id: string;
  type: string;
  label: string;
  image: string;
}

export interface BaseNodeEntry {
  id: string;
  parentId: string | null;
  type: string;
  label: string;
  image: string;
}

export interface AppObject {
  id: string;
  type: "app";
  label: string;
  image: string;
  componentKey: keyof typeof WINDOW_COMPONENT_REGISTRY; // Optional custom component identifier
}

export interface AppEntry {
  id: string;
  parentId: string | null;
  type: "app";
  label: string;
  image: string;
  componentKey: keyof typeof WINDOW_COMPONENT_REGISTRY; // Optional custom component identifier
}

// HUMAN-READABLE OBJECT TYPES
export interface DirectoryObject {
  id: string;
  type: "directory";
  label: string;
  image?: string;
  children: NodeObject[];
  componentKey?: string; // Optional custom component identifier
}

export interface DirectoryEntry {
  id: string;
  parentId: string | null;
  children: string[];
  type: "directory";
  label: string;
  image?: string;
  componentKey?: string; // Optional custom component identifier
}

export interface AchievementObject {
  id: string;
  type: "achievement";
  label: string;
  image: string;
  componentKey?: string; // Optional custom component identifier
}

export interface AchievementEntry {
  id: string;
  parentId: string | null;
  type: "achievement";
  label: string;
  image: string;
  componentKey?: string; // Optional custom component identifier
}

export interface DocumentObject {
  id: string;
  type: "document";
  label: string;
  image: string;
  componentKey?: string; // Optional custom component identifier
  documentConfigId?: string; // Optional reference to document registry config
}

export interface DocumentEntry {
  id: string;
  parentId: string | null;
  type: "document";
  label: string;
  image: string;
  componentKey?: string; // Optional custom component identifier
  documentConfigId?: string; // Optional reference to document registry config
}

export interface BrowserObject {
  id: string;
  type: "browser";
  label: string;
  componentKey?: string; // Optional custom component identifier
}

export interface BrowserEntry {
  id: string;
  parentId: string | null;
  type: "browser";
  label: string;
  componentKey?: string; // Optional custom component identifier
}

export interface IconObject {
  id: string;
  type: "icon";
  label: string;
  image: string;
  info: string;
}

export interface IconEntry {
  id: string;
  parentId: string | null;
  type: "icon";
  label: string;
  image: string;
  info: string;
}

export interface LinkObject {
  id: string;
  type: "link";
  label: string;
  image: string;
  url: string;
}

export interface LinkEntry {
  id: string;
  parentId: string | null;
  type: "link";
  label: string;
  image: string;
  url: string;
}

export interface EasterEggObject {
  id: string;
  type: "easter-egg";
  label: string;
  image: string[];
  currentImageIndex: number;
  isBroken: boolean;
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

export interface TerminalObject {
  id: string;
  type: "terminal";
  label: string;
  // image: string;
  componentKey?: string; // Optional custom component identifier
}

export interface TerminalEntry {
  id: string;
  parentId: string | null;
  type: "terminal";
  label: string;
  // image: string;
  componentKey?: string; // Optional custom component identifier
}

export interface GameObject {
  id: string;
  type: "game";
  label: string;
  image: string;
  componentKey?: string; // Optional custom component identifier
}

export interface GameEntry {
  id: string;
  parentId: string | null;
  type: "game";
  label: string;
  image: string;
  componentKey?: string; // Optional custom component identifier
}

export type NodeObject =
  | DirectoryObject
  | IconObject
  | LinkObject
  | EasterEggObject
  | TerminalObject
  | BrowserObject
  | DocumentObject
  | AchievementObject
  | GameObject
  | AppObject;

// OPERATIONAL MAP TYPES - Discriminated Union Interfaces

export type NodeEntry =
  | DirectoryEntry
  | IconEntry
  | LinkEntry
  | EasterEggEntry
  | TerminalEntry
  | BrowserEntry
  | DocumentEntry
  | AchievementEntry
  | GameEntry
  | AppEntry;

export interface NodeMap {
  [id: string]: NodeEntry;
}
