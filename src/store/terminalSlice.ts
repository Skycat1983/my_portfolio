import type { BaseStoreState, SetState, GetState } from "../types/storeTypes";
import type { NodeEntry, DirectoryEntry } from "../types/nodeTypes";

interface TerminalState {
  isTerminalOpen: boolean;
  terminalZIndex: number;
  currentWorkingDirectory: string;
  terminalHistory: string[];
}

interface TerminalActions {
  openTerminal: () => void;
  closeTerminal: () => void;
  toggleTerminal: () => void;
  focusTerminal: () => void;
  setCurrentWorkingDirectory: (directory: string) => void;
  addToHistory: (command: string) => void;
  clearHistory: () => void;
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

export type TerminalSlice = TerminalState & TerminalActions;

export const createTerminalSlice = (
  set: SetState<BaseStoreState>,
  get: GetState<BaseStoreState>
): TerminalSlice => ({
  // Terminal state
  isTerminalOpen: false,
  terminalZIndex: 1000,
  currentWorkingDirectory: "", // Will be set to root directory on init
  terminalHistory: [],

  // Terminal actions
  openTerminal: () => {
    console.log("openTerminal in terminalSlice: opening terminal");
    set((state) => ({
      isTerminalOpen: true,
      terminalZIndex: state.nextZIndex,
      nextZIndex: state.nextZIndex + 1,
    }));
  },

  closeTerminal: () => {
    console.log("closeTerminal in terminalSlice: closing terminal");
    set({ isTerminalOpen: false });
  },

  toggleTerminal: () => {
    console.log("toggleTerminal in terminalSlice: toggling terminal");
    set((state) => ({
      isTerminalOpen: !state.isTerminalOpen,
      terminalZIndex: !state.isTerminalOpen
        ? state.nextZIndex
        : state.terminalZIndex,
      nextZIndex: !state.isTerminalOpen
        ? state.nextZIndex + 1
        : state.nextZIndex,
    }));
  },

  focusTerminal: () => {
    console.log("focusTerminal in terminalSlice: focusing terminal");
    set((state) => ({
      terminalZIndex: state.nextZIndex,
      nextZIndex: state.nextZIndex + 1,
    }));
  },

  setCurrentWorkingDirectory: (directory: string) => {
    console.log(
      "setCurrentWorkingDirectory in terminalSlice: setting to",
      directory
    );
    set((state) => ({
      ...state,
      currentWorkingDirectory: directory,
    }));
  },

  addToHistory: (command: string) => {
    console.log("addToHistory in terminalSlice: adding command", command);
    set((state) => {
      const terminalState = state as BaseStoreState & TerminalState;
      return {
        ...state,
        terminalHistory: [...terminalState.terminalHistory, command],
      };
    });
  },

  clearHistory: () => {
    console.log("clearHistory in terminalSlice: clearing history");
    set((state) => ({
      ...state,
      terminalHistory: [],
    }));
  },

  // Terminal filesystem commands
  resolvePath: (path: string, currentDir: string): string | null => {
    console.log(
      "resolvePath in terminalSlice: resolving",
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
    console.log(
      "terminalLs in terminalSlice: listing",
      path,
      "from",
      currentDir
    );

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
      "terminalCd in terminalSlice: changing to",
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
    console.log("terminalPwd in terminalSlice: getting path for", currentDir);

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
      "terminalCat in terminalSlice: reading",
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
