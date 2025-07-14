import type {
  ApplicationEntry,
  DirectoryEntry,
  NodeEntry,
  NodeMap,
} from "../components/nodes/nodeTypes";
import type {
  OperatingSystem,
  ScreenDimensions,
  TimeFormat,
} from "../store/systemState/systemSlice";
import type { WhatsAppState } from "@/store/contentState/whatsAppSlice";
import type { HistoryInstance } from "@/store/contentState/historySlice";
import type { WeatherSlice } from "@/store/systemState/weatherSlice";
import type { Window } from "@/components/window/windowTypes";
import type { DocumentConfig } from "@/constants/documentRegistry";
import type { DeviceContext } from "@/store/nodeState/nodeCrudSlice";

// ═══════════════════════════════════════════════════════════════════════════════
// LEGACY TYPES (Maintain for backward compatibility)
// ═══════════════════════════════════════════════════════════════════════════════

// Interface for props that window content components receive
// Note: This is now flexible - components can define their own prop interfaces
export interface WindowContentProps {
  windowId: Window["windowId"];
  nodeId: string;
  window?: Window; // Optional for backward compatibility
}
// TODO: Implement these types

// Full Window interface with ALL possible properties across all window types
export interface WindowType {
  //! Core window properties
  windowId: ApplicationEntry["id"];
  title: string;
  nodeId: NodeEntry["id"];
  applicationId: ApplicationEntry["applicationId"]; // Application identity for focus/duplicate logic (optional for non-application windows)
  nodeType: string;
  width: number;
  height: number;
  x: number; // Window position X coordinate
  y: number; // Window position Y coordinate
  zIndex: number;
  fixed: boolean;
  isMinimized?: boolean;
  isMaximized?: boolean;
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
} & Pick<WindowType, "isMinimized" | "isMaximized">;

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
  >
> & {
  nodeType: "browser";
} & Pick<WindowType, "isMinimized" | "isMaximized">;

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
  >
> & {
  nodeType: "terminal";
} & Pick<WindowType, "isMinimized" | "isMaximized">;

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
} & Pick<WindowType, "isMinimized" | "isMaximized">;

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

// === STATE TYPES ===

// Core system state
interface SystemState {
  theme: "light" | "dark";
  operatingSystem: OperatingSystem;
  wifiEnabled: boolean;
  screenDimensions: ScreenDimensions;
  timeFormat: TimeFormat;
  timezone: string;
  selectedCity: string;
  customWallpaper: string | null;
  weather: WeatherSlice;
  defaultFinderView: "icons" | "list" | "columns";
}

// Node management state
interface NodeState {
  nodeMap: NodeMap;
  desktopNodeMap: NodeMap;
  mobileNodeMap: NodeMap;
  currentContext: DeviceContext;
  rootId: string;
  selectedNodeId: string | null;
  selectedNodeIds: string[];
}

// Window management state
interface WindowState {
  nextZIndex: number;
  windows: Window[];
}

// Collection-based states
interface CollectionState {
  histories: Record<string, HistoryInstance>;
  documents: Map<string, DocumentConfig>;
}

// Feature-based states
interface FeatureState {
  whatsApp: WhatsAppState;
}

// Combined application state
export interface ApplicationState
  extends SystemState,
    NodeState,
    WindowState,
    CollectionState,
    FeatureState {}

// Type for state setters
export type SetState<T> = (
  partial: Partial<T> | ((state: T) => Partial<T>)
) => void;

export type GetState<T> = () => T;
