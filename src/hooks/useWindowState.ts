import { useNewStore } from "./useStore";
import type { WindowType } from "../types/storeTypes";

/**
 * Generic hook for accessing window-specific state and history operations
 * Works with any window type (browser, terminal, directory, etc.)
 */
export const useWindowState = (windowId: string) => {
  // Window data
  const window = useNewStore((state) => state.getWindowById(windowId));

  // Generic history operations
  const navigateBackInHistory = useNewStore(
    (state) => state.navigateBackInHistory
  );
  const navigateForwardInHistory = useNewStore(
    (state) => state.navigateForwardInHistory
  );
  const addToWindowHistory = useNewStore((state) => state.addToWindowHistory);
  const setCurrentWindowItem = useNewStore(
    (state) => state.setCurrentWindowItem
  );
  const clearWindowHistory = useNewStore((state) => state.clearWindowHistory);
  const getWindowHistory = useNewStore((state) => state.getWindowHistory);
  const getWindowHistoryIndex = useNewStore(
    (state) => state.getWindowHistoryIndex
  );
  const getWindowCurrentItem = useNewStore(
    (state) => state.getWindowCurrentItem
  );
  const initializeWindowHistory = useNewStore(
    (state) => state.initializeWindowHistory
  );

  // Window operations
  const updateWindowById = useNewStore((state) => state.updateWindowById);
  const closeWindow = useNewStore((state) => state.closeWindow);
  const focusWindow = useNewStore((state) => state.focusWindow);

  // Derived state
  const history = window?.itemHistory || [];
  const historyIndex = window?.currentHistoryIndex ?? -1;
  const currentItem = window?.currentItem || "";
  const canGoBack = window?.canGoBack ?? false;
  const canGoForward = window?.canGoForward ?? false;

  // Convenience methods that operate on this specific window
  const windowOperations = {
    // Navigation
    goBack: () => navigateBackInHistory(windowId),
    goForward: () => navigateForwardInHistory(windowId),
    addToHistory: (item: string) => addToWindowHistory(windowId, item),
    setCurrentItem: (item: string) => setCurrentWindowItem(windowId, item),
    clearHistory: () => clearWindowHistory(windowId),
    initializeHistory: (initialItem?: string) =>
      initializeWindowHistory(windowId, initialItem),

    // Window management
    update: (updates: Partial<WindowType>) =>
      updateWindowById(windowId, updates),
    close: () => closeWindow(windowId),
    focus: () => focusWindow(windowId),

    // State getters
    getHistory: () => getWindowHistory(windowId),
    getHistoryIndex: () => getWindowHistoryIndex(windowId),
    getCurrentItem: () => getWindowCurrentItem(windowId),
  };

  return {
    // Window data
    window,
    windowId,

    // History state
    history,
    historyIndex,
    currentItem,
    canGoBack,
    canGoForward,

    // Operations
    ...windowOperations,
  };
};

/**
 * Type-safe hook for browser windows specifically
 */
export const useBrowserWindow = (windowId: string) => {
  const windowState = useWindowState(windowId);

  // Browser-specific derived state
  const url = windowState.currentItem || "";
  const urlHistory = windowState.history;
  const urlHistoryIndex = windowState.historyIndex;

  // Browser-specific operations
  const browserOperations = {
    setUrl: (url: string) => windowState.setCurrentItem(url),
    addUrlToHistory: (url: string) => windowState.addToHistory(url),
    navigateToUrl: (url: string) => {
      // Add to history and set as current
      windowState.addToHistory(url);
    },
    goBackToUrl: () => windowState.goBack(),
    goForwardToUrl: () => windowState.goForward(),
  };

  return {
    ...windowState,
    // Browser-specific state
    url,
    urlHistory,
    urlHistoryIndex,
    // Browser-specific operations
    ...browserOperations,
  };
};

/**
 * Type-safe hook for directory windows specifically
 */
export const useDirectoryWindow = (windowId: string) => {
  const windowState = useWindowState(windowId);

  // Directory-specific derived state
  const currentPath =
    windowState.currentItem || windowState.window?.currentPath || "";
  const pathHistory = windowState.history;
  const pathHistoryIndex = windowState.historyIndex;

  // Directory-specific operations
  const directoryOperations = {
    setPath: (path: string) => windowState.setCurrentItem(path),
    addPathToHistory: (path: string) => windowState.addToHistory(path),
    navigateToPath: (path: string) => {
      // Add to history and set as current
      windowState.addToHistory(path);
      // Also update legacy currentPath for backward compatibility
      windowState.update({ currentPath: path });
    },
    goBackToPath: () => {
      const success = windowState.goBack();
      if (success && windowState.window) {
        // Update legacy currentPath for backward compatibility
        windowState.update({ currentPath: windowState.getCurrentItem() });
      }
      return success;
    },
    goForwardToPath: () => {
      const success = windowState.goForward();
      if (success && windowState.window) {
        // Update legacy currentPath for backward compatibility
        windowState.update({ currentPath: windowState.getCurrentItem() });
      }
      return success;
    },
  };

  return {
    ...windowState,
    // Directory-specific state
    currentPath,
    pathHistory,
    pathHistoryIndex,
    // Directory-specific operations
    ...directoryOperations,
  };
};
