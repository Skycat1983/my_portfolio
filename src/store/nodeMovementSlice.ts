import type { DirectoryEntry } from "../types/nodeTypes";
import type { BaseStoreState, SetState, GetState } from "../types/storeTypes";

interface NodeMovementActions {
  moveNode: (nodeId: string, newParentId: string) => void;
  validateMove: (nodeId: string, targetParentId: string) => boolean;
}

export type NodeMovementSlice = NodeMovementActions;

export const createNodeMovementSlice = (
  set: SetState<BaseStoreState>,
  get: GetState<BaseStoreState>
): NodeMovementSlice => ({
  // Validate if a node can be moved to a target parent
  validateMove: (nodeId: string, targetParentId: string): boolean => {
    console.log(
      "validateMove in nodeMovementSlice: validating move of",
      nodeId,
      "to",
      targetParentId
    );

    const currentState = get();
    const node = currentState.nodeMap[nodeId];
    const targetParent = currentState.nodeMap[targetParentId];

    // Basic validation checks
    if (!node || !targetParent) {
      console.log(
        "validateMove in nodeMovementSlice: node or target not found"
      );
      return false;
    }

    // Target must be a directory
    if (targetParent.type !== "directory") {
      console.log(
        "validateMove in nodeMovementSlice: target is not a directory"
      );
      return false;
    }

    // Can't move to same parent
    if (node.parentId === targetParentId) {
      console.log(
        "validateMove in nodeMovementSlice: same parent, no move needed - node parent:",
        node.parentId,
        "target:",
        targetParentId,
        "node label:",
        node.label,
        "target label:",
        targetParent.label
      );
      return false;
    }

    // Can't move a directory into itself or its descendants (circular reference check)
    if (node.type === "directory") {
      const isDescendant = (
        ancestorId: string,
        descendantId: string
      ): boolean => {
        const descendant = currentState.nodeMap[descendantId];
        if (!descendant || !descendant.parentId) return false;

        if (descendant.parentId === ancestorId) return true;
        return isDescendant(ancestorId, descendant.parentId);
      };

      if (nodeId === targetParentId || isDescendant(nodeId, targetParentId)) {
        console.log(
          "validateMove in nodeMovementSlice: circular reference detected"
        );
        return false;
      }
    }

    return true;
  },

  // Move a node to a new parent directory
  moveNode: (nodeId: string, newParentId: string) => {
    console.log(
      "moveNode in nodeMovementSlice: moving node",
      nodeId,
      "to parent",
      newParentId
    );

    const currentState = get();
    const node = currentState.nodeMap[nodeId];
    const newParent = currentState.nodeMap[newParentId];
    const oldParent = node?.parentId
      ? currentState.nodeMap[node.parentId]
      : null;

    if (!node || !newParent || newParent.type !== "directory") {
      console.log(
        "moveNode in nodeMovementSlice: invalid move - missing node or parent not directory"
      );
      return;
    }

    // Perform validation inline (same logic as validateMove)
    if (node.parentId === newParentId) {
      console.log("moveNode in nodeMovementSlice: same parent, no move needed");
      return;
    }

    if (node.type === "directory") {
      // Check for circular reference
      const isDescendant = (
        ancestorId: string,
        descendantId: string
      ): boolean => {
        const descendant = currentState.nodeMap[descendantId];
        if (!descendant || !descendant.parentId) return false;
        if (descendant.parentId === ancestorId) return true;
        return isDescendant(ancestorId, descendant.parentId);
      };

      if (nodeId === newParentId || isDescendant(nodeId, newParentId)) {
        console.log(
          "moveNode in nodeMovementSlice: circular reference detected"
        );
        return;
      }
    }

    set((state) => ({
      nodeMap: {
        ...state.nodeMap,
        // Update the moved node's parent
        [nodeId]: {
          ...node,
          parentId: newParentId,
        },
        // Remove from old parent's children array
        ...(oldParent &&
          oldParent.type === "directory" && {
            [oldParent.id]: {
              ...oldParent,
              children: oldParent.children.filter(
                (childId: string) => childId !== nodeId
              ),
            },
          }),
        // Add to new parent's children array (newParent is already validated as directory)
        [newParentId]: {
          ...newParent,
          children: [...(newParent as DirectoryEntry).children, nodeId],
        },
      },
    }));
  },
});
