import type { NodeMap } from "./nodeTypes";
import type { OperatingSystem } from "../store/systemSlice";

// Window interface for the new window system
export interface Window {
  id: string;
  nodeId: string;
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
  // navigationHistory: string[];
  // currentHistoryIndex: number;
}

// Forward declare WindowData to avoid circular imports (legacy - for old windowSlice)
export interface WindowData {
  id: string;
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

export interface StoreStateNew {
  operatingSystem: OperatingSystem;
  nodeMap: NodeMap;
  rootId: string;
  selectedNodeId: string | null;
  selectedNodeIds: string[];
  windows: Window[];
}

export type SetState<T> = (
  partial: Partial<T> | ((state: T) => Partial<T>)
) => void;
export type GetState<T> = () => T;

// Store interface that includes CRUD operations for slices to reference
