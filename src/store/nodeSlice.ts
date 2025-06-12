import { defaultNodeMap, defaultRootId } from "../constants/nodes";
import { FOLDER, images } from "../constants/images";
import type {
  NodeEntry,
  NodeMap,
  DirectoryEntry,
  EasterEggEntry,
} from "../types/nodeTypes";
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
  createNode: (nodeData: Omit<NodeEntry, "parentId">, parentId: string) => void;
  ensureDownloadsFolder: () => string;
  downloadEgg: () => void;
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

  createNode: (nodeData: Omit<NodeEntry, "parentId">, parentId: string) => {
    console.log(
      "createNode in nodeSlice: creating node",
      nodeData.id,
      "in parent",
      parentId
    );

    const currentState = get();
    const parent = currentState.nodeMap[parentId];

    if (!parent || parent.type !== "directory") {
      console.log(
        "createNode in nodeSlice: parent not found or not a directory"
      );
      return;
    }

    // Check if node with this ID already exists
    if (currentState.nodeMap[nodeData.id]) {
      console.log(
        "createNode in nodeSlice: node with ID",
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

  ensureDownloadsFolder: () => {
    console.log(
      "ensureDownloadsFolder in nodeSlice: checking for downloads folder"
    );

    const currentState = get();

    // Check if downloads folder already exists
    const existingDownloads = Object.values(currentState.nodeMap).find(
      (node) =>
        node.label === "Downloads" && node.parentId === currentState.rootId
    );

    if (existingDownloads) {
      console.log(
        "ensureDownloadsFolder in nodeSlice: downloads folder already exists",
        existingDownloads.id
      );
      return existingDownloads.id;
    }

    // Create downloads folder
    const downloadsId = "downloads";
    const downloadsFolder: DirectoryEntry = {
      id: downloadsId,
      parentId: currentState.rootId,
      children: [],
      type: "directory",
      label: "Downloads",
      image: FOLDER,
    };

    set((state) => {
      const rootNode = state.nodeMap[state.rootId] as DirectoryEntry;
      return {
        nodeMap: {
          ...state.nodeMap,
          [downloadsId]: downloadsFolder,
          [state.rootId]: {
            ...rootNode,
            children: [...rootNode.children, downloadsId],
          },
        },
      };
    });

    console.log(
      "ensureDownloadsFolder in nodeSlice: created downloads folder with ID",
      downloadsId
    );
    return downloadsId;
  },

  downloadEgg: () => {
    console.log("downloadEgg in nodeSlice: downloading a new egg");

    const currentState = get();

    // Check if downloads folder exists, if not create it
    const downloadsId: string =
      Object.values(currentState.nodeMap).find(
        (node) =>
          node.label === "Downloads" && node.parentId === currentState.rootId
      )?.id || "downloads";

    if (!currentState.nodeMap[downloadsId]) {
      const downloadsFolder: DirectoryEntry = {
        id: downloadsId,
        parentId: currentState.rootId,
        children: [],
        type: "directory",
        label: "Downloads",
        image: FOLDER,
      };

      set((state) => {
        const rootNode = state.nodeMap[state.rootId] as DirectoryEntry;
        return {
          nodeMap: {
            ...state.nodeMap,
            [downloadsId]: downloadsFolder,
            [state.rootId]: {
              ...rootNode,
              children: [...rootNode.children, downloadsId],
            },
          },
        };
      });
    }

    // Generate unique ID for the new egg
    const timestamp = Date.now();
    const eggId = `downloaded-egg-${timestamp}`;

    // Create new egg
    const newEgg: EasterEggEntry = {
      id: eggId,
      parentId: downloadsId,
      type: "easter-egg",
      label: "Egg",
      image: [images.EASTER_EGG1, images.EASTER_EGG2, images.EASTER_EGG3],
      currentImageIndex: 0,
      isBroken: false,
    };

    // Add the egg to downloads folder
    set((state) => {
      const downloadsFolder = state.nodeMap[downloadsId] as DirectoryEntry;
      return {
        nodeMap: {
          ...state.nodeMap,
          [eggId]: newEgg,
          [downloadsId]: {
            ...downloadsFolder,
            children: [...downloadsFolder.children, eggId],
          },
        },
      };
    });

    console.log("downloadEgg in nodeSlice: created egg with ID", eggId);
  },
});
