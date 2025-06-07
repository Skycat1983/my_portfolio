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

  // Basic getters
  getNode: (id: string) => MapNode | undefined;
  getRootNode: () => MapNode | undefined;
  getChildren: (parentId: string) => MapNode[];

  // Debug helper
  debugGetObjectTree: () => void;
}

export const useStore = create<DesktopStore>((set, get) => ({
  // Initialize with our converted map data
  nodeMap: defaultNodeMap,
  rootId: defaultRootId,

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

  // Debug helper - converts current map back to object tree for visualization
  debugGetObjectTree: () => {
    const state = get();
    const objectTree = convertMapToObjects(state.nodeMap, state.rootId);
    console.log("🔍 DEBUG: Current state as object tree:", objectTree);
    return objectTree;
  },
}));
