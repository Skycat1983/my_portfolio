import { defaultNodeMap, defaultRootId } from "../../constants/nodes";
import type { NodeEntry, NodeMap } from "../../types/nodeTypes";
import type {
  BaseStoreState,
  SetState,
  GetState,
} from "../../types/storeTypes";

interface NodeState {
  nodeMap: NodeMap;
  rootId: string;
}

interface NodeActions {
  // Find operations (predicate-based)
  findOneNode: (
    predicate: (node: NodeEntry) => boolean
  ) => NodeEntry | undefined;
  findManyNodes: (predicate: (node: NodeEntry) => boolean) => NodeEntry[];

  // Create operations (generic)
  createOneNode: (node: NodeEntry) => boolean;
  createManyNodes: (nodes: NodeEntry[]) => boolean;

  // Update operations (all predicate-based)
  updateOneNode: (
    predicate: (node: NodeEntry) => boolean,
    updates: Partial<NodeEntry>
  ) => boolean;
  updateManyNodes: (
    predicate: (node: NodeEntry) => boolean,
    updates: Partial<NodeEntry>
  ) => number;

  // Delete operations (all predicate-based)
  deleteOneNode: (predicate: (node: NodeEntry) => boolean) => boolean;
  deleteManyNodes: (predicate: (node: NodeEntry) => boolean) => number;

  // Query operations (remain here as they're fundamental)
  countNodes: (predicate: (node: NodeEntry) => boolean) => number;
  nodeExists: (predicate: (node: NodeEntry) => boolean) => boolean;
}

export type NodeCrudSlice = NodeState & NodeActions;

export const createNodeCrudSlice = (
  set: SetState<BaseStoreState>,
  get: GetState<BaseStoreState>
): NodeCrudSlice => ({
  // Core node data
  nodeMap: defaultNodeMap,
  rootId: defaultRootId,

  // Find operations
  findOneNode: (predicate: (node: NodeEntry) => boolean) => {
    const state = get();
    return Object.values(state.nodeMap).find(predicate);
  },

  findManyNodes: (predicate: (node: NodeEntry) => boolean) => {
    const state = get();
    return Object.values(state.nodeMap).filter(predicate);
  },

  // Create operations (pure - no business logic)
  createOneNode: (node: NodeEntry): boolean => {
    console.log("createOneNode in nodeCrudSlice: creating node", node.id);

    const currentState = get();

    // Check if node already exists
    if (currentState.nodeMap[node.id]) {
      console.log("createOneNode: node already exists", node.id);
      return false;
    }

    set((state) => ({
      nodeMap: {
        ...state.nodeMap,
        [node.id]: node,
      },
    }));

    return true;
  },

  createManyNodes: (nodes: NodeEntry[]): boolean => {
    console.log(
      "createManyNodes in nodeCrudSlice: creating",
      nodes.length,
      "nodes"
    );

    const currentState = get();

    // Filter out nodes that already exist
    const validNodes = nodes.filter((node) => {
      if (currentState.nodeMap[node.id]) {
        console.log("createManyNodes: skipping existing node", node.id);
        return false;
      }
      return true;
    });

    if (validNodes.length === 0) {
      console.log("createManyNodes: no valid nodes to create");
      return false;
    }

    const nodeMap: Record<string, NodeEntry> = {};
    validNodes.forEach((node) => {
      nodeMap[node.id] = node;
    });

    set((state) => ({
      nodeMap: {
        ...state.nodeMap,
        ...nodeMap,
      },
    }));

    return true;
  },

  // Update operations (all predicate-based)
  updateOneNode: (
    predicate: (node: NodeEntry) => boolean,
    updates: Partial<NodeEntry>
  ): boolean => {
    console.log("updateOneNodeByPredicate in nodeCrudSlice");

    const currentState = get();
    const nodeToUpdate = Object.values(currentState.nodeMap).find(predicate);

    if (!nodeToUpdate) {
      console.log("updateOneNodeByPredicate: no node matches predicate");
      return false;
    }

    set((state) => ({
      nodeMap: {
        ...state.nodeMap,
        [nodeToUpdate.id]: {
          ...nodeToUpdate,
          ...updates,
          id: nodeToUpdate.id, // Prevent ID from being changed
        } as NodeEntry,
      },
    }));

    return true;
  },

  updateManyNodes: (
    predicate: (node: NodeEntry) => boolean,
    updates: Partial<NodeEntry>
  ): number => {
    console.log("updateManyNodes in nodeCrudSlice");

    const currentState = get();
    const nodesToUpdate = Object.values(currentState.nodeMap).filter(predicate);

    if (nodesToUpdate.length === 0) {
      console.log("updateManyNodes: no nodes match predicate");
      return 0;
    }

    const updatedNodes: Record<string, NodeEntry> = {};
    nodesToUpdate.forEach((node) => {
      updatedNodes[node.id] = {
        ...node,
        ...updates,
        id: node.id, // Prevent ID from being changed
      } as NodeEntry;
    });

    set((state) => ({
      nodeMap: {
        ...state.nodeMap,
        ...updatedNodes,
      },
    }));

    return nodesToUpdate.length;
  },

  // Delete operations (all predicate-based)
  deleteOneNode: (predicate: (node: NodeEntry) => boolean): boolean => {
    console.log("deleteOneNode in nodeCrudSlice");

    const currentState = get();
    const nodeToDelete = Object.values(currentState.nodeMap).find(predicate);

    if (!nodeToDelete) {
      console.log("deleteOneNodeByPredicate: no node matches predicate");
      return false;
    }

    set((state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [nodeToDelete.id]: _, ...remainingNodes } = state.nodeMap;

      return {
        nodeMap: remainingNodes,
        // Clear selection if the deleted node was selected
        selectedNodeId:
          state.selectedNodeId === nodeToDelete.id
            ? null
            : state.selectedNodeId,
      };
    });

    return true;
  },

  deleteManyNodes: (predicate: (node: NodeEntry) => boolean): number => {
    console.log("deleteManyNodes in nodeCrudSlice");

    const currentState = get();
    const nodesToDelete = Object.values(currentState.nodeMap).filter(predicate);

    if (nodesToDelete.length === 0) {
      console.log("deleteManyNodes: no nodes match predicate");
      return 0;
    }

    console.log("deleteManyNodes: deleting", nodesToDelete.length, "nodes");

    set((state) => {
      let newNodeMap = { ...state.nodeMap };
      let newSelectedNodeId = state.selectedNodeId;

      // Remove all nodes that match predicate
      nodesToDelete.forEach((node) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [node.id]: _, ...remaining } = newNodeMap;
        newNodeMap = remaining;

        // Clear selection if deleted node was selected
        if (state.selectedNodeId === node.id) {
          newSelectedNodeId = null;
        }
      });

      return {
        nodeMap: newNodeMap,
        selectedNodeId: newSelectedNodeId,
      };
    });

    return nodesToDelete.length;
  },

  // Query operations (fundamental operations that belong in CRUD layer)
  countNodes: (predicate: (node: NodeEntry) => boolean): number => {
    const state = get();
    return Object.values(state.nodeMap).filter(predicate).length;
  },

  nodeExists: (predicate: (node: NodeEntry) => boolean): boolean => {
    const state = get();
    return Object.values(state.nodeMap).some(predicate);
  },
});
