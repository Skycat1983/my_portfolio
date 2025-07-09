import { useNewStore } from "@/hooks/useStore";
import { useCallback, useEffect } from "react";

interface WindowHistoryNavigationProps {
  historyId: string;
  firstHistoryItem: unknown;
  onHistoryChange?: (currentItem: unknown, currentIndex: number) => void;
}

export const useWindowHistoryNavigation = ({
  historyId,
  firstHistoryItem,
  onHistoryChange,
}: WindowHistoryNavigationProps) => {
  const createHistory = useNewStore((s) => s.createHistory);

  //   ! HISTORY OPERATIONS
  const history = useNewStore((s) => s.histories[historyId]);
  const historyExists = useNewStore((state) => state.historyExists);
  const goBackInHistory = useNewStore((state) => state.goBack);
  const goForwardInHistory = useNewStore((state) => state.goForward);
  const canGoBackInHistory = useNewStore((state) => state.canGoBack);
  const canGoForwardInHistory = useNewStore((state) => state.canGoForward);
  const getCurrentItem = useNewStore((state) => state.getCurrentItem);
  const getCurrentIndex = useNewStore((state) => state.getCurrentIndex);

  useEffect(() => {
    if (!historyExists(historyId)) {
      createHistory(historyId, firstHistoryItem);
    }
  }, [historyId, historyExists, createHistory, firstHistoryItem]);

  const goBack = useCallback((): boolean => {
    if (!canGoBackInHistory(historyId)) {
      return false;
    }
    // Navigate back in history
    const historySuccess = goBackInHistory(historyId);
    if (!historySuccess) {
      return false;
    }

    // Trigger callback on successful navigation
    if (onHistoryChange) {
      const newCurrentItem = getCurrentItem(historyId);
      const newCurrentIndex = getCurrentIndex(historyId);
      onHistoryChange(newCurrentItem, newCurrentIndex);
    }

    return true;
  }, [
    historyId,
    canGoBackInHistory,
    goBackInHistory,
    onHistoryChange,
    getCurrentItem,
    getCurrentIndex,
  ]);

  const goForward = useCallback((): boolean => {
    if (!canGoForwardInHistory(historyId)) {
      return false;
    }

    const historySuccess = goForwardInHistory(historyId);
    if (!historySuccess) {
      return false;
    }

    // Trigger callback on successful navigation
    if (onHistoryChange) {
      const newCurrentItem = getCurrentItem(historyId);
      const newCurrentIndex = getCurrentIndex(historyId);
      onHistoryChange(newCurrentItem, newCurrentIndex);
    }

    return true;
  }, [
    historyId,
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
    canGoBack: canGoBackInHistory(historyId),
    canGoForward: canGoForwardInHistory(historyId),
  };
};
