import { useCallback, useEffect } from "react";
import { useNewStore } from "@/hooks/useStore";
import type { WindowId } from "@/constants/applicationRegistry";
import type { NodeId } from "@/components/nodes/nodeTypes";
import { systemRootId } from "@/constants/nodeHierarchy";

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

  // Column-specific methods
  handleColumnClick: (depth: number, nodeId: string) => void;
  getColumnPath: () => string[];
}

/**
 * Custom hook for managing finder navigation history and column view
 * Coordinates between the generic history slice and window state
 */
export const useFinderHistory = (
  windowId: WindowId,
  nodeId: NodeId
): UseFinderHistoryReturn => {
  console.log("DEBUG_HISTORY_01: useFinderHistory hook called", {
    windowId,
    nodeId,
  });

  // Get current window
  const findWindow = useNewStore((state) => state.findWindow);

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

  const hasHistory = historyExists(windowId);
  console.log("DEBUG_HISTORY_02: history status check", {
    windowId,
    hasHistory,
  });

  // Initialize history instance when hook is first used
  useEffect(() => {
    console.log("DEBUG_HISTORY_03: useEffect initialization running", {
      windowId,
      nodeId,
    });

    const window = findWindow((w) => w.windowId === windowId);
    console.log("DEBUG_HISTORY_04: window found", {
      window: !!window,
      windowId,
    });

    if (!historyExists(windowId) && window) {
      const nodeIdToUse = nodeId === "finder" ? systemRootId : nodeId;
      console.log("DEBUG_HISTORY_05: creating new history", {
        windowId,
        nodeId,
        nodeIdToUse,
      });
      createHistory(windowId, nodeIdToUse);
      console.log("DEBUG_HISTORY_06: history created");
    } else {
      console.log("DEBUG_HISTORY_07: skipping history creation", {
        historyExists: historyExists(windowId),
        hasWindow: !!window,
      });
    }
  }, [windowId, findWindow, historyExists, createHistory, nodeId]);

  // Get current history state
  const currentNodeId = getCurrentItem(windowId) as string | undefined;
  const currentIndex = getCurrentIndex(windowId);
  const historyItems = getHistoryItems(windowId) as string[];
  const historyLength = getHistoryLength(windowId);
  const canGoBack = canGoBackInHistory(windowId);
  const canGoForward = canGoForwardInHistory(windowId);

  console.log("DEBUG_HISTORY_08: current history state", {
    windowId,
    currentNodeId,
    currentIndex,
    historyItems,
    historyLength,
    canGoBack,
    canGoForward,
  });

  /**
   * Navigate to a specific node and update both history and window
   */
  const navigateToNode = useCallback(
    (nodeId: string): boolean => {
      if (!window) {
        console.log("useFinderHistory: no window found for", windowId);
        return false;
      }

      // Add to history first
      const historySuccess = addToHistory(windowId, nodeId);
      if (!historySuccess) {
        console.log("useFinderHistory: failed to add to history", windowId);
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
        return false;
      }

      return true;
    },
    [windowId, addToHistory, getNodeByID, updateWindowById]
  );

  /**
   * Navigate back in history
   */
  const goBack = useCallback((): boolean => {
    if (!canGoBack) {
      return false;
    }

    // Navigate back in history
    const historySuccess = goBackInHistory(windowId);
    if (!historySuccess) {
      return false;
    }

    // Get the new current item after going back
    const newNodeId = getCurrentItem(windowId) as string;
    if (!newNodeId) {
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

    return true;
  }, [
    windowId,
    canGoBack,
    goBackInHistory,
    getCurrentItem,
    getNodeByID,
    updateWindowById,
  ]);

  /**
   * Navigate forward in history
   */
  const goForward = useCallback((): boolean => {
    if (!canGoForward) {
      return false;
    }

    // Navigate forward in history
    const historySuccess = goForwardInHistory(windowId);
    if (!historySuccess) {
      return false;
    }

    // Get the new current item after going forward
    const newNodeId = getCurrentItem(windowId) as string;
    if (!newNodeId) {
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

    return true;
  }, [
    windowId,
    canGoForward,
    goForwardInHistory,
    getCurrentItem,
    getNodeByID,
    updateWindowById,
  ]);

  /**
   * Navigate to specific index in history
   */
  const goToIndex = useCallback(
    (index: number): boolean => {
      if (index < 0 || index >= historyLength) {
        return false;
      }

      // Navigate to specific index in history
      const historySuccess = goToIndexInHistory(windowId, index);
      if (!historySuccess) {
        return false;
      }

      // Get the current item at the new index
      const newNodeId = getCurrentItem(windowId) as string;
      if (!newNodeId) {
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
        return false;
      }

      return true;
    },
    [
      windowId,
      historyLength,
      goToIndexInHistory,
      getCurrentItem,
      getNodeByID,
      updateWindowById,
    ]
  );

  /**
   * Handle click on a column item
   * If clicking at current depth, just navigate
   * If clicking at previous depth, truncate and navigate
   */
  const handleColumnClick = useCallback(
    (depth: number, nodeId: string) => {
      // If clicking at a previous depth, truncate history
      if (depth <= currentIndex) {
        goToIndex(depth);
      }

      // Navigate to the clicked node
      navigateToNode(nodeId);
    },
    [currentIndex, goToIndex, navigateToNode]
  );

  /**
   * Get the current column path (all items up to current index)
   */
  const getColumnPath = useCallback(() => {
    const result = historyItems.slice(0, currentIndex + 1);
    console.log("DEBUG_HISTORY_09: getColumnPath called", {
      windowId,
      historyItems,
      currentIndex,
      sliceStart: 0,
      sliceEnd: currentIndex + 1,
      result,
    });
    return result;
  }, [historyItems, currentIndex, windowId]);

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

    // Column-specific methods
    handleColumnClick,
    getColumnPath,
  };
};
