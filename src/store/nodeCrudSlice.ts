import { defaultNodeMap, defaultRootId } from "../constants/nodes";
import type { NodeEntry, NodeMap, DirectoryEntry } from "../types/nodeTypes";
import type { BaseStoreState, SetState, GetState } from "../types/storeTypes";

interface NodeState {
  nodeMap: NodeMap;
  rootId: string;
}

interface NodeActions {
  // find operations
  findOneNode: (
    predicate: (node: NodeEntry) => boolean
  ) => NodeEntry | undefined;
  findManyNodes: (predicate: (node: NodeEntry) => boolean) => NodeEntry[];
  // update operations
  updateOneNode: (nodeId: NodeEntry["id"], updates: Partial<NodeEntry>) => void;
  updateManyNodes: (
    predicate: (node: NodeEntry) => boolean,
    updates: Partial<NodeEntry>
  ) => void;
  // delete operations
  deleteOneNode: (nodeId: NodeEntry["id"]) => void;
  deleteManyNodes: (predicate: (node: NodeEntry) => boolean) => void;

  // create operations
  createOneNode: (
    nodeData: Omit<NodeEntry, "parentId">,
    parentId: NodeEntry["id"]
  ) => void;
  createManyNodes: (
    nodeData: Omit<NodeEntry, "parentId">[],
    parentId: NodeEntry["id"]
  ) => void;
  // query operations
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

  // Create operations
  createOneNode: (
    nodeData: Omit<NodeEntry, "parentId">,
    parentId: DirectoryEntry["id"]
  ) => {
    console.log(
      "createOneNode in newNodeSlice: creating node",
      nodeData.id,
      "in parent",
      parentId
    );

    const currentState = get();
    const parent = currentState.nodeMap[parentId];

    if (!parent || parent.type !== "directory") {
      console.log(
        "createOneNode in newNodeSlice: parent not found or not a directory"
      );
      return;
    }

    // Check if node with this ID already exists
    if (currentState.nodeMap[nodeData.id]) {
      console.log(
        "createOneNode in newNodeSlice: node with ID",
        nodeData.id,
        "already exists"
      );
      return;
    }

    const newNode = {
      ...nodeData,
      parentId,
    } as NodeEntry;

    set((state) => ({
      nodeMap: {
        ...state.nodeMap,
        [nodeData.id]: newNode,
        [parentId]: {
          ...parent,
          children: [...(parent as DirectoryEntry).children, nodeData.id],
        },
      },
    }));
  },

  createManyNodes: (
    nodeDataArray: Omit<NodeEntry, "parentId">[],
    parentId: DirectoryEntry["id"]
  ) => {
    console.log(
      "createManyNodes in newNodeSlice: creating",
      nodeDataArray.length,
      "nodes in parent",
      parentId
    );

    const currentState = get();
    const parent = currentState.nodeMap[parentId];

    if (!parent || parent.type !== "directory") {
      console.log(
        "createManyNodes in newNodeSlice: parent not found or not a directory"
      );
      return;
    }

    // Filter out nodes that already exist
    const validNodeData = nodeDataArray.filter((nodeData) => {
      if (currentState.nodeMap[nodeData.id]) {
        console.log(
          "createManyNodes in newNodeSlice: skipping existing node",
          nodeData.id
        );
        return false;
      }
      return true;
    });

    if (validNodeData.length === 0) {
      console.log("createManyNodes in newNodeSlice: no valid nodes to create");
      return;
    }

    const newNodes: Record<string, NodeEntry> = {};
    const newNodeIds: string[] = [];

    validNodeData.forEach((nodeData) => {
      const newNode = {
        ...nodeData,
        parentId,
      } as NodeEntry;
      newNodes[nodeData.id] = newNode;
      newNodeIds.push(nodeData.id);
    });

    set((state) => ({
      nodeMap: {
        ...state.nodeMap,
        ...newNodes,
        [parentId]: {
          ...parent,
          children: [...(parent as DirectoryEntry).children, ...newNodeIds],
        },
      },
    }));
  },

  // Update operations
  updateOneNode: (nodeId: NodeEntry["id"], updates: Partial<NodeEntry>) => {
    console.log(
      "updateOneNode in newNodeSlice: updating node",
      nodeId,
      "with",
      updates
    );

    const currentState = get();
    const existingNode = currentState.nodeMap[nodeId];

    if (!existingNode) {
      console.log("updateOneNode in newNodeSlice: node not found", nodeId);
      return;
    }

    set((state) => ({
      nodeMap: {
        ...state.nodeMap,
        [nodeId]: {
          ...existingNode,
          ...updates,
          id: nodeId, // Prevent ID from being changed
        } as NodeEntry,
      },
    }));
  },

  updateManyNodes: (
    predicate: (node: NodeEntry) => boolean,
    updates: Partial<NodeEntry>
  ) => {
    console.log(
      "updateManyNodes in newNodeSlice: updating nodes with predicate",
      updates
    );

    const currentState = get();
    const nodesToUpdate = Object.values(currentState.nodeMap).filter(predicate);

    if (nodesToUpdate.length === 0) {
      console.log("updateManyNodes in newNodeSlice: no nodes match predicate");
      return;
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
  },

  // Delete operations
  deleteOneNode: (nodeId: NodeEntry["id"]) => {
    console.log("deleteOneNode in newNodeSlice: deleting node", nodeId);

    const currentState = get();
    const node = currentState.nodeMap[nodeId];

    if (!node) {
      console.log("deleteOneNode in newNodeSlice: node not found", nodeId);
      return;
    }

    // Remove from parent's children array
    const parentNode = node.parentId
      ? currentState.nodeMap[node.parentId]
      : null;

    set((state) => {
      // Create new nodeMap without the deleted node
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [nodeId]: _, ...remainingNodes } = state.nodeMap;

      return {
        nodeMap: {
          ...remainingNodes,
          // Remove from parent's children array if parent exists and is a directory
          ...(parentNode &&
            parentNode.type === "directory" && {
              [parentNode.id]: {
                ...parentNode,
                children: parentNode.children.filter(
                  (childId: string) => childId !== nodeId
                ),
              },
            }),
        },
        // Clear selection if the deleted node was selected
        selectedNodeId:
          state.selectedNodeId === nodeId ? null : state.selectedNodeId,
      };
    });
  },

  deleteManyNodes: (predicate: (node: NodeEntry) => boolean) => {
    console.log(
      "deleteManyNodes in newNodeSlice: deleting nodes with predicate"
    );

    const currentState = get();
    const nodesToDelete = Object.values(currentState.nodeMap).filter(predicate);

    if (nodesToDelete.length === 0) {
      console.log("deleteManyNodes in newNodeSlice: no nodes match predicate");
      return;
    }

    console.log(
      "deleteManyNodes in newNodeSlice: deleting",
      nodesToDelete.length,
      "nodes"
    );

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

        // Remove from parent's children array
        const parentNode = node.parentId ? newNodeMap[node.parentId] : null;
        if (parentNode && parentNode.type === "directory") {
          newNodeMap[parentNode.id] = {
            ...parentNode,
            children: parentNode.children.filter(
              (childId: string) => childId !== node.id
            ),
          };
        }
      });

      return {
        nodeMap: newNodeMap,
        selectedNodeId: newSelectedNodeId,
      };
    });
  },

  // Query operations
  countNodes: (predicate: (node: NodeEntry) => boolean) => {
    const state = get();
    return Object.values(state.nodeMap).filter(predicate).length;
  },

  nodeExists: (predicate: (node: NodeEntry) => boolean) => {
    const state = get();
    return Object.values(state.nodeMap).some(predicate);
  },
});
