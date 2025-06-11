// HUMAN-READABLE OBJECT TYPES
export interface DirectoryObject {
  id: string;
  type: "directory";
  label: string;
  image: string;
  children: NodeObject[];
}

export interface DirectoryEntry {
  id: string;
  parentId: string | null;
  children: string[];
  type: "directory";
  label: string;
  image: string;
}

export interface AppObject {
  id: string;
  type: "app";
  label: string;
  image: string;
  action?: () => void;
}

export interface AppEntry {
  id: string;
  parentId: string | null;
  type: "app";
  label: string;
  image: string;
  action?: () => void;
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

export type NodeObject =
  | DirectoryObject
  | AppObject
  | LinkObject
  | EasterEggObject;

// OPERATIONAL MAP TYPES - Discriminated Union Interfaces

export type NodeEntry = DirectoryEntry | AppEntry | LinkEntry | EasterEggEntry;

export interface NodeMap {
  [id: string]: NodeEntry;
}
