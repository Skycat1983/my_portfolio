import {
  defaultNodeMap,
  defaultRootId,
  mobileNodeMap,
  desktopRootId,
  dockRootId,
  mobileRootId,
  mobileDockRootId,
  type RootDirectoryId,
} from "@/constants/nodeHierarchy";
import type { NodeEntry, NodeMap } from "@/components/nodes/nodeTypes";
import type { ApplicationState, SetState, GetState } from "@/types/storeTypes";

export type DeviceContext = "desktop" | "mobile";

interface NodeState {
  // Dual context node maps
  desktopNodeMap: NodeMap;
  mobileNodeMap: NodeMap;

  // Legacy fields for backwards compatibility
  nodeMap: NodeMap;
  rootId: string;
}

interface NodeActions {
  // Context management
  getCurrentNodeMap: () => NodeMap;
  getCurrentRootId: (area: "main" | "dock") => RootDirectoryId;
  updateLegacyFields: () => void;

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

  // Utility operations
  isUniqueNodePropertyValue: (
    baseValue: string,
    propertyKey: keyof NodeEntry,
    options?: {
      predicate?: (node: NodeEntry) => boolean;
    }
  ) => boolean;
  generateUniqueNodePropertyValue: (
    baseValue: string,
    propertyKey: keyof NodeEntry,
    options?: {
      predicate?: (node: NodeEntry) => boolean;
      separator?: "parentheses" | "underscore";
    }
  ) => string;
}

export type NodeCrudSlice = NodeState & NodeActions;

export const createNodeCrudSlice = (
  set: SetState<ApplicationState>,
  get: GetState<ApplicationState>
): NodeCrudSlice => {
  const slice: NodeCrudSlice = {
    // Dual context node maps
    desktopNodeMap: defaultNodeMap,
    mobileNodeMap: mobileNodeMap,

    // Legacy fields for backwards compatibility
    nodeMap: defaultNodeMap,
    rootId: defaultRootId,

    // Context management
    getCurrentNodeMap: () => {
      const state = get();
      return state.screenDimensions.isMobile
        ? state.mobileNodeMap
        : state.desktopNodeMap;
    },

    getCurrentRootId: (area: "main" | "dock") => {
      const state = get();
      const isMobile = state.screenDimensions.isMobile;

      if (isMobile) {
        return area === "main" ? mobileRootId : mobileDockRootId;
      } else {
        return area === "main" ? desktopRootId : dockRootId;
      }
    },

    updateLegacyFields: () => {
      const state = get();
      const isMobile = state.screenDimensions.isMobile;
      const currentNodeMap = isMobile
        ? state.mobileNodeMap
        : state.desktopNodeMap;
      const currentRootId = isMobile ? mobileRootId : defaultRootId;

      set({
        nodeMap: currentNodeMap,
        rootId: currentRootId,
      });
    },

    // Find operations
    findOneNode: (predicate: (node: NodeEntry) => boolean) => {
      const currentNodeMap = slice.getCurrentNodeMap();
      return Object.values(currentNodeMap).find(predicate);
    },

    findManyNodes: (predicate: (node: NodeEntry) => boolean) => {
      const currentNodeMap = slice.getCurrentNodeMap();
      return Object.values(currentNodeMap).filter(predicate);
    },

    // Create operations (pure - no business logic)
    createOneNode: (node: NodeEntry): boolean => {
      // console.log("createOneNode in nodeCrudSlice: creating node", node.id);
      console.log(
        "DocumentEditor: createOneNode in nodeCrudSlice: creating node",
        node
      );

      const currentState = get();

      // Check if node already exists in the correct nodeMap
      const currentNodeMap = slice.getCurrentNodeMap();
      if (currentNodeMap[node.id]) {
        console.log("createOneNode: node already exists", node.id);
        return false;
      }

      // 🚨 FIX: Update the correct nodeMap based on device context
      const isMobile = currentState.screenDimensions.isMobile;

      if (isMobile) {
        set((state) => ({
          mobileNodeMap: {
            ...state.mobileNodeMap,
            [node.id]: node,
          },
          // Also update legacy field for backwards compatibility
          nodeMap: {
            ...state.nodeMap,
            [node.id]: node,
          },
        }));
      } else {
        set((state) => ({
          desktopNodeMap: {
            ...state.desktopNodeMap,
            [node.id]: node,
          },
          // Also update legacy field for backwards compatibility
          nodeMap: {
            ...state.nodeMap,
            [node.id]: node,
          },
        }));
      }

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
      // console.log(
      //   "MOVENODEDEBUG: moveNodeByID updateOneNode in nodeCrudSlice",
      //   predicate,
      //   updates
      // );

      const currentState = get();

      // 🚨 FIX: Use the same nodeMap for both read and write
      const currentNodeMap = slice.getCurrentNodeMap();
      const nodeToUpdate = Object.values(currentNodeMap).find(predicate);

      // console.log(
      //   "MOVENODEDEBUG: moveNodeByID updateOneNode: nodeToUpdate",
      //   nodeToUpdate
      // );
      if (!nodeToUpdate) {
        console.log("updateOneNodeByPredicate: no node matches predicate");
        return false;
      }

      // 🚨 FIX: Update the correct nodeMap based on device context
      const isMobile = currentState.screenDimensions.isMobile;
      const updatedNode = {
        ...nodeToUpdate,
        ...updates,
        id: nodeToUpdate.id, // Prevent ID from being changed
      } as NodeEntry;

      if (isMobile) {
        set((state) => ({
          mobileNodeMap: {
            ...state.mobileNodeMap,
            [nodeToUpdate.id]: updatedNode,
          },
          // Also update legacy field for backwards compatibility
          nodeMap: {
            ...state.nodeMap,
            [nodeToUpdate.id]: updatedNode,
          },
        }));
      } else {
        set((state) => ({
          desktopNodeMap: {
            ...state.desktopNodeMap,
            [nodeToUpdate.id]: updatedNode,
          },
          // Also update legacy field for backwards compatibility
          nodeMap: {
            ...state.nodeMap,
            [nodeToUpdate.id]: updatedNode,
          },
        }));
      }

      return true;
    },

    updateManyNodes: (
      predicate: (node: NodeEntry) => boolean,
      updates: Partial<NodeEntry>
    ): number => {
      console.log("updateManyNodes in nodeCrudSlice");

      const currentState = get();
      const nodesToUpdate = Object.values(currentState.nodeMap).filter(
        predicate
      );

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
      const currentNodeMap = slice.getCurrentNodeMap();
      const nodeToDelete = Object.values(currentNodeMap).find(predicate);

      if (nodeToDelete?.protected) {
        console.log("deleteOneNode: node is protected");
        return false;
      }

      if (!nodeToDelete) {
        console.log("deleteOneNodeByPredicate: no node matches predicate");
        return false;
      }

      // 🚨 FIX: Delete from the correct nodeMap based on device context
      const isMobile = currentState.screenDimensions.isMobile;

      if (isMobile) {
        set((state) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [nodeToDelete.id]: _, ...remainingMobileNodes } =
            state.mobileNodeMap;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [nodeToDelete.id]: __, ...remainingLegacyNodes } =
            state.nodeMap;

          return {
            mobileNodeMap: remainingMobileNodes,
            nodeMap: remainingLegacyNodes, // Also update legacy field
            // Clear selection if the deleted node was selected
            selectedNodeId:
              state.selectedNodeId === nodeToDelete.id
                ? null
                : state.selectedNodeId,
          };
        });
      } else {
        set((state) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [nodeToDelete.id]: _, ...remainingDesktopNodes } =
            state.desktopNodeMap;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [nodeToDelete.id]: __, ...remainingLegacyNodes } =
            state.nodeMap;

          return {
            desktopNodeMap: remainingDesktopNodes,
            nodeMap: remainingLegacyNodes, // Also update legacy field
            // Clear selection if the deleted node was selected
            selectedNodeId:
              state.selectedNodeId === nodeToDelete.id
                ? null
                : state.selectedNodeId,
          };
        });
      }

      return true;
    },

    deleteManyNodes: (predicate: (node: NodeEntry) => boolean): number => {
      console.log("deleteManyNodes in nodeCrudSlice");

      const currentNodeMap = slice.getCurrentNodeMap();

      const nodesToDelete = Object.values(currentNodeMap).filter(predicate);

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

    // Utility operations
    generateUniqueNodePropertyValue: (
      baseValue: string,
      propertyKey: keyof NodeEntry,
      options?: {
        predicate?: (node: NodeEntry) => boolean;
        separator?: "parentheses" | "underscore";
      }
    ) => {
      console.log(
        "generateUniquePropertyValue: checking for unique value",
        baseValue,
        "for property",
        propertyKey
      );

      // const state = get();
      const { predicate, separator = "underscore" } = options || {};

      const currentNodeMap = slice.getCurrentNodeMap();
      // Filter nodes based on predicate (default to all nodes)
      const nodesToCheck = predicate
        ? Object.values(currentNodeMap).filter(predicate)
        : Object.values(currentNodeMap);

      // Check if base value is available
      const baseValueExists = nodesToCheck.some(
        (node) => node[propertyKey] === baseValue
      );

      if (!baseValueExists) {
        console.log(
          "generateUniquePropertyValue: base value is unique",
          baseValue
        );
        return baseValue;
      }

      // Find existing numbered variations
      const usedNumbers = new Set<number>();
      const escapedBaseValue = baseValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const patterns = {
        parentheses: new RegExp(`^${escapedBaseValue} \\((\\d+)\\)$`),
        underscore: new RegExp(`^${escapedBaseValue}_(\\d+)$`),
      };

      const pattern = patterns[separator];

      nodesToCheck.forEach((node) => {
        const value = node[propertyKey] as string;
        const match = value?.match?.(pattern);
        if (match) {
          usedNumbers.add(parseInt(match[1], 10));
        }
      });

      // Find the lowest available number starting from 1
      let counter = 1;
      while (usedNumbers.has(counter)) {
        counter++;
      }

      const uniqueValue =
        separator === "parentheses"
          ? `${baseValue} (${counter})`
          : `${baseValue}_${counter}`;

      console.log(
        "generateUniquePropertyValue: generated unique value",
        uniqueValue
      );
      return uniqueValue;
    },

    isUniqueNodePropertyValue: (
      baseValue: string,
      propertyKey: keyof NodeEntry,
      options?: {
        predicate?: (node: NodeEntry) => boolean;
      }
    ) => {
      // const state = get();
      const { predicate } = options || {};

      const currentNodeMap = slice.getCurrentNodeMap();

      const nodesToCheck = predicate
        ? Object.values(currentNodeMap).filter(predicate)
        : Object.values(currentNodeMap);

      const isUnique = !nodesToCheck.some(
        (node) => node[propertyKey] === baseValue
      );

      console.log(
        "DocumentEditorDebug isUniqueNodePropertyValue: isUnique",
        isUnique
      );

      const matches = nodesToCheck.filter(
        (node) => node[propertyKey] === baseValue
      );

      console.log(
        "DocumentEditorDebug isUniqueNodePropertyValue: matches",
        matches,
        "DocumentEditorDebug isUniqueNodePropertyValue: matches length",
        matches.length
      );
      return isUnique;
    },
  };

  return slice;
};
