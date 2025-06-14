import { useNewStore } from "./useStore";
import type {
  NodeEntry,
  DirectoryEntry,
  EasterEggEntry,
} from "../types/nodeTypes";
import { EASTER_EGG1, EASTER_EGG2, EASTER_EGG3 } from "../constants/images";

export const useNodeOperations = () => {
  // TODO: Once newNodeSlice is integrated into main store, use these operations:
  /*
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
  */

  // Temporary: Using existing operations until newNodeSlice is integrated
  const { rootId, createNode, updateNode, findNodes, countNodes, nodeExists } =
    useNewStore((state) => ({
      rootId: state.rootId,
      createNode: state.createNode,
      updateNode: state.updateNode,
      findNodes: state.findNodes,
      countNodes: state.countNodes,
      nodeExists: state.nodeExists,
    }));

  // Derived accessor operations (built from base operations)
  const getNode = (id: NodeEntry["id"]): NodeEntry | undefined => {
    return findNodes((node: NodeEntry) => node.id === id)[0];
  };

  const getChildren = (parentId: NodeEntry["id"]): NodeEntry[] => {
    return findNodes((node: NodeEntry) => node.parentId === parentId);
  };

  const getParent = (nodeId: NodeEntry["id"]): NodeEntry | undefined => {
    const node = getNode(nodeId);
    return node?.parentId ? getNode(node.parentId) : undefined;
  };

  const isDirectChildOfRoot = (nodeId: NodeEntry["id"]): boolean => {
    const node = getNode(nodeId);
    return node?.parentId === rootId;
  };

  // Business logic operations (built from base operations)
  const ensureDownloadsFolder = (): string => {
    console.log(
      "ensureDownloadsFolder in useNodeOperations: checking for downloads folder"
    );

    // Check if downloads folder already exists
    const existingDownloads = findNodes(
      (node: NodeEntry) =>
        node.label === "Downloads" && node.parentId === rootId
    )[0];

    if (existingDownloads) {
      console.log(
        "ensureDownloadsFolder in useNodeOperations: downloads folder already exists",
        existingDownloads.id
      );
      return existingDownloads.id;
    }

    // Create downloads folder
    const downloadsId = "downloads";
    const downloadsFolder: Omit<DirectoryEntry, "parentId"> = {
      id: downloadsId,
      children: [],
      type: "directory",
      label: "Downloads",
    };

    createNode(downloadsFolder, rootId);
    console.log(
      "ensureDownloadsFolder in useNodeOperations: created downloads folder with ID",
      downloadsId
    );
    return downloadsId;
  };

  const downloadEgg = (): void => {
    console.log("downloadEgg in useNodeOperations: downloading a new egg");

    // Ensure downloads folder exists
    const downloadsId = ensureDownloadsFolder();

    // Generate unique ID for the new egg
    const timestamp = Date.now();
    const eggId = `downloaded-egg-${timestamp}`;

    // Create new egg
    const newEgg: Omit<EasterEggEntry, "parentId"> = {
      id: eggId,
      type: "easter-egg",
      label: "Egg",
      image: [EASTER_EGG1, EASTER_EGG2, EASTER_EGG3],
      currentImageIndex: 0,
      isBroken: false,
    };

    createNode(newEgg, downloadsId);
    console.log("downloadEgg in useNodeOperations: created egg with ID", eggId);
  };

  return {
    // Derived accessors (composed from base operations)
    getNode,
    getChildren,
    getParent,
    isDirectChildOfRoot,

    // Business logic (composed from base operations)
    ensureDownloadsFolder,
    downloadEgg,

    // Base operations (direct pass-through)
    findNodes,
    createNode,
    updateNode,
    countNodes,
    nodeExists,
  };
};
