import type { NodeMap } from "./nodeTypes";

// Forward declare WindowData to avoid circular imports
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
  openWindows: WindowData[];
  nextZIndex: number;
  isTerminalOpen: boolean;
}

// Properly typed store functions
export type SetState<T> = (
  partial: Partial<T> | ((state: T) => Partial<T>)
) => void;
export type GetState<T> = () => T;
