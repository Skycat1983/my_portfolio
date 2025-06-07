import { create } from "zustand";
import {
  defaultNodeMap,
  defaultRootId,
  convertMapToObjects,
  type NodeMap,
  type MapNode,
} from "../constants/nodes";

// BASIC STORE INTERFACE
interface DesktopStore {
  // Core data
  nodeMap: NodeMap;
  rootId: string;

  // Selection state
  selectedNodeId: string | null;

  // Basic getters
  getNode: (id: string) => MapNode | undefined;
  getRootNode: () => MapNode | undefined;
  getChildren: (parentId: string) => MapNode[];

  // Selection actions
  selectNode: (nodeId: string) => void;
  clearSelection: () => void;

  // Debug helper
  debugGetObjectTree: () => void;
}

export const useStore = create<DesktopStore>((set, get) => ({
  // Initialize with our converted map data
  nodeMap: defaultNodeMap,
  rootId: defaultRootId,

  // Selection state
  selectedNodeId: null,

  // Basic node getter
  getNode: (id: string) => {
    const state = get();
    return state.nodeMap[id];
  },

  // Get root node
  getRootNode: () => {
    const state = get();
    return state.nodeMap[state.rootId];
  },

  // Get children of a parent node
  getChildren: (parentId: string) => {
    const state = get();
    const parent = state.nodeMap[parentId];
    if (!parent) return [];

    return parent.children
      .map((childId) => state.nodeMap[childId])
      .filter(Boolean); // Filter out any undefined nodes
  },

  // Selection actions
  selectNode: (nodeId: string) => {
    console.log("Store: selecting node", nodeId);
    set({ selectedNodeId: nodeId });
  },

  clearSelection: () => {
    console.log("Store: clearing selection");
    set({ selectedNodeId: null });
  },

  // Debug helper - converts current map back to object tree for visualization
  debugGetObjectTree: () => {
    const state = get();
    const objectTree = convertMapToObjects(state.nodeMap, state.rootId);
    console.log("🔍 DEBUG: Current state as object tree:", objectTree);
    return objectTree;
  },
}));
