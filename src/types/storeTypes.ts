import type {
  ApplicationEntry,
  DirectoryEntry,
  NodeEntry,
  NodeMap,
} from "./nodeTypes";
import type {
  OperatingSystem,
  ScreenDimensions,
} from "../store/systemState/systemSlice";
import type { WINDOW_COMPONENT_REGISTRY } from "@/components/window/WindowComponentRegistry";

// Interface for props that window content components receive
// Note: This is now flexible - components can define their own prop interfaces
export interface WindowContentProps {
  windowId: string;
  nodeId: string;
  window?: WindowType; // Optional for backward compatibility
}

// Full Window interface with ALL possible properties across all window types
export interface WindowType {
  //! Core window properties
  windowId: ApplicationEntry["id"];
  title: string;
  nodeId: NodeEntry["id"];
  applicationId?: string; // Application identity for focus/duplicate logic (optional for non-application windows)
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

  // Finder-specific preview state (for column navigation)

  // Flexible component rendering (new approach)
  componentKey: keyof typeof WINDOW_COMPONENT_REGISTRY; // Optional component key for registry lookup

  // Document-specific properties (for document persistence)
  documentConfig?: DocumentConfig; // Optional document configuration for saved documents
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
    // | "currentItem"
    // | "canGoBack"
    // | "canGoForward"
  >
> & {
  nodeType: "browser";
} & Pick<WindowType, "isMinimized" | "isMaximized" | "isResizing">;

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
    // | "currentItem"
    // | "canGoBack"
    // | "canGoForward"
  >
> & {
  nodeType: "terminal";
} & Pick<WindowType, "isMinimized" | "isMaximized" | "isResizing">;

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
} & Pick<WindowType, "isMinimized" | "isMaximized" | "isResizing">;

// Document Registry Types for persistent document storage
export type TextAlignment = "left" | "center" | "right";

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
  isUnderlined: boolean;
  color: string;
  textAlign: TextAlignment;
}

export interface DocumentConfig {
  id: string; // Unique config identifier
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

export interface DocumentRegistryState {
  configs: Map<string, DocumentConfig>;
}

// Base store state interface that slices can reference
export interface BaseStoreState {
  theme: "light" | "dark";
  nodeMap: NodeMap;
  rootId: string;
  selectedNodeId: string | null;
  selectedNodeIds: string[];
  openWindows: WindowType[];
  nextZIndex: number;
  operatingSystem: OperatingSystem;
  wifiEnabled: boolean;
  screenDimensions: ScreenDimensions;
}

export type SetState<T> = (
  partial: Partial<T> | ((state: T) => Partial<T>)
) => void;
export type GetState<T> = () => T;
