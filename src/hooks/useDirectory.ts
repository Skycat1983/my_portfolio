import { useCallback } from "react";
import type { WindowType } from "../types/storeTypes";
import { useNewStore } from "./useStore";
import type { DirectoryEntry } from "../types/nodeTypes";

export const useDirectoryNode = (directoryEntry: DirectoryEntry) => {
  const directoryId = directoryEntry.id;
  const openWindow = useNewStore((s) => s.openWindow);
  const focusWindow = useNewStore((s) => s.focusWindow);
  const windowExists = useNewStore((s) => s.isWindowIdOpen(directoryId));

  const handleOpenDirectory = useCallback(() => {
    if (windowExists) {
      focusWindow(directoryId);
    } else {
      const windowContent = directoryEntry;
      const windowHistoryItem = directoryId;
      openWindow(windowContent, windowHistoryItem);
    }
  }, [windowExists, focusWindow, openWindow, directoryEntry, directoryId]);

  return {
    handleOpenDirectory,
  };
};

export const useDirectoryWindow = (windowId: WindowType["windowId"]) => {
  console.log("useDirectoryWindow windowId", windowId);
  const window = useNewStore((state) => state.getWindowById(windowId));
  console.log("useDirectoryWindow window", window);
  const canGoBackInDirectoryHistory = useNewStore(
    (state) => state.canGoBackInWindowHistory
  );
  const canGoForwardInDirectoryHistory = useNewStore(
    (state) => state.canGoForwardInWindowHistory
  );
  console.log(
    "useDirectoryWindow canGoBackInDirectoryHistory",
    canGoBackInDirectoryHistory(windowId)
  );
  console.log(
    "useDirectoryWindow canGoForwardInDirectoryHistory",
    canGoForwardInDirectoryHistory(windowId)
  );
  const decrementHistoryIndex = useNewStore(
    (state) => state.decrementWindowHistoryIndex
  );
  const incrementHistoryIndex = useNewStore(
    (state) => state.incrementWindowHistoryIndex
  );
  const getLocationInHistory = useNewStore(
    (state) => state.getLocationInHistory
  );
  const updateWindowById = useNewStore((state) => state.updateWindowById);

  const handleGoBackInDirectoryHistory = useCallback(() => {
    if (canGoBackInDirectoryHistory(windowId)) {
      decrementHistoryIndex(windowId);
      const previousNodeId = getLocationInHistory(windowId);
      updateWindowById(windowId, { nodeId: previousNodeId });
    }
  }, [
    windowId,
    canGoBackInDirectoryHistory,
    decrementHistoryIndex,
    getLocationInHistory,
    updateWindowById,
  ]);

  const handleGoForwardInDirectoryHistory = useCallback(() => {
    if (canGoForwardInDirectoryHistory(windowId)) {
      incrementHistoryIndex(windowId);
      const nextNodeId = getLocationInHistory(windowId);
      updateWindowById(windowId, { nodeId: nextNodeId });
    }
  }, [
    windowId,
    canGoForwardInDirectoryHistory,
    incrementHistoryIndex,
    getLocationInHistory,
    updateWindowById,
  ]);

  return {
    canGoBackInDirectoryHistory,
    canGoForwardInDirectoryHistory,
    handleGoBackInDirectoryHistory,
    handleGoForwardInDirectoryHistory,
  };
};
