import { create } from "zustand";
import { defaultNodeMap, defaultRootId } from "../constants/nodes";
import type { NodeEntry, NodeMap } from "../types/nodeTypes";
import {
  createEasterEggSlice,
  type EasterEggSlice,
} from "../store/easterEggSlice";

// Core store state interface
interface CoreStoreState {
  nodeMap: NodeMap;
  rootId: string;
  selectedNodeId: string | null;
}

// Actions for core store functionality
interface CoreStoreActions {
  getNode: (id: string) => NodeEntry | undefined;
  getChildren: (parentId: string) => NodeEntry[];
  getParent: (nodeId: string) => NodeEntry | undefined;
  isDirectChildOfRoot: (nodeId: string) => boolean;
  selectNode: (nodeId: string) => void;
}

// Combined store interface
export interface NewDesktopStore
  extends CoreStoreState,
    CoreStoreActions,
    EasterEggSlice {}

// Properly typed set/get functions for slices
export type SetState = (
  partial:
    | Partial<NewDesktopStore>
    | ((state: NewDesktopStore) => Partial<NewDesktopStore>)
) => void;
export type GetState = () => NewDesktopStore;

export const useNewStore = create<NewDesktopStore>((set, get) => ({
  // Core state
  nodeMap: defaultNodeMap,
  rootId: defaultRootId,
  selectedNodeId: null,

  // Core actions
  getNode: (id: string) => {
    const state = get();
    return state.nodeMap[id];
  },

  getChildren: (parentId: string) => {
    const state = get();
    const parent = state.nodeMap[parentId];
    if (!parent) return [];

    if (parent.type === "directory") {
      return parent.children
        .map((childId: string) => state.nodeMap[childId])
        .filter(Boolean);
    }

    return [];
  },

  getParent: (nodeId: string) => {
    const state = get();
    const node = state.nodeMap[nodeId];
    if (!node || !node.parentId) return undefined;
    return state.nodeMap[node.parentId];
  },

  isDirectChildOfRoot: (nodeId: string) => {
    const state = get();
    const node = state.nodeMap[nodeId];
    return node?.parentId === state.rootId;
  },

  selectNode: (nodeId: string) => {
    console.log("selectNode in useNewStore: selecting node", nodeId);
    set({ selectedNodeId: nodeId });
  },

  // Easter egg slice integration
  ...createEasterEggSlice(set, get),
}));
