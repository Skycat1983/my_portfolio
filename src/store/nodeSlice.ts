import { defaultNodeMap, defaultRootId } from "../constants/nodes";
import type { NodeEntry, NodeMap } from "../types/nodeTypes";
import type { BaseStoreState, SetState, GetState } from "../types/storeTypes";

interface NodeState {
  nodeMap: NodeMap;
  rootId: string;
}

interface NodeActions {
  getNode: (id: string) => NodeEntry | undefined;
  getChildren: (parentId: string) => NodeEntry[];
  getParent: (nodeId: string) => NodeEntry | undefined;
  isDirectChildOfRoot: (nodeId: string) => boolean;
}

export type NodeSlice = NodeState & NodeActions;

export const createNodeSlice = (
  set: SetState<BaseStoreState>,
  get: GetState<BaseStoreState>
): NodeSlice => ({
  // Core node data
  nodeMap: defaultNodeMap,
  rootId: defaultRootId,

  // Node accessor methods
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
});
