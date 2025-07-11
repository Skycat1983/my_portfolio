import {
  EASTER_EGG1,
  EASTER_EGG2,
  FOLDER_MAC,
  FOLDER_WINDOWS,
} from "@/constants/images";
import type {
  NodeEntry,
  DirectoryEntry,
  EasterEggEntry,
} from "@/components/nodes/nodeTypes";
import type { SetState, GetState, ApplicationState } from "@/types/storeTypes";
import type { NodeCrudSlice } from "./nodeCrudSlice";
import type { NodeOperationsSlice } from "./nodeOperationsSlice";
import { desktopRootId } from "@/constants/nodeHierarchy";

interface NodeBusinessActions {
  // Complex node operations
  moveNodeByID: (
    nodeId: NodeEntry["id"],
    newParentId: DirectoryEntry["id"]
  ) => boolean;

  // Validation operations (for UI feedback)
  validateMoveByID: (
    nodeId: NodeEntry["id"],
    newParentId: DirectoryEntry["id"]
  ) => boolean;

  // Business logic operations
  isNodeInTrash: (nodeId: NodeEntry["id"]) => boolean;
  ensureDownloadsFolder: () => DirectoryEntry;
  downloadEgg: () => void;

  // Parent-child relationship management
  addChildToDirectory: (
    parentId: DirectoryEntry["id"],
    childId: NodeEntry["id"]
  ) => boolean;
  removeChildFromDirectory: (
    parentId: DirectoryEntry["id"],
    childId: NodeEntry["id"]
  ) => boolean;

  // New functions
  generateUniqueNodeId: (baseId: string) => string;
  createEgg: (parentId: string) => EasterEggEntry | null;
}

export type NodeBusinessSlice = NodeBusinessActions;

export interface StoreWithOperations
  extends ApplicationState,
    NodeCrudSlice,
    NodeOperationsSlice,
    NodeBusinessSlice {}

// Business logic slice - builds complex workflows from operations
export const createNodeBusinessSlice = (
  _set: SetState<StoreWithOperations>,
  get: GetState<StoreWithOperations>
): NodeBusinessSlice => ({
  /**
   * Move a node to a new parent directory (complex workflow)
   */
  moveNodeByID: (
    nodeId: NodeEntry["id"],
    newParentId: DirectoryEntry["id"]
  ): boolean => {
    console.log("moveNodeByID: moving node", nodeId, "to parent", newParentId);

    const state = get();

    // Get nodes using operations layer
    const node = state.getNodeByID(nodeId);
    const newParent = state.getDirectoryByID(newParentId);
    const oldParent = node?.parentId
      ? state.getDirectoryByID(node.parentId)
      : undefined;

    // Validation
    if (!node || !newParent) {
      console.warn("moveNodeByID: invalid node or parent");
      return false;
    }
    if (node.parentId === newParentId) {
      console.info("moveNodeByID: already in target parent");
      return false;
    }
    if (node.type === "directory") {
      if (nodeId === newParentId) {
        console.error("moveNodeByID: cannot move directory into itself");
        return false;
      }
      if (state.isNodeDescendantOfAncestor(nodeId, newParentId)) {
        console.error("moveNodeByID: circular move detected");
        return false;
      }
    }

    // Execute move using operations layer (atomic operations)
    // 1. Update the node's parentId
    const nodeUpdated = state.updateNodeByID(nodeId, { parentId: newParentId });
    if (!nodeUpdated) {
      console.error("moveNodeByID: failed to update node");
      return false;
    }

    // 2. Remove from old parent's children array
    if (oldParent) {
      const newChildren = oldParent.children.filter(
        (childId: string) => childId !== nodeId
      );
      const oldParentUpdated = state.updateDirectoryByID(oldParent.id, {
        children: newChildren,
      });
      if (!oldParentUpdated) {
        console.error("moveNodeByID: failed to update old parent");
        // Rollback node update
        state.updateNodeByID(nodeId, { parentId: node.parentId });
        return false;
      }
    }

    // 3. Add to new parent's children array
    const newChildren = [...newParent.children, nodeId];
    const newParentUpdated = state.updateDirectoryByID(newParentId, {
      children: newChildren,
    });
    if (!newParentUpdated) {
      console.error("moveNodeByID: failed to update new parent");
      // Rollback previous changes
      state.updateNodeByID(nodeId, { parentId: node.parentId });
      if (oldParent) {
        state.updateDirectoryByID(oldParent.id, {
          children: oldParent.children,
        });
      }
      return false;
    }

    console.log("moveNodeByID: move completed successfully");
    return true;
  },

  /**
   * Add a child to a directory's children array
   */
  addChildToDirectory: (
    parentId: DirectoryEntry["id"],
    childId: NodeEntry["id"]
  ): boolean => {
    console.log("addChildToDirectory: adding", childId, "to", parentId);

    const state = get();
    const parent = state.getDirectoryByID(parentId);

    if (!parent) {
      console.error("addChildToDirectory: parent directory not found");
      return false;
    }

    if (parent.children.includes(childId)) {
      console.info("addChildToDirectory: child already exists in parent");
      return true; // Already there, consider it success
    }

    const newChildren = [...parent.children, childId];
    return state.updateDirectoryByID(parentId, { children: newChildren });
  },

  /**
   * Remove a child from a directory's children array
   */
  removeChildFromDirectory: (
    parentId: DirectoryEntry["id"],
    childId: NodeEntry["id"]
  ): boolean => {
    console.log(
      "removeChildFromDirectory: removing",
      childId,
      "from",
      parentId
    );

    const state = get();
    const parent = state.getDirectoryByID(parentId);

    if (!parent) {
      console.error("removeChildFromDirectory: parent directory not found");
      return false;
    }

    if (!parent.children.includes(childId)) {
      console.info("removeChildFromDirectory: child not in parent");
      return true; // Already gone, consider it success
    }

    const newChildren = parent.children.filter((id: string) => id !== childId);
    return state.updateDirectoryByID(parentId, { children: newChildren });
  },

  /**
   * Ensure downloads folder exists (business logic)
   */
  ensureDownloadsFolder: (): DirectoryEntry => {
    console.log("ensureDownloadsFolder: checking for downloads folder");

    const state = get();

    // Check if downloads folder already exists
    const existingDownloads = state.findOneNode(
      (node: NodeEntry) =>
        node.label === "Downloads" && node.parentId === desktopRootId
    );

    if (existingDownloads) {
      console.log(
        "ensureDownloadsFolder: downloads folder already exists",
        existingDownloads.id
      );
      return existingDownloads as DirectoryEntry;
    }

    // Create downloads folder
    const downloadsId = "downloads";
    const downloadsFolder: DirectoryEntry = {
      id: downloadsId,
      children: [],
      type: "directory",
      label: "Downloads",
      parentId: desktopRootId,
      image: FOLDER_MAC,
      alternativeImage: FOLDER_WINDOWS,
      componentKey: "finder",
      macExtension: null,
      windowsExtension: null,
      dateModified: new Date().toISOString(),
      size: 0,
    };

    const created = state.createOneNode(downloadsFolder);
    if (created) {
      // Add to root's children - get root and update it directly
      const root = state.getDirectoryByID(desktopRootId);
      if (root) {
        const newRootChildren = [...root.children, downloadsId];
        const rootUpdated = state.updateDirectoryByID(desktopRootId, {
          children: newRootChildren,
        });
        if (rootUpdated) {
          console.log(
            "ensureDownloadsFolder: created downloads folder with ID",
            downloadsId
          );
          return downloadsFolder;
        } else {
          // Rollback creation
          state.deleteNodeByID(downloadsId);
          throw new Error("Failed to add downloads folder to root");
        }
      } else {
        // Rollback creation
        state.deleteNodeByID(downloadsId);
        throw new Error("Root directory not found");
      }
    } else {
      throw new Error("Failed to create downloads folder");
    }
  },

  isNodeInTrash: (nodeId: NodeEntry["id"]): boolean => {
    const state = get();
    const node = state.getNodeByID(nodeId);
    return node?.parentId === "trash";
  },

  /**
   * Generate a unique node ID based on a base ID
   */
  generateUniqueNodeId: (baseId: string): string => {
    console.log("generateUniqueNodeId: generating ID from base", baseId);
    const state = get();
    let counter = 1;
    let newId = baseId;

    while (state.nodeExists((node) => node.id === newId)) {
      newId = `${baseId}_${counter}`;
      counter++;
    }

    console.log("generateUniqueNodeId: generated unique ID", newId);
    return newId;
  },

  /**
   * Create a new easter egg node
   */
  createEgg: (parentId: string): EasterEggEntry | null => {
    console.log("createEgg: creating new egg in parent", parentId);
    const state = get();
    const newId = state.generateUniqueNodeId("egg");

    const newEgg: EasterEggEntry = {
      id: newId,
      parentId,
      type: "easter-egg",
      label: "EE",
      image: EASTER_EGG1,
      alternativeImage: EASTER_EGG2,
      isBroken: false,
      macExtension: ".egg",
      windowsExtension: ".egg",
      dateModified: new Date().toISOString(),
      size: 42000,
    };

    const created = state.createOneNode(newEgg);
    if (!created) {
      console.error("createEgg: failed to create egg");
      return null;
    }

    console.log("createEgg: created egg with ID", newId);
    return newEgg;
  },

  /**
   * Download an egg to the downloads folder
   */
  downloadEgg: (): void => {
    console.log("downloadEgg: starting egg download process");
    const state = get();

    // Ensure downloads folder exists
    const downloadsFolder = state.ensureDownloadsFolder();
    if (!downloadsFolder) {
      console.error("downloadEgg: failed to ensure downloads folder");
      return;
    }

    // Create new egg
    const newEgg = state.createEgg(downloadsFolder.id);
    if (!newEgg) {
      console.error("downloadEgg: failed to create egg");
      return;
    }

    // Update downloads folder children
    const updated = state.updateDirectoryByID(downloadsFolder.id, {
      children: [...downloadsFolder.children, newEgg.id],
    });

    if (!updated) {
      console.error("downloadEgg: failed to update downloads folder");
      // Rollback egg creation
      state.deleteNodeByID(newEgg.id);
      return;
    }

    console.log("downloadEgg: successfully downloaded egg", newEgg.id);
  },

  /**
   * Validate move operation (for UI feedback)
   */
  validateMoveByID: (
    nodeId: NodeEntry["id"],
    newParentId: DirectoryEntry["id"]
  ): boolean => {
    console.log(
      "validateMoveByID: validating move from",
      nodeId,
      "to",
      newParentId
    );

    const state = get();

    // Get nodes using operations layer
    const node = state.getNodeByID(nodeId);
    const newParent = state.getDirectoryByID(newParentId);

    // Validation
    if (!node || !newParent) {
      console.warn("validateMoveByID: invalid node or parent");
      return false;
    }
    if (node.parentId === newParentId) {
      console.info("validateMoveByID: already in target parent");
      return false;
    }
    if (node.type === "directory") {
      if (nodeId === newParentId) {
        console.error("validateMoveByID: cannot move directory into itself");
        return false;
      }
      if (state.isNodeDescendantOfAncestor(nodeId, newParentId)) {
        console.error("validateMoveByID: circular move detected");
        return false;
      }
    }

    console.log("validateMoveByID: move operation is valid");
    return true;
  },
});
