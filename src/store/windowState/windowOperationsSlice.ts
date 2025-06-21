import type { WindowType } from "../../types/storeTypes";
import type { SetState, GetState } from "../../types/storeTypes";
import type { WindowCrudSlice } from "./windowCrudSlice";
import type { NodeEntry } from "../../types/nodeTypes";

export type WindowedNode = Exclude<NodeEntry, { type: "icon" | "link" }>;

export interface WindowOperationsActions {
  //   ! WINDOW VISIBILITY OPERATIONS
  openWindow: (node: WindowedNode, historyItem: string) => void;
  closeWindow: (windowId: WindowType["windowId"]) => void;
  focusWindow: (windowId: WindowType["windowId"]) => void;
  minimizeWindow: (windowId: WindowType["windowId"]) => boolean;
  maximizeWindow: (windowId: WindowType["windowId"]) => boolean;

  //   ! WINDOW FRAME OPERATIONS
  moveWindow: (
    windowId: WindowType["windowId"],
    x: number,
    y: number
  ) => boolean;
  resizeWindow: (
    windowId: WindowType["windowId"],
    width: number,
    height: number
  ) => boolean;

  setWindowBounds: (
    windowId: WindowType["windowId"],
    bounds: { x: number; y: number; width: number; height: number }
  ) => boolean;

  // ! WINDOW HISTORY OPERATIONS
  canGoBackInWindowHistory: (windowId: WindowType["windowId"]) => boolean;
  canGoForwardInWindowHistory: (windowId: WindowType["windowId"]) => boolean;
  decrementWindowHistoryIndex: (windowId: WindowType["windowId"]) => boolean;
  incrementWindowHistoryIndex: (windowId: WindowType["windowId"]) => boolean;
  getLocationInHistory: (windowId: WindowType["windowId"]) => string;

  // History navigation

  addToWindowHistory: (
    windowId: WindowType["windowId"],
    item: string
  ) => boolean;

  updateWindowById: (
    windowId: WindowType["windowId"],
    updates: Partial<WindowType>
  ) => boolean;

  // Window state management

  // Utility operations
  isWindowIdOpen: (nodeId: string) => boolean;
  // ID-based accessors (built from predicates)
  getWindowById: (id: WindowType["windowId"]) => WindowType | undefined;
  getWindowByNodeId: (nodeId: WindowType["nodeId"]) => WindowType | undefined;
}

export type WindowOperationsSlice = WindowCrudSlice & WindowOperationsActions;

// Window operations slice - builds ID-based operations from predicate-based CRUD
export const createWindowOperationsSlice = (
  set: SetState<WindowOperationsSlice>,
  get: GetState<WindowOperationsSlice>
): WindowOperationsActions => ({
  /**
   * Open a new window for a node
   */
  openWindow: (node: WindowedNode, historyItem: string): void => {
    const state = get();

    if (!node) {
      return;
    }

    const nodeId = node.id;

    // this ensures each additional window is offset to maintain visibility of all open windows
    const count = state.openWindows.length;
    const x = 100 * (count + 1);
    const y = 100 * (count + 1);

    let width = 600;
    let height = 400;

    if (node.type === "directory") {
      width = 600;
      height = 400;
    } else if (node.type === "browser") {
      width = 1000;
      height = 800;
    } else if (node.type === "terminal") {
      width = 1000;
      height = 600;
    }

    // Create new window with default position
    const baseWindow: WindowType = {
      windowId: `window-${nodeId}-${Date.now()}`, // Unique window ID
      title: node.label,
      nodeId,
      nodeType: node.type,
      width,
      height,
      x,
      y,
      zIndex: state.nextZIndex,
      isMinimized: false,
      isMaximized: false,
      isResizing: false,
      itemHistory: [historyItem],
      currentHistoryIndex: 0,
    };

    state.createOneWindow(baseWindow);
  },

  /**
   * Close a window (alias for deleteWindowById for API consistency)
   */
  closeWindow: (windowId: WindowType["windowId"]): void => {
    console.log("closeWindow: closing window", windowId);
    get().deleteOneWindow((window: WindowType) => window.windowId === windowId);
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
      return false;
    }

    return state.updateOneWindow((w: WindowType) => w.windowId === windowId, {
      zIndex: state.nextZIndex,
    });
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
  // TODO
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

  //   ! WINDOW FRAME OPERATIONS
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

  //   ! WINDOW HISTORY OPERATIONS
  canGoBackInWindowHistory: (windowId: WindowType["windowId"]): boolean => {
    const state = get();
    const window = state.getWindowById(windowId);
    return (window?.currentHistoryIndex ?? 0) > 0;
  },
  canGoForwardInWindowHistory: (windowId: WindowType["windowId"]): boolean => {
    const state = get();
    const window = state.getWindowById(windowId);
    return (
      (window?.currentHistoryIndex ?? 0) <
      (window?.itemHistory?.length ?? 0) - 1
    );
  },
  /**
   * Navigate back in window's history - simple index decrement
   */
  decrementWindowHistoryIndex: (windowId: WindowType["windowId"]): boolean => {
    // console.log("navigateBackInHistory: navigating back in window", windowId);

    const state = get();
    const window = state.getWindowById(windowId);

    if (!window) {
      console.log("navigateBackInHistory: window not found", windowId);
      return false;
    }

    const { itemHistory, currentHistoryIndex } = window;

    if (currentHistoryIndex <= 0 || itemHistory.length === 0) {
      // console.log("navigateBackInHistory: cannot go back", windowId);
      return false;
    }

    // Simple index decrement
    const newIndex = currentHistoryIndex - 1;

    return state.updateWindowById(windowId, {
      currentHistoryIndex: newIndex,
    });
  },

  /**
   * Navigate forward in window's history - simple index increment
   */
  incrementWindowHistoryIndex: (windowId: WindowType["windowId"]): boolean => {
    console.log("goForwardInHistory: navigating forward in window", windowId);

    const state = get();
    const window = state.getWindowById(windowId);

    if (!window) {
      console.log("navigateForwardInHistory: window not found", windowId);
      return false;
    }

    const { itemHistory, currentHistoryIndex } = window;

    if (currentHistoryIndex >= itemHistory.length - 1) {
      console.log("navigateForwardInHistory: cannot go forward", windowId);
      return false;
    }

    // Simple index increment
    const newIndex = currentHistoryIndex + 1;

    return state.updateWindowById(windowId, {
      currentHistoryIndex: newIndex,
    });
  },
  getLocationInHistory: (windowId: WindowType["windowId"]): string => {
    const state = get();
    const window = state.getWindowById(windowId);
    return window?.itemHistory[window?.currentHistoryIndex ?? 0] ?? "";
  },

  /**
   * Add item to window's history and navigate to it
   */
  addToWindowHistory: (
    windowId: WindowType["windowId"],
    item: string
  ): boolean => {
    console.log(
      "addToWindowHistory: adding item to window",
      windowId,
      "item:",
      item
    );

    const state = get();
    const window = state.getWindowById(windowId);

    if (!window) {
      console.log("addToWindowHistory: window not found", windowId);
      return false;
    }

    const currentHistory = window.itemHistory || [];
    const currentIndex = window.currentHistoryIndex ?? -1;

    // Add to history and navigate (remove any forward history if we're in the middle)
    const newHistory = [...currentHistory.slice(0, currentIndex + 1), item];
    const newIndex = newHistory.length - 1;

    return state.updateWindowById(windowId, {
      itemHistory: newHistory,
      currentHistoryIndex: newIndex,
    });
  },

  /**
   * Check if a window is open for a specific node
   */
  isWindowIdOpen: (nodeId: string): boolean => {
    return get().windowExists((window: WindowType) => window.nodeId === nodeId);
  },

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
});
