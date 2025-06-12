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
  // Terminal filesystem commands
  resolvePath: (path: string, currentDir: string) => string | null;
  terminalLs: (
    path: string | undefined,
    currentDir: string
  ) => { success: boolean; output: string };
  terminalCd: (
    path: string,
    currentDir: string
  ) => { success: boolean; output: string; newDir?: string };
  terminalPwd: (currentDir: string) => { success: boolean; output: string };
  terminalCat: (
    filename: string,
    currentDir: string
  ) => { success: boolean; output: string };
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

  // Terminal filesystem commands
  resolvePath: (path: string, currentDir: string): string | null => {
    console.log(
      "resolvePath in nodeSlice: resolving",
      path,
      "from",
      currentDir
    );

    const currentState = get();

    // Handle absolute paths (starting with /)
    if (path.startsWith("/")) {
      path = path.substring(1);
      currentDir = currentState.rootId;
    }

    // Handle relative paths
    if (path === "." || path === "") {
      return currentDir;
    }

    if (path === "..") {
      const current = currentState.nodeMap[currentDir];
      return current?.parentId || currentDir;
    }

    // Handle path with multiple segments (e.g., "folder/subfolder")
    const segments = path.split("/").filter(Boolean);
    let targetDir = currentDir;

    for (const segment of segments) {
      if (segment === "..") {
        const current = currentState.nodeMap[targetDir];
        targetDir = current?.parentId || targetDir;
      } else {
        // Find child with matching name
        const targetNode = currentState.nodeMap[targetDir];
        if (!targetNode || targetNode.type !== "directory") {
          return null;
        }
        const children = (targetNode as DirectoryEntry).children
          .map((childId: string) => currentState.nodeMap[childId])
          .filter(Boolean);
        const child = children.find(
          (child: NodeEntry) =>
            child.label.toLowerCase() === segment.toLowerCase()
        );
        if (!child) {
          return null; // Path not found
        }
        targetDir = child.id;
      }
    }

    return targetDir;
  },

  terminalLs: (path: string | undefined, currentDir: string) => {
    console.log("terminalLs in nodeSlice: listing", path, "from", currentDir);

    const currentState = get();

    // Resolve path inline since we can't call our own methods
    let targetDir = currentDir;
    if (path) {
      // Handle absolute paths (starting with /)
      if (path.startsWith("/")) {
        path = path.substring(1);
        targetDir = currentState.rootId;
      }

      // Handle relative paths
      if (path === "." || path === "") {
        targetDir = currentDir;
      } else if (path === "..") {
        const current = currentState.nodeMap[currentDir];
        targetDir = current?.parentId || currentDir;
      } else {
        // Handle path with multiple segments
        const segments = path.split("/").filter(Boolean);
        targetDir = currentDir;

        for (const segment of segments) {
          if (segment === "..") {
            const current = currentState.nodeMap[targetDir];
            targetDir = current?.parentId || targetDir;
          } else {
            const targetNode = currentState.nodeMap[targetDir];
            if (!targetNode || targetNode.type !== "directory") {
              return {
                success: false,
                output: `ls: ${path}: No such file or directory`,
              };
            }
            const children = (targetNode as DirectoryEntry).children
              .map((childId: string) => currentState.nodeMap[childId])
              .filter(Boolean);
            const child = children.find(
              (child: NodeEntry) =>
                child.label.toLowerCase() === segment.toLowerCase()
            );
            if (!child) {
              return {
                success: false,
                output: `ls: ${path}: No such file or directory`,
              };
            }
            targetDir = child.id;
          }
        }
      }
    }

    if (!targetDir) {
      return {
        success: false,
        output: `ls: ${path}: No such file or directory`,
      };
    }

    const targetNode = currentState.nodeMap[targetDir];
    if (!targetNode) {
      return {
        success: false,
        output: `ls: ${path}: No such file or directory`,
      };
    }

    if (targetNode.type !== "directory") {
      return { success: true, output: targetNode.label };
    }

    const targetNodeForLs = currentState.nodeMap[targetDir] as DirectoryEntry;
    const children = targetNodeForLs.children
      .map((childId: string) => currentState.nodeMap[childId])
      .filter(Boolean);

    if (children.length === 0) {
      return { success: true, output: "" };
    }

    // Format output like Unix ls
    const items = children.map((child: NodeEntry) => {
      const prefix = child.type === "directory" ? "/" : "";
      return `${child.label}${prefix}`;
    });

    return { success: true, output: items.join("  ") };
  },

  terminalCd: (path: string, currentDir: string) => {
    console.log(
      "terminalCd in nodeSlice: changing to",
      path,
      "from",
      currentDir
    );

    if (!path || path.trim() === "") {
      return { success: false, output: "cd: missing argument" };
    }

    const currentState = get();

    // Resolve path inline for cd command
    const trimmedPath = path.trim();
    let targetDir = currentDir;

    // Handle absolute paths (starting with /)
    if (trimmedPath.startsWith("/")) {
      const pathWithoutSlash = trimmedPath.substring(1);
      targetDir = currentState.rootId;

      if (pathWithoutSlash) {
        // Process remaining path
        const segments = pathWithoutSlash.split("/").filter(Boolean);

        for (const segment of segments) {
          if (segment === "..") {
            const current = currentState.nodeMap[targetDir];
            targetDir = current?.parentId || targetDir;
          } else {
            const targetNode = currentState.nodeMap[targetDir];
            if (!targetNode || targetNode.type !== "directory") {
              return {
                success: false,
                output: `cd: ${path}: No such file or directory`,
              };
            }
            const children = (targetNode as DirectoryEntry).children
              .map((childId: string) => currentState.nodeMap[childId])
              .filter(Boolean);
            const child = children.find(
              (child: NodeEntry) =>
                child.label.toLowerCase() === segment.toLowerCase()
            );
            if (!child) {
              return {
                success: false,
                output: `cd: ${path}: No such file or directory`,
              };
            }
            targetDir = child.id;
          }
        }
      }
    } else {
      // Handle relative paths
      if (trimmedPath === "." || trimmedPath === "") {
        targetDir = currentDir;
      } else if (trimmedPath === "..") {
        const current = currentState.nodeMap[currentDir];
        targetDir = current?.parentId || currentDir;
      } else {
        // Handle path with multiple segments
        const segments = trimmedPath.split("/").filter(Boolean);

        for (const segment of segments) {
          if (segment === "..") {
            const current = currentState.nodeMap[targetDir];
            targetDir = current?.parentId || targetDir;
          } else {
            const targetNode = currentState.nodeMap[targetDir];
            if (!targetNode || targetNode.type !== "directory") {
              return {
                success: false,
                output: `cd: ${path}: No such file or directory`,
              };
            }
            const children = (targetNode as DirectoryEntry).children
              .map((childId: string) => currentState.nodeMap[childId])
              .filter(Boolean);
            const child = children.find(
              (child: NodeEntry) =>
                child.label.toLowerCase() === segment.toLowerCase()
            );
            if (!child) {
              return {
                success: false,
                output: `cd: ${path}: No such file or directory`,
              };
            }
            targetDir = child.id;
          }
        }
      }
    }

    if (!targetDir) {
      return {
        success: false,
        output: `cd: ${path}: No such file or directory`,
      };
    }

    const targetNode = currentState.nodeMap[targetDir];

    if (!targetNode) {
      return {
        success: false,
        output: `cd: ${path}: No such file or directory`,
      };
    }

    if (targetNode.type !== "directory") {
      return { success: false, output: `cd: ${path}: Not a directory` };
    }

    return { success: true, output: "", newDir: targetDir };
  },

  terminalPwd: (currentDir: string) => {
    console.log("terminalPwd in nodeSlice: getting path for", currentDir);

    const currentState = get();
    const current = currentState.nodeMap[currentDir];

    if (!current) {
      return { success: false, output: "pwd: current directory not found" };
    }

    // Build path by traversing up to root
    const buildPath = (nodeId: string): string => {
      const node = currentState.nodeMap[nodeId];
      if (!node || !node.parentId) {
        return node?.label === "Desktop" ? "/" : `/${node?.label || ""}`;
      }
      const parentPath = buildPath(node.parentId);
      return parentPath === "/"
        ? `/${node.label}`
        : `${parentPath}/${node.label}`;
    };

    const fullPath = buildPath(current.id);
    return { success: true, output: fullPath };
  },

  terminalCat: (filename: string, currentDir: string) => {
    console.log(
      "terminalCat in nodeSlice: reading",
      filename,
      "from",
      currentDir
    );

    if (!filename || filename.trim() === "") {
      return { success: false, output: "cat: missing file operand" };
    }

    const currentState = get();
    const currentDirNode = currentState.nodeMap[currentDir];

    if (!currentDirNode || currentDirNode.type !== "directory") {
      return { success: false, output: "cat: current directory not found" };
    }

    const children = (currentDirNode as DirectoryEntry).children
      .map((childId: string) => currentState.nodeMap[childId])
      .filter(Boolean);

    // Find the file
    const file = children.find(
      (child: NodeEntry) => child.label.toLowerCase() === filename.toLowerCase()
    );

    if (!file) {
      return {
        success: false,
        output: `cat: ${filename}: No such file or directory`,
      };
    }

    if (file.type === "directory") {
      return { success: false, output: `cat: ${filename}: Is a directory` };
    }

    // Simulate file contents based on file type/name
    if (filename.toLowerCase().includes("readme")) {
      return {
        success: true,
        output: `# ${file.label}
This is a simulated file in the portfolio file system.
File type: ${file.type}
Created as part of the interactive terminal demo.`,
      };
    }

    return {
      success: true,
      output: `This is the contents of ${file.label}.
File type: ${file.type}
(Simulated content)`,
    };
  },
});
