import { useNewStore } from "./useStore";
import type { NodeEntry, DirectoryEntry } from "../types/nodeTypes";

export const useNodeOperations = () => {
  // TODO: Once newNodeSlice is integrated into main store, use these operations:

  const {
    rootId,
    findOneNode,
    findManyNodes,
    createOneNode,
    createManyNodes,
    updateOneNode,
    updateManyNodes,
    deleteOneNode,
    deleteManyNodes,
    countNodes,
    nodeExists,
  } = useNewStore((state) => ({
    rootId: state.rootId,
    findOneNode: state.findOneNode,
    findManyNodes: state.findManyNodes,
    createOneNode: state.createOneNode,
    createManyNodes: state.createManyNodes,
    updateOneNode: state.updateOneNode,
    updateManyNodes: state.updateManyNodes,
    deleteOneNode: state.deleteOneNode,
    deleteManyNodes: state.deleteManyNodes,
    countNodes: state.countNodes,
    nodeExists: state.nodeExists,
  }));

  const getNodeByID = (id: NodeEntry["id"]): NodeEntry | undefined => {
    return findOneNode((node: NodeEntry) => node.id === id);
  };

  const getChildrenByParentID = (
    parentId: DirectoryEntry["id"]
  ): NodeEntry[] => {
    return findManyNodes((node: NodeEntry) => node.parentId === parentId);
  };

  const getParentByChildID = (
    nodeId: NodeEntry["id"]
  ): NodeEntry | undefined => {
    const node = getNodeByID(nodeId);
    return node?.parentId ? getNodeByID(node.parentId) : undefined;
  };

  const isDirectChildOfRoot = (nodeId: NodeEntry["id"]): boolean => {
    const node = getNodeByID(nodeId);
    return node?.parentId === rootId;
  };

  // Utility: Get directory specifically (with type safety)
  const getDirectoryByID = (
    id: NodeEntry["id"]
  ): DirectoryEntry | undefined => {
    const node = getNodeByID(id);
    return node?.type === "directory" ? (node as DirectoryEntry) : undefined;
  };

  // Utility: Check if one node is a descendant of another (reusable)
  const isNodeDescendantOfAncestor = (
    ancestorId: NodeEntry["id"],
    descendantId: NodeEntry["id"]
  ): boolean => {
    const descendant = getNodeByID(descendantId);
    if (!descendant || !descendant.parentId) return false;
    if (descendant.parentId === ancestorId) return true;
    return isNodeDescendantOfAncestor(ancestorId, descendant.parentId);
  };

  // Node movement operations (built from base operations)
  const moveNodeByIDToParentID = (
    nodeId: NodeEntry["id"],
    newParentId: DirectoryEntry["id"]
  ): boolean => {
    console.log(
      "moveNodeByIDToParentID in useNodeOperations: moving node",
      nodeId,
      "to parent",
      newParentId
    );

    const node = getNodeByID(nodeId);
    const newParent = getDirectoryByID(newParentId);
    const oldParent = node?.parentId ? getDirectoryByID(node.parentId) : null;

    // Validation checks
    if (!node || !newParent) {
      console.log(
        "moveNodeByIDToParentID: invalid move - missing node or parent not directory"
      );
      return false;
    }

    if (node.parentId === newParentId) {
      console.log("moveNodeByIDToParentID: same parent, no move needed");
      return false;
    }

    // Check for circular reference if moving a directory
    if (node.type === "directory") {
      if (
        nodeId === newParentId ||
        isNodeDescendantOfAncestor(nodeId, newParentId)
      ) {
        console.log("moveNodeByIDToParentID: circular reference detected");
        return false;
      }
    }

    // Perform the move using base operations
    // 1. Update the node's parentId
    updateOneNode(nodeId, { parentId: newParentId });

    // 2. Remove from old parent's children array
    if (oldParent) {
      const newOldParentChildren = oldParent.children.filter(
        (childId: string) => childId !== nodeId
      );
      updateOneNode(oldParent.id, { children: newOldParentChildren });
    }

    // 3. Add to new parent's children array
    const newParentChildren = [...newParent.children, nodeId];
    updateOneNode(newParentId, { children: newParentChildren });

    console.log("moveNodeByIDToParentID: move completed successfully");
    return true;
  };

  // Business logic operations (built from base operations)
  // const ensureDownloadsFolder = (): string => {
  //   console.log(
  //     "ensureDownloadsFolder in useNodeOperations: checking for downloads folder"
  //   );

  //   // Check if downloads folder already exists
  //   const existingDownloads = findNodes(
  //     (node: NodeEntry) =>
  //       node.label === "Downloads" && node.parentId === rootId
  //   )[0];

  //   if (existingDownloads) {
  //     console.log(
  //       "ensureDownloadsFolder in useNodeOperations: downloads folder already exists",
  //       existingDownloads.id
  //     );
  //     return existingDownloads.id;
  //   }

  //   // Create downloads folder
  //   const downloadsId = "downloads";
  //   const downloadsFolder: Omit<DirectoryEntry, "parentId"> = {
  //     id: downloadsId,
  //     children: [],
  //     type: "directory",
  //     label: "Downloads",
  //   };

  //   createNode(downloadsFolder, rootId);
  //   console.log(
  //     "ensureDownloadsFolder in useNodeOperations: created downloads folder with ID",
  //     downloadsId
  //   );
  //   return downloadsId;
  // };
  // const downloadEgg = (): void => {
  //   console.log("downloadEgg in useNodeOperations: downloading a new egg");

  //   // Ensure downloads folder exists
  //   const downloadsId = ensureDownloadsFolder();

  //   // Generate unique ID for the new egg
  //   const timestamp = Date.now();
  //   const eggId = `downloaded-egg-${timestamp}`;

  //   // Create new egg
  //   const newEgg: Omit<EasterEggEntry, "parentId"> = {
  //     id: eggId,
  //     type: "easter-egg",
  //     label: "Egg",
  //     image: [EASTER_EGG1, EASTER_EGG2, EASTER_EGG3],
  //     currentImageIndex: 0,
  //     isBroken: false,
  //   };

  //   createNode(newEgg, downloadsId);
  //   console.log("downloadEgg in useNodeOperations: created egg with ID", eggId);
  // };

  return {
    // Derived accessors (composed from base operations)
    getNodeByID,
    getChildrenByParentID,
    getParentByChildID,
    isDirectChildOfRoot,

    // Utility functions (reusable helpers)
    getDirectoryByID,
    isNodeDescendantOfAncestor,

    // Node operations (composed from base operations)
    moveNodeByIDToParentID,

    countNodes,
    nodeExists,
  };
};
