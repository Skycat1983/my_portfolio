import { useCallback, useEffect } from "react";
import { useNewStore } from "@/hooks/useStore";

interface UseBrowserHistoryReturn {
  // Navigation methods
  navigateToUrl: (url: string) => boolean;
  goBack: () => boolean;
  goForward: () => boolean;
  goToIndex: (index: number) => boolean;

  // Query methods
  canGoBack: boolean;
  canGoForward: boolean;
  currentUrl: string | undefined;
  historyLength: number;

  // History state
  historyItems: string[];
  currentIndex: number;
}

/**
 * Custom hook for managing browser navigation history
 * Coordinates between the generic history slice and window state
 */
export const useBrowserHistory = (
  windowId: string
): UseBrowserHistoryReturn => {
  const historyId = `browser-${windowId}`;

  // Get current window
  const window = useNewStore((state) => state.getWindowById(windowId));

  // History slice actions
  const createHistory = useNewStore((state) => state.createHistory);
  const historyExists = useNewStore((state) => state.historyExists);
  const addToHistory = useNewStore((state) => state.addToHistory);
  const goBackInHistory = useNewStore((state) => state.goBack);
  const goForwardInHistory = useNewStore((state) => state.goForward);
  const goToIndexInHistory = useNewStore((state) => state.goToIndex);
  const canGoBackInHistory = useNewStore((state) => state.canGoBack);
  const canGoForwardInHistory = useNewStore((state) => state.canGoForward);
  const getCurrentItem = useNewStore((state) => state.getCurrentItem);
  const getCurrentIndex = useNewStore((state) => state.getCurrentIndex);
  const getHistoryItems = useNewStore((state) => state.getHistoryItems);
  const getHistoryLength = useNewStore((state) => state.getHistoryLength);

  // Window slice actions
  const updateWindowById = useNewStore((state) => state.updateWindowById);

  console.log("useBrowserHistory: initializing for windowId", windowId);

  // Initialize history instance when hook is first used
  useEffect(() => {
    if (!historyExists(historyId) && window) {
      // Initialize with current window URL or empty string for start page
      const initialUrl = window.url || "";
      console.log(
        "useBrowserHistory: initializing history for",
        historyId,
        "with url:",
        initialUrl
      );
      createHistory(historyId, initialUrl);
    }
  }, [historyId, window?.url, historyExists, createHistory, window]);

  // Get current history state
  const currentUrl = getCurrentItem(historyId) as string | undefined;
  const currentIndex = getCurrentIndex(historyId);
  const historyItems = getHistoryItems(historyId) as string[];
  const historyLength = getHistoryLength(historyId);
  const canGoBack = canGoBackInHistory(historyId);
  const canGoForward = canGoForwardInHistory(historyId);

  console.log("useBrowserHistory: canGoBack", canGoBack);
  console.log("useBrowserHistory: canGoForward", canGoForward);
  console.log("useBrowserHistory: currentUrl", currentUrl);
  console.log("useBrowserHistory: historyLength", historyLength);
  console.log("useBrowserHistory: historyItems", historyItems);
  console.log("useBrowserHistory: currentIndex", currentIndex);

  /**
   * Navigate to a specific URL and update both history and window
   */
  const navigateToUrl = useCallback(
    (url: string): boolean => {
      console.log(
        "useBrowserHistory: navigateToUrl",
        url,
        "in window",
        windowId
      );

      if (!window) {
        console.log("useBrowserHistory: no window found for", windowId);
        return false;
      }

      // Add to history first
      const historySuccess = addToHistory(historyId, url);
      if (!historySuccess) {
        console.log("useBrowserHistory: failed to add to history", historyId);
        return false;
      }

      // Update window URL and title atomically
      const windowSuccess = updateWindowById(windowId, {
        url,
        title: url ? `Internet - ${url}` : "Internet",
      });

      if (!windowSuccess) {
        console.log("useBrowserHistory: failed to update window", windowId);
        return false;
      }

      console.log("useBrowserHistory: successfully navigated to", url);
      return true;
    },
    [historyId, windowId, window, addToHistory, updateWindowById]
  );

  /**
   * Navigate back in history
   */
  const goBack = useCallback((): boolean => {
    console.log("useBrowserHistory: goBack in", historyId);

    if (!canGoBack) {
      console.log("useBrowserHistory: cannot go back");
      return false;
    }

    // Navigate back in history
    const historySuccess = goBackInHistory(historyId);
    if (!historySuccess) {
      console.log("useBrowserHistory: failed to go back in history");
      return false;
    }

    // Get the new current item after going back
    const newUrl = getCurrentItem(historyId) as string;
    console.log("useBrowserHistory: going back to URL:", newUrl);

    // Update window to reflect new current location
    const windowSuccess = updateWindowById(windowId, {
      url: newUrl,
      title: newUrl ? `Internet - ${newUrl}` : "Internet",
    });

    if (!windowSuccess) {
      console.log(
        "useBrowserHistory: failed to update window after going back"
      );
      return false;
    }

    console.log("useBrowserHistory: successfully went back to", newUrl);
    return true;
  }, [
    historyId,
    canGoBack,
    goBackInHistory,
    getCurrentItem,
    updateWindowById,
    windowId,
  ]);

  /**
   * Navigate forward in history
   */
  const goForward = useCallback((): boolean => {
    console.log("useBrowserHistory: goForward in", historyId);

    if (!canGoForward) {
      console.log("useBrowserHistory: cannot go forward");
      return false;
    }

    // Navigate forward in history
    const historySuccess = goForwardInHistory(historyId);
    if (!historySuccess) {
      console.log("useBrowserHistory: failed to go forward in history");
      return false;
    }

    // Get the new current item after going forward
    const newUrl = getCurrentItem(historyId) as string;
    console.log("useBrowserHistory: going forward to URL:", newUrl);

    // Update window to reflect new current location
    const windowSuccess = updateWindowById(windowId, {
      url: newUrl,
      title: newUrl ? `Internet - ${newUrl}` : "Internet",
    });

    if (!windowSuccess) {
      console.log(
        "useBrowserHistory: failed to update window after going forward"
      );
      return false;
    }

    console.log("useBrowserHistory: successfully went forward to", newUrl);
    return true;
  }, [
    historyId,
    canGoForward,
    goForwardInHistory,
    getCurrentItem,
    updateWindowById,
    windowId,
  ]);

  /**
   * Navigate to specific index in history
   */
  const goToIndex = useCallback(
    (index: number): boolean => {
      console.log("useBrowserHistory: goToIndex", index, "in", historyId);

      if (index < 0 || index >= historyLength) {
        console.log("useBrowserHistory: index out of bounds", index);
        return false;
      }

      // Navigate to specific index in history
      const historySuccess = goToIndexInHistory(historyId, index);
      if (!historySuccess) {
        console.log("useBrowserHistory: failed to go to index in history");
        return false;
      }

      // Get the current item at the new index
      const newUrl = getCurrentItem(historyId) as string;
      console.log("useBrowserHistory: going to index", index, "URL:", newUrl);

      // Update window to reflect new current location
      const windowSuccess = updateWindowById(windowId, {
        url: newUrl,
        title: newUrl ? `Internet - ${newUrl}` : "Internet",
      });

      if (!windowSuccess) {
        console.log(
          "useBrowserHistory: failed to update window after going to index"
        );
        return false;
      }

      console.log(
        "useBrowserHistory: successfully went to index",
        index,
        "url:",
        newUrl
      );
      return true;
    },
    [
      historyId,
      historyLength,
      goToIndexInHistory,
      getCurrentItem,
      updateWindowById,
      windowId,
    ]
  );

  return {
    // Navigation methods
    navigateToUrl,
    goBack,
    goForward,
    goToIndex,

    // Query methods
    canGoBack,
    canGoForward,
    currentUrl,
    historyLength,

    // History state
    historyItems,
    currentIndex,
  };
};
