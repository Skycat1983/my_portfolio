import { EASTER_EGG1, EASTER_EGG2, EASTER_EGG3 } from "../../constants/images";
import type {
  NodeEntry,
  DirectoryEntry,
  EasterEggEntry,
} from "../../types/nodeTypes";
import type {
  SetState,
  GetState,
  BaseStoreState,
} from "../../types/storeTypes";
import type { NodeCrudSlice } from "./nodeCrudSlice";
import type { NodeOperationsSlice } from "./nodeOperationsSlice";

export interface NodeBusinessSlice {
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
  ensureDownloadsFolder: () => string;
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
}

export interface StoreWithOperations
  extends BaseStoreState,
    NodeCrudSlice,
    NodeOperationsSlice {}

// Business logic slice - builds complex workflows from operations
export const createNodeBusinessSlice = (
  set: SetState<StoreWithOperations>,
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
  ensureDownloadsFolder: (): string => {
    console.log("ensureDownloadsFolder: checking for downloads folder");

    const state = get();

    // Check if downloads folder already exists
    const existingDownloads = state.findOneNode(
      (node: NodeEntry) =>
        node.label === "Downloads" && node.parentId === state.rootId
    );

    if (existingDownloads) {
      console.log(
        "ensureDownloadsFolder: downloads folder already exists",
        existingDownloads.id
      );
      return existingDownloads.id;
    }

    // Create downloads folder
    const downloadsId = "downloads";
    const downloadsFolder: DirectoryEntry = {
      id: downloadsId,
      children: [],
      type: "directory",
      label: "Downloads",
      parentId: state.rootId,
    };

    const created = state.createOneNode(downloadsFolder);
    if (created) {
      // Add to root's children - get root and update it directly
      const root = state.getDirectoryByID(state.rootId);
      if (root) {
        const newRootChildren = [...root.children, downloadsId];
        const rootUpdated = state.updateDirectoryByID(state.rootId, {
          children: newRootChildren,
        });
        if (rootUpdated) {
          console.log(
            "ensureDownloadsFolder: created downloads folder with ID",
            downloadsId
          );
          return downloadsId;
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
   * Download a new easter egg (business logic)
   */
  downloadEgg: (): void => {
    console.log("downloadEgg: downloading a new egg");

    const state = get();

    // Ensure downloads folder exists - inline the logic to avoid circular reference
    let downloadsId: string;
    const existingDownloads = state.findOneNode(
      (node: NodeEntry) =>
        node.label === "Downloads" && node.parentId === state.rootId
    );

    if (existingDownloads) {
      downloadsId = existingDownloads.id;
    } else {
      // Create downloads folder
      downloadsId = "downloads";
      const downloadsFolder: DirectoryEntry = {
        id: downloadsId,
        children: [],
        type: "directory",
        label: "Downloads",
        parentId: state.rootId,
      };

      const created = state.createOneNode(downloadsFolder);
      if (!created) {
        console.error("downloadEgg: failed to create downloads folder");
        return;
      }

      // Add to root's children
      const root = state.getDirectoryByID(state.rootId);
      if (root) {
        const newRootChildren = [...root.children, downloadsId];
        const rootUpdated = state.updateDirectoryByID(state.rootId, {
          children: newRootChildren,
        });
        if (!rootUpdated) {
          state.deleteNodeByID(downloadsId);
          console.error("downloadEgg: failed to add downloads folder to root");
          return;
        }
      } else {
        state.deleteNodeByID(downloadsId);
        console.error("downloadEgg: root directory not found");
        return;
      }
    }

    // Generate unique ID for the new egg
    const timestamp = Date.now();
    const eggId = `downloaded-egg-${timestamp}`;

    // Create new egg
    const newEgg: EasterEggEntry = {
      id: eggId,
      type: "easter-egg",
      label: "Egg",
      image: [EASTER_EGG1, EASTER_EGG2, EASTER_EGG3],
      currentImageIndex: 0,
      isBroken: false,
      parentId: downloadsId,
    };

    const created = state.createOneNode(newEgg);
    if (created) {
      // Add to downloads folder - inline the logic
      const downloadsDir = state.getDirectoryByID(downloadsId);
      if (downloadsDir) {
        const newChildren = [...downloadsDir.children, eggId];
        const added = state.updateDirectoryByID(downloadsId, {
          children: newChildren,
        });
        if (added) {
          console.log("downloadEgg: created egg with ID", eggId);
        } else {
          // Rollback creation
          state.deleteNodeByID(eggId);
          console.error("downloadEgg: failed to add egg to downloads folder");
        }
      } else {
        // Rollback creation
        state.deleteNodeByID(eggId);
        console.error("downloadEgg: downloads folder not found");
      }
    } else {
      console.error("downloadEgg: failed to create egg");
    }
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
