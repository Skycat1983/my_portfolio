import type { NodeEntry, DirectoryEntry } from "@/components/nodes/nodeTypes";
import type { SetState, GetState } from "@/types/storeTypes";
import type { NodeCrudSlice } from "./nodeCrudSlice";
import type { DocumentRegistrySlice } from "../contentState/documentRegistrySlice";

export interface NodeOperationsActions {
  // ID-based accessors (built from predicates)
  getNodeByID: (id: NodeEntry["id"]) => NodeEntry | undefined;
  getChildrenByParentID: (parentId: DirectoryEntry["id"]) => NodeEntry[];
  getParentByChildID: (nodeId: NodeEntry["id"]) => NodeEntry | undefined;

  // ID-based operations (built from predicates)
  updateNodeByID: (
    nodeId: NodeEntry["id"],
    updates: Partial<NodeEntry>
  ) => boolean;
  deleteNodeByID: (nodeId: NodeEntry["id"]) => boolean;

  // Directory-specific operations
  getDirectoryByID: (id: NodeEntry["id"]) => DirectoryEntry | undefined;
  updateDirectoryByID: (
    directoryId: DirectoryEntry["id"],
    updates: Partial<DirectoryEntry>
  ) => boolean;

  // Utility operations
  isDirectChildOfRoot: (nodeId: NodeEntry["id"]) => boolean;
  isNodeDescendantOfAncestor: (
    ancestorId: NodeEntry["id"],
    descendantId: NodeEntry["id"]
  ) => boolean;
  isNodeInTrash: (nodeId: NodeEntry["id"]) => boolean;
  generateUniqueLabel: (baseLabel: string, parentId: string) => string;
}

export type NodeOperationsSlice = NodeOperationsActions;

// export interface NodeOperationsSlice = extends BaseStoreState, NodeCrudSlice {}

// Node operations slice - builds ID-based operations from predicate-based CRUD
export const createNodeOperationsSlice = (
  _set: SetState<NodeCrudSlice & DocumentRegistrySlice>,
  get: GetState<NodeCrudSlice & DocumentRegistrySlice>
): NodeOperationsSlice => ({
  /**
   * Get a node by its ID (builds on findOneNode)
   */
  getNodeByID: (id: NodeEntry["id"]): NodeEntry | undefined => {
    return get().findOneNode((node: NodeEntry) => node.id === id);
  },

  /**
   * Get all children nodes for a given parent directory ID
   */
  getChildrenByParentID: (parentId: DirectoryEntry["id"]): NodeEntry[] => {
    return get().findManyNodes((node: NodeEntry) => node.parentId === parentId);
  },

  /**
   * Get the parent node of a given child ID
   */
  getParentByChildID: (nodeId: NodeEntry["id"]): NodeEntry | undefined => {
    const state = get();
    const node = state.findOneNode((n: NodeEntry) => n.id === nodeId);
    return node?.parentId
      ? state.findOneNode((n: NodeEntry) => n.id === node.parentId)
      : undefined;
  },

  /**
   * Update a node by its ID (builds on updateOneNodeByPredicate)
   */
  updateNodeByID: (
    nodeId: NodeEntry["id"],
    updates: Partial<NodeEntry>
  ): boolean => {
    console.log(
      "MOVENODEDEBUG: moveNodeByID: updateNodeByID: updating node:",
      nodeId,
      "with",
      updates
    );
    return get().updateOneNode(
      (node: NodeEntry) => node.id === nodeId,
      updates
    );
  },

  /**
   * Delete a node by its ID (builds on deleteOneNodeByPredicate)
   * Also handles cleanup of document registry entries for document nodes
   */
  deleteNodeByID: (nodeId: NodeEntry["id"]): boolean => {
    console.log("deleteNodeByID: deleting node", nodeId);

    const state = get();
    const node = state.findOneNode((n: NodeEntry) => n.id === nodeId);

    // Clean up document registry if this is a document node
    if (node?.type === "document") {
      const documentNode =
        node as import("@/components/nodes/nodeTypes").DocumentEntry;
      console.log(
        "deleteNodeByID: cleaning up document config",
        documentNode.documentConfigId
      );
      state.deleteDocumentConfig(documentNode.documentConfigId);
    }

    return state.deleteOneNode((node: NodeEntry) => node.id === nodeId);
  },

  /**
   * Get a directory entry by ID (type-safe)
   */
  getDirectoryByID: (id: NodeEntry["id"]): DirectoryEntry | undefined => {
    const node = get().findOneNode((n: NodeEntry) => n.id === id);
    return node?.type === "directory" ? (node as DirectoryEntry) : undefined;
  },

  /**
   * Update a directory by its ID with type safety
   */
  updateDirectoryByID: (
    directoryId: DirectoryEntry["id"],
    updates: Partial<DirectoryEntry>
  ): boolean => {
    console.log(
      "MOVENODEDEBUG: updateDirectoryByID: 3 updating directory",
      directoryId,
      "with",
      updates
    );
    return get().updateOneNode(
      (node: NodeEntry) => node.id === directoryId && node.type === "directory",
      updates
    );
  },

  /**
   * Check if a node is a direct child of the root
   */
  isDirectChildOfRoot: (nodeId: NodeEntry["id"]): boolean => {
    const state = get();
    const rootId = state.rootId;
    const node = state.findOneNode((n: NodeEntry) => n.id === nodeId);
    return !!(node && node.parentId === rootId);
  },

  /**
   * Check if one node is a descendant of a given ancestor
   */
  isNodeDescendantOfAncestor: (
    ancestorId: NodeEntry["id"],
    descendantId: NodeEntry["id"]
  ): boolean => {
    const state = get();

    const checkDescendant = (currentId: string): boolean => {
      const node = state.findOneNode((n: NodeEntry) => n.id === currentId);
      if (!node || !node.parentId) return false;
      if (node.parentId === ancestorId) return true;
      return checkDescendant(node.parentId);
    };

    return checkDescendant(descendantId);
  },

  /**
   * Check if a node is in the "trash" directory
   */
  isNodeInTrash: (nodeId: NodeEntry["id"]): boolean => {
    const node = get().findOneNode((n: NodeEntry) => n.id === nodeId);
    return node?.parentId === "trash";
  },

  /**
   * Generate a unique label for a node within a given parent directory
   * Handles duplicate names by appending (1), (2), etc.
   * Scalable for any parent directory and node type
   */
  generateUniqueLabel: (baseLabel: string, parentId: string): string => {
    console.log(
      "generateUniqueLabel: checking for duplicates of",
      baseLabel,
      "in",
      parentId
    );

    const state = get();

    // Find all nodes in the parent directory with labels that match our pattern
    const existingNodes = state.findManyNodes((node: NodeEntry) => {
      if (node.parentId !== parentId) return false;

      // Check for exact match or numbered variations
      if (node.label === baseLabel) return true;

      // Check for pattern like "baseLabel (1)", "baseLabel (2)", etc.
      const numberPattern = new RegExp(
        `^${baseLabel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\((\\d+)\\)$`
      );
      return numberPattern.test(node.label);
    });

    if (existingNodes.length === 0) {
      console.log("generateUniqueLabel: no duplicates found, using", baseLabel);
      return baseLabel;
    }

    // Extract numbers from existing duplicates
    const usedNumbers = new Set<number>();
    let hasExactMatch = false;

    existingNodes.forEach((node) => {
      if (node.label === baseLabel) {
        hasExactMatch = true;
      } else {
        const numberPattern = new RegExp(
          `^${baseLabel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\((\\d+)\\)$`
        );
        const match = node.label.match(numberPattern);
        if (match) {
          usedNumbers.add(parseInt(match[1], 10));
        }
      }
    });

    // If there's no exact match, we can use the base label
    if (!hasExactMatch) {
      console.log(
        "generateUniqueLabel: no exact match found, using",
        baseLabel
      );
      return baseLabel;
    }

    // Find the lowest available number starting from 1
    let counter = 1;
    while (usedNumbers.has(counter)) {
      counter++;
    }

    const uniqueLabel = `${baseLabel} (${counter})`;
    console.log("generateUniqueLabel: generated unique label", uniqueLabel);
    return uniqueLabel;
  },
});
