import { useNewStore } from "@/hooks/useStore";
import { useCallback, useEffect } from "react";
import type { WindowId } from "@/constants/applicationRegistry";

interface WindowHistoryNavigationProps {
  windowId: WindowId;
  firstHistoryItem: unknown;
  onHistoryChange?: (currentItem: unknown, currentIndex: number) => void;
}

export const useWindowHistoryNavigation = ({
  windowId,
  firstHistoryItem,
  onHistoryChange,
}: WindowHistoryNavigationProps) => {
  const createHistory = useNewStore((s) => s.createHistory);

  //   ! HISTORY OPERATIONS
  const history = useNewStore((s) => s.histories[windowId]);
  const historyExists = useNewStore((state) => state.historyExists);
  const goBackInHistory = useNewStore((state) => state.goBack);
  const goForwardInHistory = useNewStore((state) => state.goForward);
  const canGoBackInHistory = useNewStore((state) => state.canGoBack);
  const canGoForwardInHistory = useNewStore((state) => state.canGoForward);
  const getCurrentItem = useNewStore((state) => state.getCurrentItem);
  const getCurrentIndex = useNewStore((state) => state.getCurrentIndex);

  useEffect(() => {
    if (!historyExists(windowId)) {
      createHistory(windowId, firstHistoryItem);
    }
  }, [windowId, historyExists, createHistory, firstHistoryItem]);

  const goBack = useCallback((): boolean => {
    if (!canGoBackInHistory(windowId)) {
      return false;
    }
    // Navigate back in history
    const historySuccess = goBackInHistory(windowId);
    if (!historySuccess) {
      return false;
    }

    // Trigger callback on successful navigation
    if (onHistoryChange) {
      const newCurrentItem = getCurrentItem(windowId);
      const newCurrentIndex = getCurrentIndex(windowId);
      onHistoryChange(newCurrentItem, newCurrentIndex);
    }

    return true;
  }, [
    windowId,
    canGoBackInHistory,
    goBackInHistory,
    onHistoryChange,
    getCurrentItem,
    getCurrentIndex,
  ]);

  const goForward = useCallback((): boolean => {
    if (!canGoForwardInHistory(windowId)) {
      return false;
    }

    const historySuccess = goForwardInHistory(windowId);
    if (!historySuccess) {
      return false;
    }

    // Trigger callback on successful navigation
    if (onHistoryChange) {
      const newCurrentItem = getCurrentItem(windowId);
      const newCurrentIndex = getCurrentIndex(windowId);
      onHistoryChange(newCurrentItem, newCurrentIndex);
    }

    return true;
  }, [
    windowId,
    canGoForwardInHistory,
    goForwardInHistory,
    onHistoryChange,
    getCurrentItem,
    getCurrentIndex,
  ]);

  return {
    history,
    goBack,
    goForward,
    canGoBack: canGoBackInHistory(windowId),
    canGoForward: canGoForwardInHistory(windowId),
  };
};
