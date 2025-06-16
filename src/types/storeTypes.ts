import type { DirectoryEntry, NodeEntry, NodeMap } from "./nodeTypes";
import type { OperatingSystem } from "../store/systemSlice";

// Full Window interface with ALL possible properties across all window types
export interface Window {
  windowId: string;
  title: string;
  nodeId: NodeEntry["id"];
  nodeType: string;
  width: number;
  height: number;
  x: number; // Window position X coordinate
  y: number; // Window position Y coordinate
  zIndex: number;

  // Optional: Window state flags (for future features)
  isMinimized?: boolean;
  isMaximized?: boolean;
  isResizing?: boolean;

  // Directory-specific properties (optional on base Window)
  currentPath?: string;
  canGoBack?: boolean;
  canGoForward?: boolean;
  navigationHistory?: string[];
  currentHistoryIndex?: number;

  // Browser-specific properties (optional on base Window)
  url?: string;
  bookmarks?: string[];

  // Terminal-specific properties (optional on base Window)
  workingDirectory?: string;
  terminalHistory?: string[];

  // Achievement window properties (optional on base Window)
  achievements?: unknown[]; // Will be properly typed when achievement system is implemented
}

// Narrowed types for specific window types using utility types
export type ApplicationWindow = Omit<
  Window,
  | "currentPath"
  | "canGoBack"
  | "canGoForward"
  | "navigationHistory"
  | "currentHistoryIndex"
  | "url"
  | "bookmarks"
  | "workingDirectory"
  | "terminalHistory"
  | "achievements"
>;

export type DirectoryWindow = Required<
  Pick<
    Window,
    | "windowId"
    | "title"
    | "nodeId"
    | "nodeType"
    | "width"
    | "height"
    | "x"
    | "y"
    | "zIndex"
    | "currentPath"
    | "canGoBack"
    | "canGoForward"
    | "navigationHistory"
    | "currentHistoryIndex"
  >
> & {
  nodeType: "directory";
  nodeId: DirectoryEntry["id"];
} & Pick<Window, "isMinimized" | "isMaximized" | "isResizing">;

export type BrowserWindow = Required<
  Pick<
    Window,
    | "windowId"
    | "title"
    | "nodeId"
    | "nodeType"
    | "width"
    | "height"
    | "x"
    | "y"
    | "zIndex"
    | "url"
  >
> & {
  nodeType: "browser";
} & Pick<Window, "isMinimized" | "isMaximized" | "isResizing" | "bookmarks">;

export type TerminalWindow = Required<
  Pick<
    Window,
    | "windowId"
    | "title"
    | "nodeId"
    | "nodeType"
    | "width"
    | "height"
    | "x"
    | "y"
    | "zIndex"
    | "workingDirectory"
  >
> & {
  nodeType: "terminal";
} & Pick<
    Window,
    "isMinimized" | "isMaximized" | "isResizing" | "terminalHistory"
  >;

export type AchievementWindow = Required<
  Pick<
    Window,
    | "windowId"
    | "title"
    | "nodeId"
    | "nodeType"
    | "width"
    | "height"
    | "x"
    | "y"
    | "zIndex"
  >
> & {
  nodeType: "achievements";
} & Pick<Window, "isMinimized" | "isMaximized" | "isResizing" | "achievements">;

// Legacy DirectoryWindow interface (can be removed once everything uses the new types)
export interface DirectoryWindowLegacy extends Window {
  nodeType: "directory";
  nodeId: DirectoryEntry["id"];
  currentPath: string;
  canGoBack: boolean;
  canGoForward: boolean;
  navigationHistory: string[];
  currentHistoryIndex: number;
}

// Forward declare WindowData to avoid circular imports (legacy - for old windowSlice)
export interface WindowData {
  windowId: string;
  currentNodeId: string;
  zIndex: number;
  navigationHistory: string[];
  currentHistoryIndex: number;
}

// Base store state interface that slices can reference
export interface BaseStoreState {
  nodeMap: NodeMap;
  rootId: string;
  selectedNodeId: string | null;
  selectedNodeIds: string[];
  openWindows: Window[];
  nextZIndex: number;
  isTerminalOpen: boolean;
  operatingSystem: OperatingSystem;
  browserZIndex: number;
  terminalZIndex: number;
  // Legacy properties for old windowSlice (temporarily commented out)
  // openWindows: WindowData[];
  // achievements: AchievementSlice;
}

export type SetState<T> = (
  partial: Partial<T> | ((state: T) => Partial<T>)
) => void;
export type GetState<T> = () => T;

// Store interface that includes CRUD operations for slices to reference
