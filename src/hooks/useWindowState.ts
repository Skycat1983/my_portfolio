import { useNewStore } from "./useStore";
import type { WindowType } from "../types/storeTypes";

/**
 * Generic hook for accessing window-specific state and history operations
 * Works with any window type (browser, terminal, directory, etc.)
 */
export const useWindowState = (windowId: string) => {
  // Window data
  const window = useNewStore((state) => state.getWindowById(windowId));
  const openWindow = useNewStore((state) => state.openWindow);
  const closeWindow = useNewStore((state) => state.closeWindow);
  const focusWindow = useNewStore((state) => state.focusWindow);
  const minimizeWindow = useNewStore((state) => state.minimizeWindow);
  const maximizeWindow = useNewStore((state) => state.maximizeWindow);
  const moveWindow = useNewStore((state) => state.moveWindow);
  const resizeWindow = useNewStore((state) => state.resizeWindow);
  const setWindowBounds = useNewStore((state) => state.setWindowBounds);
  const canGoBackInHistory = useNewStore((state) => state.canGoBackInHistory);
  const canGoForwardInHistory = useNewStore(
    (state) => state.canGoForwardInHistory
  );
  const goBackInHistory = useNewStore((state) => state.goBackInHistory);
  const goForwardInHistory = useNewStore((state) => state.goForwardInHistory);
  const getLocationInHistory = useNewStore(
    (state) => state.getLocationInHistory
  );
  const addToWindowHistory = useNewStore((state) => state.addToWindowHistory);
  const updateWindowById = useNewStore((state) => state.updateWindowById);
  const isWindowIdOpen = useNewStore((state) => state.isWindowIdOpen);
  const getWindowById = useNewStore((state) => state.getWindowById);
  const getWindowByNodeId = useNewStore((state) => state.getWindowByNodeId);

  return {};
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
  const window = useNewStore((state) => state.getWindowById(windowId));
  const openWindow = useNewStore((state) => state.openWindow);
  const closeWindow = useNewStore((state) => state.closeWindow);
  const focusWindow = useNewStore((state) => state.focusWindow);
  const minimizeWindow = useNewStore((state) => state.minimizeWindow);
  const maximizeWindow = useNewStore((state) => state.maximizeWindow);
  const moveWindow = useNewStore((state) => state.moveWindow);
  const resizeWindow = useNewStore((state) => state.resizeWindow);
  const setWindowBounds = useNewStore((state) => state.setWindowBounds);
  const canGoBackInHistory = useNewStore((state) => state.canGoBackInHistory);
  const canGoForwardInHistory = useNewStore(
    (state) => state.canGoForwardInHistory
  );
  const goBackInHistory = useNewStore((state) => state.goBackInHistory);
  const goForwardInHistory = useNewStore((state) => state.goForwardInHistory);
  const getLocationInHistory = useNewStore(
    (state) => state.getLocationInHistory
  );
  const addToWindowHistory = useNewStore((state) => state.addToWindowHistory);
  const updateWindowById = useNewStore((state) => state.updateWindowById);
  const isWindowIdOpen = useNewStore((state) => state.isWindowIdOpen);
  const getWindowById = useNewStore((state) => state.getWindowById);
  const getWindowByNodeId = useNewStore((state) => state.getWindowByNodeId);

  const handleBackClick = () => {
    if (canGoBackInHistory(windowId)) {
      goBackInHistory(windowId);
    }
  };

  const handleForwardClick = () => {
    if (canGoForwardInHistory(windowId)) {
      goForwardInHistory(windowId);
    }
  };

  const handleOpenDirectory = (directoryId: DirectoryEntry["id"]) => {
    if (isWindowIdOpen(directoryId)) {
      focusWindow(directoryId);
    } else {
      openWindow(directoryId, directoryId);
    }
  };

  return {};
};
