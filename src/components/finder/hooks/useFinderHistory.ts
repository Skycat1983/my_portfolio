import { useCallback, useEffect } from "react";
import { useNewStore } from "@/hooks/useStore";

interface UseFinderHistoryReturn {
  // Navigation methods
  navigateToNode: (nodeId: string) => boolean;
  goBack: () => boolean;
  goForward: () => boolean;
  goToIndex: (index: number) => boolean;

  // Query methods
  canGoBack: boolean;
  canGoForward: boolean;
  currentNodeId: string | undefined;
  historyLength: number;

  // History state
  historyItems: string[];
  currentIndex: number;
}

/**
 * Custom hook for managing finder navigation history
 * Coordinates between the generic history slice and window state
 */
export const useFinderHistory = (windowId: string): UseFinderHistoryReturn => {
  const historyId = `finder-${windowId}`;

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
  const getNodeByID = useNewStore((state) => state.getNodeByID);

  console.log("useFinderHistory: useFinderHistory", windowId);

  // Initialize history instance when hook is first used
  useEffect(() => {
    if (!historyExists(historyId) && window) {
      console.log(
        "useFinderHistory: initializing history for",
        historyId,
        "with nodeId:",
        window.nodeId
      );
      createHistory(historyId, window.nodeId);
    }
  }, [historyId, window?.nodeId, historyExists, createHistory, window]);

  // Get current history state
  const currentNodeId = getCurrentItem(historyId) as string | undefined;
  const currentIndex = getCurrentIndex(historyId);
  const historyItems = getHistoryItems(historyId) as string[];
  const historyLength = getHistoryLength(historyId);
  const canGoBack = canGoBackInHistory(historyId);
  const canGoForward = canGoForwardInHistory(historyId);

  console.log("useFinderHistory: canGoBack", canGoBack);
  console.log("useFinderHistory: canGoForward", canGoForward);
  console.log("useFinderHistory: currentNodeId", currentNodeId);
  console.log("useFinderHistory: historyLength", historyLength);
  console.log("useFinderHistory: historyItems", historyItems);
  console.log("useFinderHistory: currentIndex", currentIndex);

  /**
   * Navigate to a specific node and update both history and window
   */
  const navigateToNode = useCallback(
    (nodeId: string): boolean => {
      console.log(
        "useFinderHistory: navigateToNode",
        nodeId,
        "in window",
        windowId
      );

      if (!window) {
        console.log("useFinderHistory: no window found for", windowId);
        return false;
      }

      // Add to history first
      const historySuccess = addToHistory(historyId, nodeId);
      if (!historySuccess) {
        console.log("useFinderHistory: failed to add to history", historyId);
        return false;
      }

      // Get node information for title update
      const node = getNodeByID(nodeId);
      const nodeLabel = node?.label || nodeId;

      // Update window nodeId and title atomically
      const windowSuccess = updateWindowById(windowId, {
        nodeId,
        title: `Finder - ${nodeLabel}`,
      });

      if (!windowSuccess) {
        console.log("useFinderHistory: failed to update window", windowId);
        return false;
      }

      console.log("useFinderHistory: successfully navigated to", nodeId);
      return true;
    },
    [historyId, windowId, window, addToHistory, getNodeByID, updateWindowById]
  );

  /**
   * Navigate back in history
   */
  const goBack = useCallback((): boolean => {
    console.log("useFinderHistory: goBack in", historyId);

    if (!canGoBack) {
      console.log("useFinderHistory: cannot go back");
      return false;
    }

    // Navigate back in history
    const historySuccess = goBackInHistory(historyId);
    if (!historySuccess) {
      console.log("useFinderHistory: failed to go back in history");
      return false;
    }

    // Get the new current item after going back
    const newNodeId = getCurrentItem(historyId) as string;
    if (!newNodeId) {
      console.log("useFinderHistory: no current item after going back");
      return false;
    }

    // Get node information for title update
    const node = getNodeByID(newNodeId);
    const nodeLabel = node?.label || newNodeId;

    // Update window to reflect new current location
    const windowSuccess = updateWindowById(windowId, {
      nodeId: newNodeId,
      title: `Finder - ${nodeLabel}`,
    });

    if (!windowSuccess) {
      console.log("useFinderHistory: failed to update window after going back");
      return false;
    }

    console.log("useFinderHistory: successfully went back to", newNodeId);
    return true;
  }, [
    historyId,
    canGoBack,
    goBackInHistory,
    getCurrentItem,
    getNodeByID,
    updateWindowById,
    windowId,
  ]);

  /**
   * Navigate forward in history
   */
  const goForward = useCallback((): boolean => {
    console.log("useFinderHistory: goForward in", historyId);

    if (!canGoForward) {
      console.log("useFinderHistory: cannot go forward");
      return false;
    }

    // Navigate forward in history
    const historySuccess = goForwardInHistory(historyId);
    if (!historySuccess) {
      console.log("useFinderHistory: failed to go forward in history");
      return false;
    }

    // Get the new current item after going forward
    const newNodeId = getCurrentItem(historyId) as string;
    if (!newNodeId) {
      console.log("useFinderHistory: no current item after going forward");
      return false;
    }

    // Get node information for title update
    const node = getNodeByID(newNodeId);
    const nodeLabel = node?.label || newNodeId;

    // Update window to reflect new current location
    const windowSuccess = updateWindowById(windowId, {
      nodeId: newNodeId,
      title: `Finder - ${nodeLabel}`,
    });

    if (!windowSuccess) {
      console.log(
        "useFinderHistory: failed to update window after going forward"
      );
      return false;
    }

    console.log("useFinderHistory: successfully went forward to", newNodeId);
    return true;
  }, [
    historyId,
    canGoForward,
    goForwardInHistory,
    getCurrentItem,
    getNodeByID,
    updateWindowById,
    windowId,
  ]);

  /**
   * Navigate to specific index in history
   */
  const goToIndex = useCallback(
    (index: number): boolean => {
      console.log("useFinderHistory: goToIndex", index, "in", historyId);

      if (index < 0 || index >= historyLength) {
        console.log("useFinderHistory: index out of bounds", index);
        return false;
      }

      // Navigate to specific index in history
      const historySuccess = goToIndexInHistory(historyId, index);
      if (!historySuccess) {
        console.log("useFinderHistory: failed to go to index in history");
        return false;
      }

      // Get the current item at the new index
      const newNodeId = getCurrentItem(historyId) as string;
      if (!newNodeId) {
        console.log("useFinderHistory: no current item at index", index);
        return false;
      }

      // Get node information for title update
      const node = getNodeByID(newNodeId);
      const nodeLabel = node?.label || newNodeId;

      // Update window to reflect new current location
      const windowSuccess = updateWindowById(windowId, {
        nodeId: newNodeId,
        title: `Finder - ${nodeLabel}`,
      });

      if (!windowSuccess) {
        console.log(
          "useFinderHistory: failed to update window after going to index"
        );
        return false;
      }

      console.log(
        "useFinderHistory: successfully went to index",
        index,
        "nodeId:",
        newNodeId
      );
      return true;
    },
    [
      historyId,
      historyLength,
      goToIndexInHistory,
      getCurrentItem,
      getNodeByID,
      updateWindowById,
      windowId,
    ]
  );

  return {
    // Navigation methods
    navigateToNode,
    goBack,
    goForward,
    goToIndex,

    // Query methods
    canGoBack,
    canGoForward,
    currentNodeId,
    historyLength,

    // History state
    historyItems,
    currentIndex,
  };
};
