import { useCallback } from "react";
import type { WindowType } from "../../../types/storeTypes";
import { useNewStore } from "../../../hooks/useStore";

export const useWindowHistory = (windowId: WindowType["windowId"]) => {
  console.log("useDirectoryWindow windowId", windowId);
  const window = useNewStore((state) => state.getWindowById(windowId));
  console.log("useDirectoryWindow window", window);
  const canGoBackInWindowHistory = useNewStore(
    (state) => state.canGoBackInWindowHistory
  );
  const canGoForwardInWindowHistory = useNewStore(
    (state) => state.canGoForwardInWindowHistory
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

  const handleGoBackInWindowHistory = useCallback(() => {
    if (canGoBackInWindowHistory(windowId)) {
      decrementHistoryIndex(windowId);
      const previousNodeId = getLocationInHistory(windowId);
      updateWindowById(windowId, { nodeId: previousNodeId });
    }
  }, [
    windowId,
    canGoBackInWindowHistory,
    decrementHistoryIndex,
    getLocationInHistory,
    updateWindowById,
  ]);

  const handleGoForwardInWindowHistory = useCallback(() => {
    if (canGoForwardInWindowHistory(windowId)) {
      incrementHistoryIndex(windowId);
      const nextNodeId = getLocationInHistory(windowId);
      updateWindowById(windowId, { nodeId: nextNodeId });
    }
  }, [
    windowId,
    canGoForwardInWindowHistory,
    incrementHistoryIndex,
    getLocationInHistory,
    updateWindowById,
  ]);

  return {
    canGoBackInWindowHistory,
    canGoForwardInWindowHistory,
    handleGoBackInWindowHistory,
    handleGoForwardInWindowHistory,
  };
};
