import type { SetState, GetState, WindowType } from "../../types/storeTypes";
import type { WindowOperationsSlice } from "./windowOperationsSlice";

export interface WindowHistoryActions {
  // Generic history navigation operations that work for any window type
  navigateBackInHistory: (windowId: string) => boolean;
  navigateForwardInHistory: (windowId: string) => boolean;

  // Generic history management
  addToWindowHistory: (windowId: string, item: string) => boolean;
  setCurrentWindowItem: (windowId: string, item: string) => boolean;
  clearWindowHistory: (windowId: string) => boolean;

  // History state helpers
  getWindowHistory: (windowId: string) => string[];
  getWindowHistoryIndex: (windowId: string) => number;
  getWindowCurrentItem: (windowId: string) => string | undefined;

  // Initialize history for a window (called during window creation)
  initializeWindowHistory: (windowId: string, initialItem?: string) => boolean;
}

export type WindowHistorySlice = WindowHistoryActions;

export const createWindowHistorySlice = (
  set: SetState<WindowOperationsSlice>,
  get: GetState<WindowOperationsSlice>
): WindowHistorySlice => ({
  /**
   * Navigate back in window's history
   */
  navigateBackInHistory: (windowId: WindowType["windowId"]): boolean => {
    console.log("navigateBackInHistory: navigating back in window", windowId);

    const state = get();
    const window = state.getWindowById(windowId);

    if (!window) {
      console.log("navigateBackInHistory: window not found", windowId);
      return false;
    }

    // Safety check: initialize history properties if they don't exist
    const currentHistory = window.itemHistory || [];
    const currentIndex = window.currentHistoryIndex ?? -1;
    const canGoBack = window.canGoBack ?? false;

    if (!canGoBack || currentIndex <= 0 || currentHistory.length === 0) {
      console.log("navigateBackInHistory: cannot go back", windowId);
      return false;
    }

    const newIndex = currentIndex - 1;
    const newItem = currentHistory[newIndex];

    return state.updateWindowById(windowId, {
      currentHistoryIndex: newIndex,
      currentItem: newItem,
      canGoBack: newIndex > 0,
      canGoForward: true,
    });
  },

  /**
   * Navigate forward in window's history
   */
  navigateForwardInHistory: (windowId: WindowType["windowId"]): boolean => {
    console.log(
      "navigateForwardInHistory: navigating forward in window",
      windowId
    );

    const state = get();
    const window = state.getWindowById(windowId);

    if (!window) {
      console.log("navigateForwardInHistory: window not found", windowId);
      return false;
    }

    // Safety check: initialize history properties if they don't exist
    const currentHistory = window.itemHistory || [];
    const currentIndex = window.currentHistoryIndex ?? -1;
    const canGoForward = window.canGoForward ?? false;

    if (!canGoForward || currentIndex >= currentHistory.length - 1) {
      console.log("navigateForwardInHistory: cannot go forward", windowId);
      return false;
    }

    const newIndex = currentIndex + 1;
    const newItem = currentHistory[newIndex];

    return state.updateWindowById(windowId, {
      currentHistoryIndex: newIndex,
      currentItem: newItem,
      canGoBack: true,
      canGoForward: newIndex < currentHistory.length - 1,
    });
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

    // Safety check: initialize history properties if they don't exist
    const currentHistory = window.itemHistory || [];
    const currentIndex = window.currentHistoryIndex ?? -1;

    // Add to history and navigate (remove any forward history if we're in the middle)
    const newHistory = [...currentHistory.slice(0, currentIndex + 1), item];
    const newIndex = newHistory.length - 1;

    return state.updateWindowById(windowId, {
      itemHistory: newHistory,
      currentHistoryIndex: newIndex,
      currentItem: item,
      canGoBack: newIndex > 0,
      canGoForward: false,
    });
  },

  /**
   * Set current item without adding to history (for direct navigation)
   */
  setCurrentWindowItem: (
    windowId: WindowType["windowId"],
    item: string
  ): boolean => {
    console.log(
      "setCurrentWindowItem: setting current item for window",
      windowId,
      "item:",
      item
    );

    const state = get();
    const window = state.getWindowById(windowId);

    if (!window) {
      console.log("setCurrentWindowItem: window not found", windowId);
      return false;
    }

    return state.updateWindowById(windowId, {
      currentItem: item,
    });
  },

  /**
   * Clear window's history
   */
  clearWindowHistory: (windowId: WindowType["windowId"]): boolean => {
    console.log("clearWindowHistory: clearing history for window", windowId);

    const state = get();
    const window = state.getWindowById(windowId);

    if (!window) {
      console.log("clearWindowHistory: window not found", windowId);
      return false;
    }

    return state.updateWindowById(windowId, {
      itemHistory: [],
      currentHistoryIndex: -1,
      currentItem: undefined,
      canGoBack: false,
      canGoForward: false,
    });
  },

  /**
   * Get window's history array
   */
  getWindowHistory: (windowId: WindowType["windowId"]): string[] => {
    const state = get();
    const window = state.getWindowById(windowId);
    return window?.itemHistory || [];
  },

  /**
   * Get window's current history index
   */
  getWindowHistoryIndex: (windowId: WindowType["windowId"]): number => {
    const state = get();
    const window = state.getWindowById(windowId);
    return window?.currentHistoryIndex ?? -1;
  },

  /**
   * Get window's current item
   */
  getWindowCurrentItem: (
    windowId: WindowType["windowId"]
  ): string | undefined => {
    const state = get();
    const window = state.getWindowById(windowId);
    return window?.currentItem;
  },

  /**
   * Initialize history for a window (called during window creation)
   */
  initializeWindowHistory: (
    windowId: WindowType["windowId"],
    initialItem?: string
  ): boolean => {
    console.log(
      "initializeWindowHistory: initializing history for window",
      windowId,
      "with item:",
      initialItem
    );

    const state = get();
    const window = state.getWindowById(windowId);

    if (!window) {
      console.log("initializeWindowHistory: window not found", windowId);
      return false;
    }

    // Initialize with empty history or single item
    const initialHistory = initialItem ? [initialItem] : [];
    const initialIndex = initialItem ? 0 : -1;

    return state.updateWindowById(windowId, {
      itemHistory: initialHistory,
      currentHistoryIndex: initialIndex,
      currentItem: initialItem,
      canGoBack: false,
      canGoForward: false,
    });
  },
});
