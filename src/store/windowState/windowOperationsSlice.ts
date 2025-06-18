import type { WindowType } from "../../types/storeTypes";
import type { SetState, GetState } from "../../types/storeTypes";
import type { WindowCrudSlice } from "./windowCrudSlice";
import type { NodeOperationsSlice } from "../nodeState/nodeOperationsSlice";
import type { NodeEntry } from "../../types/nodeTypes";

export type WindowedNode = Exclude<NodeEntry, { type: "icon" | "link" }>;

// Store interface that includes both window and node operations
interface StoreWithWindowAndNodeOps
  extends WindowCrudSlice,
    NodeOperationsSlice {}

export interface WindowOperationsActions {
  // ID-based accessors (built from predicates)
  getWindowById: (id: WindowType["windowId"]) => WindowType | undefined;
  getWindowByNodeId: (nodeId: string) => WindowType | undefined;
  getWindowsByNodeType: (nodeType: string) => WindowType[];

  // ID-based operations (built from predicates)
  updateWindowById: (
    windowId: WindowType["windowId"],
    updates: Partial<WindowType>
  ) => boolean;
  deleteWindowById: (windowId: WindowType["windowId"]) => boolean;

  // Business operations (combine multiple CRUD operations)
  focusWindow: (windowId: WindowType["windowId"]) => boolean;
  resizeWindow: (
    windowId: WindowType["windowId"],
    width: number,
    height: number
  ) => boolean;
  moveWindow: (
    windowId: WindowType["windowId"],
    x: number,
    y: number
  ) => boolean;
  setWindowBounds: (
    windowId: WindowType["windowId"],
    bounds: { x: number; y: number; width: number; height: number }
  ) => boolean;

  // Complex business operations
  openOrFocusWindow: (nodeId: WindowedNode["id"]) => void;
  openWindow: (nodeId: WindowedNode["id"]) => void;
  focusWindowByNodeId: (nodeId: WindowedNode["id"]) => boolean;
  closeWindow: (windowId: WindowType["windowId"]) => void;

  // Window state management
  minimizeWindow: (windowId: WindowType["windowId"]) => boolean;
  maximizeWindow: (windowId: WindowType["windowId"]) => boolean;
  restoreWindow: (windowId: WindowType["windowId"]) => boolean;
  toggleMinimized: (windowId: WindowType["windowId"]) => boolean;

  // Utility operations
  isWindowOpen: (nodeId: string) => boolean;
  getTopWindow: () => WindowType | undefined;
}

export type WindowOperationsSlice = WindowOperationsActions;

// Window operations slice - builds ID-based operations from predicate-based CRUD
export const createWindowOperationsSlice = (
  set: SetState<StoreWithWindowAndNodeOps>,
  get: GetState<StoreWithWindowAndNodeOps>
): WindowOperationsSlice => ({
  /**
   * Get a window by its ID (builds on findOneWindow)
   */
  getWindowById: (id: WindowType["windowId"]): WindowType | undefined => {
    return get().findOneWindow((window: WindowType) => window.windowId === id);
  },

  /**
   * Get a window by the nodeId it represents
   */
  getWindowByNodeId: (nodeId: string): WindowType | undefined => {
    return get().findOneWindow(
      (window: WindowType) => window.nodeId === nodeId
    );
  },

  /**
   * Get all windows of a specific node type
   */
  getWindowsByNodeType: (nodeType: string): WindowType[] => {
    return get().findManyWindows(
      (window: WindowType) => window.nodeType === nodeType
    );
  },

  /**
   * Update a window by its ID (builds on updateOneWindow)
   */
  updateWindowById: (
    windowId: WindowType["windowId"],
    updates: Partial<WindowType>
  ): boolean => {
    console.log("updateWindowById: updating window", windowId, "with", updates);
    return get().updateOneWindow(
      (window: WindowType) => window.windowId === windowId,
      updates
    );
  },

  /**
   * Delete a window by its ID (builds on deleteOneWindow)
   */
  deleteWindowById: (windowId: WindowType["windowId"]): boolean => {
    console.log("deleteWindowById: deleting window", windowId);
    return get().deleteOneWindow(
      (window: WindowType) => window.windowId === windowId
    );
  },

  /**
   * Focus a window by bringing it to the front (update zIndex)
   */
  focusWindow: (windowId: WindowType["windowId"]): boolean => {
    console.log("focusWindow: focusing window", windowId);

    const state = get();
    const window = state.findOneWindow(
      (w: WindowType) => w.windowId === windowId
    );

    if (!window) {
      console.log("focusWindow: window not found", windowId);
      return false;
    }

    return state.updateOneWindow((w: WindowType) => w.windowId === windowId, {
      zIndex: state.nextZIndex,
    });
  },

  /**
   * Resize a window to specific dimensions
   */
  resizeWindow: (
    windowId: WindowType["windowId"],
    width: number,
    height: number
  ): boolean => {
    console.log(
      "resizeWindow: resizing window",
      windowId,
      "to",
      width,
      "x",
      height
    );

    return get().updateOneWindow(
      (window: WindowType) => window.windowId === windowId,
      {
        width,
        height,
      }
    );
  },

  /**
   * Move a window to specific coordinates
   */
  moveWindow: (
    windowId: WindowType["windowId"],
    x: number,
    y: number
  ): boolean => {
    console.log("moveWindow: moving window", windowId, "to", x, ",", y);

    return get().updateOneWindow(
      (window: WindowType) => window.windowId === windowId,
      {
        x,
        y,
      }
    );
  },

  /**
   * Set window bounds (position + size) in one operation
   */
  setWindowBounds: (
    windowId: WindowType["windowId"],
    bounds: { x: number; y: number; width: number; height: number }
  ): boolean => {
    console.log("setWindowBounds: setting bounds for window", windowId, bounds);

    return get().updateOneWindow(
      (window: WindowType) => window.windowId === windowId,
      bounds
    );
  },

  /**
   * Open a new window for a node (always creates new window)
   */
  openWindow: (nodeId: WindowedNode["id"]): void => {
    console.log("openWindow: creating new window for nodeId", nodeId);

    const state = get();
    const node = state.getNodeByID(nodeId);

    if (!node) {
      console.log("openWindow: node not found", nodeId);
      return;
    }

    // Create new window with default position
    const baseWindow: WindowType = {
      windowId: `window-${nodeId}-${Date.now()}`, // Unique window ID
      title: node.label,
      nodeId,
      nodeType: node.type,
      width: 800,
      height: 600,
      x: 100, // Default X position
      y: 100, // Default Y position
      zIndex: state.nextZIndex,
      isMinimized: false,
      isMaximized: false,
      isResizing: false,
    };

    // Initialize directory-specific properties for directory windows
    if (node.type === "directory") {
      baseWindow.currentPath = nodeId; // Use nodeId as the initial path
      baseWindow.navigationHistory = [nodeId]; // Start with current directory in history
      baseWindow.currentHistoryIndex = 0;
      baseWindow.canGoBack = false; // Initially can't go back
      baseWindow.canGoForward = false; // Initially can't go forward
    }

    state.createOneWindow(baseWindow);
  },

  /**
   * Focus an existing window by nodeId
   */
  focusWindowByNodeId: (nodeId: WindowedNode["id"]): boolean => {
    console.log("focusWindowByNodeId: focusing window for nodeId", nodeId);

    const state = get();
    const existingWindow = state.findOneWindow(
      (window: WindowType) => window.nodeId === nodeId
    );

    if (!existingWindow) {
      console.log("focusWindowByNodeId: no window found for nodeId", nodeId);
      return false;
    }

    return state.updateOneWindow(
      (window: WindowType) => window.windowId === existingWindow.windowId,
      { zIndex: state.nextZIndex }
    );
  },

  /**
   * Open a new window for a node, or focus existing one (uses openWindow + focusWindowByNodeId)
   */
  openOrFocusWindow: (nodeId: WindowedNode["id"]): void => {
    console.log("openOrFocusWindow: handling nodeId", nodeId);

    const store = get();

    // Check if window already exists for this node
    const windowExists = store.windowExists(
      (window: WindowType) => window.nodeId === nodeId
    );

    if (windowExists) {
      // Focus existing window
      console.log("openOrFocusWindow: focusing existing window", nodeId);
      const existingWindow = store.findOneWindow(
        (window: WindowType) => window.nodeId === nodeId
      );
      if (existingWindow) {
        store.updateOneWindow(
          (window: WindowType) => window.windowId === existingWindow.windowId,
          { zIndex: store.nextZIndex }
        );
      }
    } else {
      // Create new window
      console.log("openOrFocusWindow: creating new window", nodeId);
      const node = store.getNodeByID(nodeId);

      if (!node) {
        console.log("openOrFocusWindow: node not found", nodeId);
        return;
      }

      // Create new window with default position
      const baseWindow: WindowType = {
        windowId: `window-${nodeId}-${Date.now()}`,
        title: node.label,
        nodeId,
        nodeType: node.type,
        width: 800,
        height: 600,
        x: 100,
        y: 100,
        zIndex: store.nextZIndex,
        isMinimized: false,
        isMaximized: false,
        isResizing: false,
      };

      // Initialize directory-specific properties for directory windows
      if (node.type === "directory") {
        baseWindow.currentPath = nodeId;
        baseWindow.navigationHistory = [nodeId];
        baseWindow.currentHistoryIndex = 0;
        baseWindow.canGoBack = false;
        baseWindow.canGoForward = false;
      }

      store.createOneWindow(baseWindow);
    }
  },

  /**
   * Close a window (alias for deleteWindowById for API consistency)
   */
  closeWindow: (windowId: WindowType["windowId"]): void => {
    console.log("closeWindow: closing window", windowId);
    get().deleteOneWindow((window: WindowType) => window.windowId === windowId);
  },

  /**
   * Minimize a window
   */
  minimizeWindow: (windowId: WindowType["windowId"]): boolean => {
    console.log("minimizeWindow: minimizing window", windowId);

    return get().updateOneWindow(
      (window: WindowType) => window.windowId === windowId,
      {
        isMinimized: true,
        isMaximized: false,
      }
    );
  },

  /**
   * Maximize a window
   */
  maximizeWindow: (windowId: WindowType["windowId"]): boolean => {
    console.log("maximizeWindow: maximizing window", windowId);

    return get().updateOneWindow(
      (window: WindowType) => window.windowId === windowId,
      {
        isMaximized: true,
        isMinimized: false,
      }
    );
  },

  /**
   * Restore a window to normal state
   */
  // ! UNUSED
  restoreWindow: (windowId: WindowType["windowId"]): boolean => {
    console.log("restoreWindow: restoring window", windowId);

    return get().updateOneWindow(
      (window: WindowType) => window.windowId === windowId,
      {
        isMaximized: false,
        isMinimized: false,
      }
    );
  },

  /**
   * Toggle minimized state of a window
   */
  // ! UNUSED
  toggleMinimized: (windowId: WindowType["windowId"]): boolean => {
    console.log(
      "toggleMinimized: toggling minimized state for window",
      windowId
    );

    const window = get().findOneWindow(
      (w: WindowType) => w.windowId === windowId
    );
    if (!window) return false;

    const newMinimizedState = !window.isMinimized;
    return get().updateOneWindow((w: WindowType) => w.windowId === windowId, {
      isMinimized: newMinimizedState,
      isMaximized: false,
    });
  },

  /**
   * Check if a window is open for a specific node
   */
  isWindowOpen: (nodeId: string): boolean => {
    return get().windowExists((window: WindowType) => window.nodeId === nodeId);
  },

  /**
   * Get the window with the highest zIndex (topmost)
   */
  getTopWindow: (): WindowType | undefined => {
    const state = get();
    if (state.openWindows.length === 0) return undefined;

    return state.openWindows.reduce((topWindow, currentWindow) =>
      currentWindow.zIndex > topWindow.zIndex ? currentWindow : topWindow
    );
  },

  /**
   * Bring a window to the front (calls focusWindow internally)
   */
});
