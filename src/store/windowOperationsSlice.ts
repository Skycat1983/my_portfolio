import type { Window } from "../types/storeTypes";
import type { SetState, GetState } from "../types/storeTypes";
import type { WindowCrudSlice } from "./windowCrudSlice";
import type { NodeOperationsSlice } from "./nodeOperationsSlice";
import type { NodeEntry } from "../types/nodeTypes";

export type WindowedNode = Exclude<NodeEntry, { type: "icon" | "link" }>;

// Store interface that includes both window and node operations
interface StoreWithWindowAndNodeOps
  extends WindowCrudSlice,
    NodeOperationsSlice {}

export interface WindowOperationsActions {
  // ID-based accessors (built from predicates)
  getWindowById: (id: Window["id"]) => Window | undefined;
  getWindowByNodeId: (nodeId: string) => Window | undefined;
  getWindowsByNodeType: (nodeType: string) => Window[];

  // ID-based operations (built from predicates)
  updateWindowById: (
    windowId: Window["id"],
    updates: Partial<Window>
  ) => boolean;
  deleteWindowById: (windowId: Window["id"]) => boolean;

  // Business operations (combine multiple CRUD operations)
  focusWindow: (windowId: Window["id"]) => boolean;
  resizeWindow: (
    windowId: Window["id"],
    width: number,
    height: number
  ) => boolean;
  moveWindow: (windowId: Window["id"], x: number, y: number) => boolean;
  setWindowBounds: (
    windowId: Window["id"],
    bounds: { x: number; y: number; width: number; height: number }
  ) => boolean;

  // Complex business operations
  openOrFocusWindow: (nodeId: WindowedNode["id"]) => void;
  closeWindow: (windowId: Window["id"]) => void;

  // Window state management
  minimizeWindow: (windowId: Window["id"]) => boolean;
  maximizeWindow: (windowId: Window["id"]) => boolean;
  restoreWindow: (windowId: Window["id"]) => boolean;
  toggleMinimized: (windowId: Window["id"]) => boolean;

  // Utility operations
  isWindowOpen: (nodeId: string) => boolean;
  getTopWindow: () => Window | undefined;
  bringToFront: (windowId: Window["id"]) => boolean;
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
  getWindowById: (id: Window["id"]): Window | undefined => {
    return get().findOneWindow((window: Window) => window.id === id);
  },

  /**
   * Get a window by the nodeId it represents
   */
  getWindowByNodeId: (nodeId: string): Window | undefined => {
    return get().findOneWindow((window: Window) => window.nodeId === nodeId);
  },

  /**
   * Get all windows of a specific node type
   */
  getWindowsByNodeType: (nodeType: string): Window[] => {
    return get().findManyWindows(
      (window: Window) => window.nodeType === nodeType
    );
  },

  /**
   * Update a window by its ID (builds on updateOneWindow)
   */
  updateWindowById: (
    windowId: Window["id"],
    updates: Partial<Window>
  ): boolean => {
    console.log("updateWindowById: updating window", windowId, "with", updates);
    return get().updateOneWindow(
      (window: Window) => window.id === windowId,
      updates
    );
  },

  /**
   * Delete a window by its ID (builds on deleteOneWindow)
   */
  deleteWindowById: (windowId: Window["id"]): boolean => {
    console.log("deleteWindowById: deleting window", windowId);
    return get().deleteOneWindow((window: Window) => window.id === windowId);
  },

  /**
   * Focus a window by bringing it to the front (update zIndex)
   */
  focusWindow: (windowId: Window["id"]): boolean => {
    console.log("focusWindow: focusing window", windowId);

    const state = get();
    const window = state.findOneWindow((w: Window) => w.id === windowId);

    if (!window) {
      console.log("focusWindow: window not found", windowId);
      return false;
    }

    return state.updateOneWindow((w: Window) => w.id === windowId, {
      zIndex: state.nextZIndex,
    });
  },

  /**
   * Resize a window to specific dimensions
   */
  resizeWindow: (
    windowId: Window["id"],
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

    return get().updateOneWindow((window: Window) => window.id === windowId, {
      width,
      height,
    });
  },

  /**
   * Move a window to specific coordinates
   */
  moveWindow: (windowId: Window["id"], x: number, y: number): boolean => {
    console.log("moveWindow: moving window", windowId, "to", x, ",", y);

    return get().updateOneWindow((window: Window) => window.id === windowId, {
      x,
      y,
    });
  },

  /**
   * Set window bounds (position + size) in one operation
   */
  setWindowBounds: (
    windowId: Window["id"],
    bounds: { x: number; y: number; width: number; height: number }
  ): boolean => {
    console.log("setWindowBounds: setting bounds for window", windowId, bounds);

    return get().updateOneWindow(
      (window: Window) => window.id === windowId,
      bounds
    );
  },

  /**
   * Open a new window for a node, or focus existing one
   * This is the complex business logic from your original openWindow
   */
  openOrFocusWindow: (nodeId: WindowedNode["id"]): void => {
    console.log("openOrFocusWindow: handling nodeId", nodeId);

    const state = get();
    const node = state.getNodeByID(nodeId);

    if (!node) {
      console.log("openOrFocusWindow: node not found", nodeId);
      return;
    }

    // Check if window already exists for this node
    const existingWindow = state.findOneWindow(
      (window: Window) => window.nodeId === nodeId
    );

    if (existingWindow) {
      // Focus existing window instead of creating new one
      console.log("openOrFocusWindow: focusing existing window", nodeId);
      state.updateOneWindow(
        (window: Window) => window.id === existingWindow.id,
        { zIndex: state.nextZIndex }
      );
      return;
    }

    // Create new window with default position
    const newWindow: Window = {
      id: `window-${nodeId}-${Date.now()}`, // Unique window ID
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

    state.createOneWindow(newWindow);
  },

  /**
   * Close a window (alias for deleteWindowById for API consistency)
   */
  closeWindow: (windowId: Window["id"]): void => {
    console.log("closeWindow: closing window", windowId);
    get().deleteOneWindow((window: Window) => window.id === windowId);
  },

  /**
   * Minimize a window
   */
  minimizeWindow: (windowId: Window["id"]): boolean => {
    console.log("minimizeWindow: minimizing window", windowId);

    return get().updateOneWindow((window: Window) => window.id === windowId, {
      isMinimized: true,
      isMaximized: false,
    });
  },

  /**
   * Maximize a window
   */
  maximizeWindow: (windowId: Window["id"]): boolean => {
    console.log("maximizeWindow: maximizing window", windowId);

    return get().updateOneWindow((window: Window) => window.id === windowId, {
      isMaximized: true,
      isMinimized: false,
    });
  },

  /**
   * Restore a window to normal state
   */
  restoreWindow: (windowId: Window["id"]): boolean => {
    console.log("restoreWindow: restoring window", windowId);

    return get().updateOneWindow((window: Window) => window.id === windowId, {
      isMaximized: false,
      isMinimized: false,
    });
  },

  /**
   * Toggle minimized state of a window
   */
  toggleMinimized: (windowId: Window["id"]): boolean => {
    console.log(
      "toggleMinimized: toggling minimized state for window",
      windowId
    );

    const window = get().findOneWindow((w: Window) => w.id === windowId);
    if (!window) return false;

    const newMinimizedState = !window.isMinimized;
    return get().updateOneWindow((w: Window) => w.id === windowId, {
      isMinimized: newMinimizedState,
      isMaximized: false,
    });
  },

  /**
   * Check if a window is open for a specific node
   */
  isWindowOpen: (nodeId: string): boolean => {
    return get().windowExists((window: Window) => window.nodeId === nodeId);
  },

  /**
   * Get the window with the highest zIndex (topmost)
   */
  getTopWindow: (): Window | undefined => {
    const state = get();
    if (state.openWindows.length === 0) return undefined;

    return state.openWindows.reduce((topWindow, currentWindow) =>
      currentWindow.zIndex > topWindow.zIndex ? currentWindow : topWindow
    );
  },

  /**
   * Bring a window to the front (calls focusWindow internally)
   */
  bringToFront: (windowId: Window["id"]): boolean => {
    console.log("bringToFront: bringing window to front", windowId);

    const state = get();
    return state.updateOneWindow((w: Window) => w.id === windowId, {
      zIndex: state.nextZIndex,
    });
  },
});
