// HUMAN-READABLE OBJECT TYPES
export interface DirectoryObject {
  id: string;
  type: "directory";
  label: string;
  image: string;
  children: NodeObject[];
}

export interface BrowserObject {
  id: string;
  type: "browser";
  label: string;
}

export interface BrowserEntry {
  id: string;
  parentId: string | null;
  type: "browser";
  label: string;
}

export interface DirectoryEntry {
  id: string;
  parentId: string | null;
  children: string[];
  type: "directory";
  label: string;
  image: string;
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
  image: string;
}

export interface TerminalEntry {
  id: string;
  parentId: string | null;
  type: "terminal";
  label: string;
  image: string;
}

export type NodeObject =
  | DirectoryObject
  | IconObject
  | LinkObject
  | EasterEggObject
  | TerminalObject
  | BrowserObject;

// OPERATIONAL MAP TYPES - Discriminated Union Interfaces

export type NodeEntry =
  | DirectoryEntry
  | IconEntry
  | LinkEntry
  | EasterEggEntry
  | TerminalEntry
  | BrowserEntry;

export interface NodeMap {
  [id: string]: NodeEntry;
}
