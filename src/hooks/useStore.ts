import { create } from "zustand";
import { defaultNodeMap, defaultRootId, EGG_BROKEN } from "../constants/nodes";
import type { DirectoryEntry, NodeEntry, NodeMap } from "../types/nodeTypes";

// Window interface for better type safety and extensibility
interface WindowState {
  id: string; // original nodeId that opened the window
  currentNodeId: string; // current folder being viewed (for navigation)
  zIndex: number;
  navigationHistory: string[]; // for back/forward navigation
  currentHistoryIndex: number;
}

// Easter egg state for individual eggs
interface EasterEggState {
  currentImageIndex: number; // Which image in the array to show (0, 1, 2)
  isBroken: boolean; // If true, show broken egg image instead
}

// BASIC STORE INTERFACE
interface DesktopStore {
  // Core data
  nodeMap: NodeMap;
  rootId: string;

  // Selection state
  selectedNodeId: string | null;

  // Easter egg state
  easterEggStates: { [nodeId: string]: EasterEggState };

  // Basic getters
  getNode: (id: string) => NodeEntry | undefined;
  getChildren: (parentId: string) => NodeEntry[];
  getParent: (nodeId: string) => NodeEntry | undefined;
  isDirectChildOfRoot: (nodeId: string) => boolean;

  // Selection actions
  selectNode: (nodeId: string) => void;

  // Window state - now using WindowState objects
  openWindows: WindowState[];
  nextZIndex: number;

  // Window actions
  openWindow: (nodeId: string) => void;
  closeWindow: (nodeId: string) => void;
  focusWindow: (nodeId: string) => void;
  getWindowByNodeId: (nodeId: string) => WindowState | undefined;

  // Window navigation actions
  navigateInWindow: (windowNodeId: string, targetNodeId: string) => void;
  canGoBack: (windowNodeId: string) => boolean;
  canGoForward: (windowNodeId: string) => boolean;
  goBack: (windowNodeId: string) => void;
  goForward: (windowNodeId: string) => void;

  // Node movement actions for drag & drop
  moveNode: (nodeId: string, newParentId: string) => void;
  validateMove: (nodeId: string, targetParentId: string) => boolean;

  // Easter egg actions
  cycleEasterEgg: (nodeId: string) => void;
  breakEasterEgg: (nodeId: string) => void;
  getEasterEggCurrentImage: (nodeId: string) => string;
}

export const useStore = create<DesktopStore>((set, get) => ({
  // Initialize with our converted map data
  nodeMap: defaultNodeMap,
  rootId: defaultRootId,

  // Selection state
  selectedNodeId: null,

  // Easter egg state - initialize empty, will be populated as eggs are interacted with
  easterEggStates: {},

  // Basic node getter
  getNode: (id: string) => {
    const state = get();
    return state.nodeMap[id];
  },

  // Get children of a parent node
  getChildren: (parentId: string) => {
    const state = get();
    const parent = state.nodeMap[parentId];
    if (!parent) return [];

    // Only directories and easter eggs have children
    if (parent.type === "directory") {
      return parent.children
        .map((childId: string) => state.nodeMap[childId])
        .filter(Boolean); // Filter out any undefined nodes
    }

    return [];
  },

  // Get parent of a node
  getParent: (nodeId: string) => {
    const state = get();
    const node = state.nodeMap[nodeId];
    if (!node || !node.parentId) return undefined;
    return state.nodeMap[node.parentId];
  },

  // Check if node is direct child of root
  isDirectChildOfRoot: (nodeId: string) => {
    const state = get();
    const node: NodeEntry | undefined = state.nodeMap[nodeId];
    return node?.parentId === state.rootId;
  },

  // Selection actions
  selectNode: (nodeId: string) => {
    console.log("selectNode in useStore: selecting node", nodeId);
    set({ selectedNodeId: nodeId });
  },

  // Window management
  openWindows: [],
  nextZIndex: 1000, // Start high to avoid conflicts with other elements

  openWindow: (nodeId: string) => {
    console.log("openWindow in useStore: opening window for nodeId", nodeId);

    const currentState = get();

    // Check if window is already open
    const existingWindow = currentState.openWindows.find(
      (w) => w.id === nodeId
    );
    if (existingWindow) {
      console.log(
        "openWindow in useStore: window already open, focusing nodeId",
        nodeId
      );
      // If already open, just focus it
      get().focusWindow(nodeId);
      return;
    }

    // Create new window with next available z-index and navigation state
    const newWindow: WindowState = {
      id: nodeId,
      currentNodeId: nodeId,
      zIndex: currentState.nextZIndex,
      navigationHistory: [nodeId],
      currentHistoryIndex: 0,
    };

    set((state) => ({
      openWindows: [...state.openWindows, newWindow],
      nextZIndex: state.nextZIndex + 1,
    }));
  },

  closeWindow: (nodeId: string) => {
    console.log("closeWindow in useStore: closing window for nodeId", nodeId);

    set((state) => ({
      openWindows: state.openWindows.filter((window) => window.id !== nodeId),
    }));
  },

  focusWindow: (nodeId: string) => {
    console.log("focusWindow in useStore: focusing window for nodeId", nodeId);

    const currentState = get();
    const windowToFocus = currentState.openWindows.find((w) => w.id === nodeId);

    if (!windowToFocus) {
      console.log(
        "focusWindow in useStore: window not found for nodeId",
        nodeId
      );
      return;
    }

    // Update the focused window to have the highest z-index
    set((state) => ({
      openWindows: state.openWindows.map((window) =>
        window.id === nodeId ? { ...window, zIndex: state.nextZIndex } : window
      ),
      nextZIndex: state.nextZIndex + 1,
    }));
  },

  getWindowByNodeId: (nodeId: string) => {
    const currentState = get();
    return currentState.openWindows.find((window) => window.id === nodeId);
  },

  // Window navigation actions
  navigateInWindow: (windowNodeId: string, targetNodeId: string) => {
    console.log(
      "navigateInWindow in useStore: navigating in window",
      windowNodeId,
      "to target",
      targetNodeId
    );

    set((state) => ({
      openWindows: state.openWindows.map((window) => {
        if (window.id !== windowNodeId) return window;

        // Trim history after current position (like browser navigation)
        const newHistory = window.navigationHistory.slice(
          0,
          window.currentHistoryIndex + 1
        );

        // Add new target to history
        newHistory.push(targetNodeId);

        return {
          ...window,
          currentNodeId: targetNodeId,
          navigationHistory: newHistory,
          currentHistoryIndex: newHistory.length - 1,
        };
      }),
    }));
  },

  canGoBack: (windowNodeId: string) => {
    const currentState = get();
    const window = currentState.openWindows.find((w) => w.id === windowNodeId);
    return window ? window.currentHistoryIndex > 0 : false;
  },

  canGoForward: (windowNodeId: string) => {
    const currentState = get();
    const window = currentState.openWindows.find((w) => w.id === windowNodeId);
    return window
      ? window.currentHistoryIndex < window.navigationHistory.length - 1
      : false;
  },

  goBack: (windowNodeId: string) => {
    console.log("goBack in useStore: going back in window", windowNodeId);

    const currentState = get();
    const window = currentState.openWindows.find((w) => w.id === windowNodeId);

    if (!window || window.currentHistoryIndex <= 0) return;

    const newIndex = window.currentHistoryIndex - 1;
    const targetNodeId = window.navigationHistory[newIndex];

    set((state) => ({
      openWindows: state.openWindows.map((w) =>
        w.id === windowNodeId
          ? { ...w, currentNodeId: targetNodeId, currentHistoryIndex: newIndex }
          : w
      ),
    }));
  },

  goForward: (windowNodeId: string) => {
    console.log("goForward in useStore: going forward in window", windowNodeId);

    const currentState = get();
    const window = currentState.openWindows.find((w) => w.id === windowNodeId);

    if (
      !window ||
      window.currentHistoryIndex >= window.navigationHistory.length - 1
    )
      return;

    const newIndex = window.currentHistoryIndex + 1;
    const targetNodeId = window.navigationHistory[newIndex];

    set((state) => ({
      openWindows: state.openWindows.map((w) =>
        w.id === windowNodeId
          ? { ...w, currentNodeId: targetNodeId, currentHistoryIndex: newIndex }
          : w
      ),
    }));
  },

  // Node movement operations for drag & drop
  moveNode: (nodeId: string, newParentId: string) => {
    console.log(
      "moveNode in useStore: moving node",
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
        "moveNode in useStore: invalid move - missing node or parent not directory"
      );
      return;
    }

    // Validate the move before executing
    if (!get().validateMove(nodeId, newParentId)) {
      console.log("moveNode in useStore: move validation failed");
      return;
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

  validateMove: (nodeId: string, targetParentId: string) => {
    console.log(
      "validateMove in useStore: validating move of",
      nodeId,
      "to",
      targetParentId
    );

    const currentState = get();
    const node = currentState.nodeMap[nodeId];
    const targetParent = currentState.nodeMap[targetParentId];

    // Basic validation checks
    if (!node || !targetParent) {
      console.log("validateMove in useStore: node or target not found");
      return false;
    }

    // Target must be a directory
    if (targetParent.type !== "directory") {
      console.log("validateMove in useStore: target is not a directory");
      return false;
    }

    // Can't move to same parent
    if (node.parentId === targetParentId) {
      console.log(
        "validateMove in useStore: same parent, no move needed - node parent:",
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
        console.log("validateMove in useStore: circular reference detected");
        return false;
      }
    }

    return true;
  },

  // Easter egg functionality
  cycleEasterEgg: (nodeId: string) => {
    console.log("cycleEasterEgg in useStore: cycling easter egg", nodeId);

    const currentState = get();
    const node = currentState.nodeMap[nodeId];

    if (!node || node.type !== "easter-egg" || !Array.isArray(node.image)) {
      console.log("cycleEasterEgg in useStore: not a valid easter egg");
      return;
    }

    // Get current state or initialize
    const currentEggState = currentState.easterEggStates[nodeId] || {
      currentImageIndex: 0,
      isBroken: false,
    };

    // Don't cycle if broken
    if (currentEggState.isBroken) {
      console.log("cycleEasterEgg in useStore: egg is broken, cannot cycle");
      return;
    }

    // Cycle to next image (wrap around to 0 after last image)
    const nextIndex =
      (currentEggState.currentImageIndex + 1) % node.image.length;

    set((state) => ({
      easterEggStates: {
        ...state.easterEggStates,
        [nodeId]: {
          ...currentEggState,
          currentImageIndex: nextIndex,
        },
      },
    }));
  },

  breakEasterEgg: (nodeId: string) => {
    console.log("breakEasterEgg in useStore: breaking easter egg", nodeId);

    const currentState = get();
    const node = currentState.nodeMap[nodeId];

    if (!node || node.type !== "easter-egg") {
      console.log("breakEasterEgg in useStore: not a valid easter egg");
      return;
    }

    // Get current state or initialize
    const currentEggState = currentState.easterEggStates[nodeId] || {
      currentImageIndex: 0,
      isBroken: false,
    };

    // Break the egg
    set((state) => ({
      easterEggStates: {
        ...state.easterEggStates,
        [nodeId]: {
          ...currentEggState,
          isBroken: true,
        },
      },
    }));
  },

  getEasterEggCurrentImage: (nodeId: string): string => {
    const currentState = get();
    const node = currentState.nodeMap[nodeId];

    if (!node || node.type !== "easter-egg") {
      return typeof node?.image === "string" ? node.image : "";
    }

    // Get current egg state
    const eggState = currentState.easterEggStates[nodeId] || {
      currentImageIndex: 0,
      isBroken: false,
    };

    // If broken, return broken image
    if (eggState.isBroken) {
      console.log(
        "getEasterEggCurrentImage: egg is broken, returning EGG_BROKEN",
        EGG_BROKEN
      );
      return EGG_BROKEN;
    }

    // If not broken and has image array, return current image
    if (Array.isArray(node.image)) {
      const currentImage =
        node.image[eggState.currentImageIndex] || node.image[0];
      console.log(
        "getEasterEggCurrentImage: returning current image",
        currentImage,
        "index:",
        eggState.currentImageIndex
      );
      return currentImage;
    }

    // Fallback
    console.log("getEasterEggCurrentImage: using fallback image");
    return typeof node.image === "string" ? node.image : "";
  },
}));
