import type { DirectoryEntry, NodeEntry, NodeMap } from "./nodeTypes";
import type { OperatingSystem } from "../store/systemState/systemSlice";

// Full Window interface with ALL possible properties across all window types
export interface WindowType {
  //! Core window properties
  windowId: string;
  title: string;
  nodeId: NodeEntry["id"];
  nodeType: string;
  width: number;
  height: number;
  x: number; // Window position X coordinate
  y: number; // Window position Y coordinate
  zIndex: number;

  //?: Window state flags (for future features)
  isMinimized?: boolean;
  isMaximized?: boolean;
  isResizing?: boolean;

  // Generic history properties (new unified approach)
  itemHistory: string[]; // Generic history array - URLs for browser, paths for directory, commands for terminal
  currentHistoryIndex: number; // Current position in history
  currentItem: string; // Current URL/path/command
  canGoBack: boolean; // Can navigate back in history
  canGoForward: boolean; // Can navigate forward in history

  // Directory-specific properties (optional on base Window) - LEGACY: will be replaced by generic properties
  currentPath?: string;
  navigationHistory?: string[];

  // Browser-specific properties (optional on base Window) - LEGACY: will be replaced by generic properties
  // TODO: remove this
  url?: string;
  bookmarks?: string[];

  // Terminal-specific properties (optional on base Window)
  workingDirectory?: string;
  terminalHistory?: string[]; // LEGACY: will be replaced by generic itemHistory

  // Achievement window properties (optional on base Window)
  achievements?: unknown[]; // Will be properly typed when achievement system is implemented
}

// Narrowed types for specific window types using utility types
export type ApplicationWindow = Omit<
  WindowType,
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
    WindowType,
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
} & Pick<WindowType, "isMinimized" | "isMaximized" | "isResizing">;

export type BrowserWindow = Required<
  Pick<
    WindowType,
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
    | "itemHistory"
    | "currentHistoryIndex"
    | "currentItem"
    | "canGoBack"
    | "canGoForward"
  >
> & {
  nodeType: "browser";
} & Pick<
    WindowType,
    "isMinimized" | "isMaximized" | "isResizing" | "bookmarks"
  >;

export type TerminalWindow = Required<
  Pick<
    WindowType,
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
    | "itemHistory"
    | "currentHistoryIndex"
    | "currentItem"
    | "canGoBack"
    | "canGoForward"
  >
> & {
  nodeType: "terminal";
} & Pick<
    WindowType,
    "isMinimized" | "isMaximized" | "isResizing" | "terminalHistory"
  >;

export type AchievementWindow = Required<
  Pick<
    WindowType,
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
} & Pick<
    WindowType,
    "isMinimized" | "isMaximized" | "isResizing" | "achievements"
  >;

// Legacy DirectoryWindow interface (can be removed once everything uses the new types)
export interface DirectoryWindowLegacy extends WindowType {
  nodeType: "directory";
  nodeId: DirectoryEntry["id"];
  currentPath: string;
  canGoBack: boolean;
  canGoForward: boolean;
  navigationHistory: string[];
  currentHistoryIndex: number;
}

// Base store state interface that slices can reference
export interface BaseStoreState {
  nodeMap: NodeMap;
  rootId: string;
  selectedNodeId: string | null;
  selectedNodeIds: string[];
  openWindows: WindowType[];
  nextZIndex: number;
  operatingSystem: OperatingSystem;
  wifiEnabled: boolean;
}

export type SetState<T> = (
  partial: Partial<T> | ((state: T) => Partial<T>)
) => void;
export type GetState<T> = () => T;
