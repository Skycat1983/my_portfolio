import { create } from "zustand";
import { useStore } from "./useStore";
import type { NodeEntry } from "../types/nodeTypes";

// Terminal-specific state and functionality
interface TerminalState {
  currentWorkingDirectory: string; // Current directory nodeId
  terminalHistory: string[]; // Command history

  // Core file system commands
  cd: (path: string) => { success: boolean; output: string };
  ls: (path?: string) => { success: boolean; output: string };
  pwd: () => { success: boolean; output: string };
  mkdir: (name: string) => { success: boolean; output: string };
  touch: (name: string) => { success: boolean; output: string };
  rm: (name: string) => { success: boolean; output: string };
  mv: (source: string, target: string) => { success: boolean; output: string };
  cp: (source: string, target: string) => { success: boolean; output: string };
  cat: (filename: string) => { success: boolean; output: string };
  find: (pattern: string) => { success: boolean; output: string };

  // Utility functions
  resolvePath: (path: string) => string | null; // Resolve relative/absolute paths
  getCurrentDirectory: () => NodeEntry | undefined;
  addToHistory: (command: string) => void;
}

export const useTerminalStore = create<TerminalState>((set, get) => ({
  currentWorkingDirectory: "desktop-root", // Start at desktop root
  terminalHistory: [],

  getCurrentDirectory: () => {
    const currentDir = get().currentWorkingDirectory;
    return useStore.getState().getNode(currentDir);
  },

  addToHistory: (command: string) => {
    set((state) => ({
      terminalHistory: [...state.terminalHistory, command],
    }));
  },

  resolvePath: (path: string): string | null => {
    const store = useStore.getState();
    const currentDir = get().currentWorkingDirectory;

    // Handle absolute paths (starting with /)
    if (path.startsWith("/")) {
      // For now, treat absolute paths as relative to root
      path = path.substring(1);
    }

    // Handle relative paths
    if (path === "." || path === "") {
      return currentDir;
    }

    if (path === "..") {
      const current = store.getNode(currentDir);
      return current?.parentId || currentDir;
    }

    // Handle path with multiple segments (e.g., "folder/subfolder")
    const segments = path.split("/").filter(Boolean);
    let targetDir = currentDir;

    for (const segment of segments) {
      if (segment === "..") {
        const current = store.getNode(targetDir);
        targetDir = current?.parentId || targetDir;
      } else {
        // Find child with matching name
        const children = store.getChildren(targetDir);
        const child = children.find(
          (child) => child.label.toLowerCase() === segment.toLowerCase()
        );
        if (!child) {
          return null; // Path not found
        }
        targetDir = child.id;
      }
    }

    return targetDir;
  },

  pwd: () => {
    const store = useStore.getState();
    const current = store.getNode(get().currentWorkingDirectory);

    if (!current) {
      return { success: false, output: "pwd: current directory not found" };
    }

    // Build path by traversing up to root
    const buildPath = (nodeId: string): string => {
      const node = store.getNode(nodeId);
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

  ls: (path?: string) => {
    const store = useStore.getState();
    const targetDir = path
      ? get().resolvePath(path)
      : get().currentWorkingDirectory;

    if (!targetDir) {
      return {
        success: false,
        output: `ls: ${path}: No such file or directory`,
      };
    }

    const targetNode = store.getNode(targetDir);
    if (!targetNode) {
      return {
        success: false,
        output: `ls: ${path}: No such file or directory`,
      };
    }

    if (targetNode.type !== "directory") {
      return { success: true, output: targetNode.label };
    }

    const children = store.getChildren(targetDir);
    if (children.length === 0) {
      return { success: true, output: "" };
    }

    // Format output like Unix ls
    const items = children.map((child) => {
      const prefix = child.type === "directory" ? "/" : "";
      return `${child.label}${prefix}`;
    });

    return { success: true, output: items.join("  ") };
  },

  cd: (path: string) => {
    if (!path || path.trim() === "") {
      return { success: false, output: "cd: missing argument" };
    }

    const targetDir = get().resolvePath(path.trim());

    if (!targetDir) {
      return {
        success: false,
        output: `cd: ${path}: No such file or directory`,
      };
    }

    const store = useStore.getState();
    const targetNode = store.getNode(targetDir);

    if (!targetNode) {
      return {
        success: false,
        output: `cd: ${path}: No such file or directory`,
      };
    }

    if (targetNode.type !== "directory") {
      return { success: false, output: `cd: ${path}: Not a directory` };
    }

    set({ currentWorkingDirectory: targetDir });
    return { success: true, output: "" };
  },

  mkdir: (name: string) => {
    if (!name || name.trim() === "") {
      return { success: false, output: "mkdir: missing operand" };
    }

    const store = useStore.getState();
    const currentDir = get().currentWorkingDirectory;
    const children = store.getChildren(currentDir);

    // Check if directory already exists
    const exists = children.some(
      (child) => child.label.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      return {
        success: false,
        output: `mkdir: cannot create directory '${name}': File exists`,
      };
    }

    // For now, return a message about future implementation
    // TODO: Implement actual directory creation when we have node creation functions
    return {
      success: false,
      output: `mkdir: '${name}' - Directory creation not yet implemented`,
    };
  },

  touch: (name: string) => {
    if (!name || name.trim() === "") {
      return { success: false, output: "touch: missing file operand" };
    }

    // TODO: Implement file creation
    return {
      success: false,
      output: `touch: '${name}' - File creation not yet implemented`,
    };
  },

  rm: (name: string) => {
    if (!name || name.trim() === "") {
      return { success: false, output: "rm: missing operand" };
    }

    // TODO: Implement file/directory removal
    return {
      success: false,
      output: `rm: '${name}' - File removal not yet implemented`,
    };
  },

  mv: (source: string, target: string) => {
    if (!source || !target) {
      return { success: false, output: "mv: missing operand" };
    }

    // TODO: Implement move using existing moveNode function
    return {
      success: false,
      output: `mv: '${source}' to '${target}' - Move not yet implemented`,
    };
  },

  cp: (source: string, target: string) => {
    if (!source || !target) {
      return { success: false, output: "cp: missing operand" };
    }

    // TODO: Implement copy
    return {
      success: false,
      output: `cp: '${source}' to '${target}' - Copy not yet implemented`,
    };
  },

  cat: (filename: string) => {
    if (!filename || filename.trim() === "") {
      return { success: false, output: "cat: missing file operand" };
    }

    const store = useStore.getState();
    const currentDir = get().currentWorkingDirectory;
    const children = store.getChildren(currentDir);

    // Find the file
    const file = children.find(
      (child) => child.label.toLowerCase() === filename.toLowerCase()
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

  find: (pattern: string) => {
    if (!pattern || pattern.trim() === "") {
      return { success: false, output: "find: missing search pattern" };
    }

    // TODO: Implement recursive search through node tree
    return {
      success: false,
      output: `find: '${pattern}' - Search not yet implemented`,
    };
  },
}));
