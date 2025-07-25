import { useCallback, useEffect } from "react";
import { useNewStore } from "@/hooks/useStore";
import type { WhatsAppView } from "../types";
import type { WindowId } from "@/constants/applicationRegistry";

export interface ViewState {
  view: WhatsAppView;
  params?: {
    conversationId?: string;
    contactId?: string;
    mediaType?: string;
  };
}

interface UseWhatsAppHistoryReturn {
  // Navigation methods
  navigateToView: (view: WhatsAppView, params?: ViewState["params"]) => boolean;
  goBack: () => boolean;
  goForward: () => boolean;

  // Query methods
  canGoBack: boolean;
  canGoForward: boolean;
  whatsAppView: ViewState | undefined;
  historyLength: number;

  // Cleanup method
  cleanup: () => void;
}

/**
 * Custom hook for managing WhatsApp navigation history
 * Coordinates between the generic history slice and WhatsApp state
 */
export const useWhatsAppHistory = (
  windowId: WindowId
): UseWhatsAppHistoryReturn => {
  const historyId = windowId;

  // History slice actions
  const whatsAppHistory = useNewStore((state) => state.getHistory(historyId));
  // console.log("WhatsApp: useWhatsAppHistory getHistory", whatsAppHistory);
  const index = whatsAppHistory?.currentIndex;
  const whatsAppView = whatsAppHistory?.items[index ?? 0] as
    | ViewState
    | undefined;
  // console.log("WhatsApp: useWhatsAppHistory view", whatsAppView);
  const createHistory = useNewStore((state) => state.createHistory);
  const historyExists = useNewStore((state) => state.historyExists);
  const addToHistory = useNewStore((state) => state.addToHistory);
  const goBackInHistory = useNewStore((state) => state.goBack);
  const goForwardInHistory = useNewStore((state) => state.goForward);
  const canGoBackInHistory = useNewStore((state) => state.canGoBack);
  const canGoForwardInHistory = useNewStore((state) => state.canGoForward);
  const getCurrentItem = useNewStore((state) => state.getCurrentItem);
  const getHistoryLength = useNewStore((state) => state.getHistoryLength);
  const deleteHistory = useNewStore((state) => state.deleteHistory);
  const findWindow = useNewStore((state) => state.findWindow);
  // const window = findWindow((w) => w.windowId === windowId);

  // WhatsApp actions
  // const setView = useNewStore((state) => state.setView);
  const setCurrentConversation = useNewStore(
    (state) => state.setCurrentConversation
  );

  // Initialize history instance when hook is first used
  useEffect(() => {
    if (!historyExists(historyId)) {
      const window = findWindow((w) => w.windowId === windowId);
      const initialView =
        window?.nodeId === "phone"
          ? { view: "recentCalls" as const }
          : { view: "chatList" as const };
      createHistory(historyId, initialView);
    }
  }, [historyId, historyExists, createHistory, windowId, findWindow]);

  const historyLength = getHistoryLength(historyId);
  const canGoBack = canGoBackInHistory(historyId);
  const canGoForward = canGoForwardInHistory(historyId);

  /**
   * Navigate to a specific view and update WhatsApp state
   */
  const navigateToView = useCallback(
    (view: WhatsAppView, params?: ViewState["params"]): boolean => {
      // we don't want the phone call screen to be added to the history
      // ! potential_issue: unsure if this hack will cause issues with the back button or history
      // if (view !== "phoneCall") {
      // Add to history first
      const historySuccess = addToHistory(historyId, { view, params });
      if (!historySuccess) {
        return false;
      }
      // }

      // Update WhatsApp state
      // setView(view);
      if (view === "chat" && params?.conversationId) {
        setCurrentConversation(params.conversationId);
      } else if (view !== "chat") {
        setCurrentConversation(null);
      }

      return true;
    },
    [historyId, addToHistory, setCurrentConversation]
  );

  /**
   * Navigate back in history
   */
  const goBack = useCallback((): boolean => {
    if (!canGoBack) {
      return false;
    }

    // Navigate back in history
    const historySuccess = goBackInHistory(historyId);
    if (!historySuccess) {
      return false;
    }

    // Get the new current view after going back
    const newView = getCurrentItem(historyId) as ViewState;
    if (!newView) {
      return false;
    }

    // Update WhatsApp state
    // setView(newView.view);
    if (newView.view === "chat" && newView.params?.conversationId) {
      setCurrentConversation(newView.params.conversationId);
    } else if (newView.view !== "chat") {
      setCurrentConversation(null);
    }

    return true;
  }, [
    historyId,
    canGoBack,
    goBackInHistory,
    getCurrentItem,
    // setView,
    setCurrentConversation,
  ]);

  /**
   * Navigate forward in history
   */
  const goForward = useCallback((): boolean => {
    if (!canGoForward) {
      return false;
    }

    // Navigate forward in history
    const historySuccess = goForwardInHistory(historyId);
    if (!historySuccess) {
      return false;
    }

    // Get the new current view after going forward
    const newView = getCurrentItem(historyId) as ViewState;
    if (!newView) {
      return false;
    }

    // Update WhatsApp state
    // setView(newView.view);
    if (newView.view === "chat" && newView.params?.conversationId) {
      setCurrentConversation(newView.params.conversationId);
    } else if (newView.view !== "chat") {
      setCurrentConversation(null);
    }

    return true;
  }, [
    historyId,
    canGoForward,
    goForwardInHistory,
    getCurrentItem,
    // setView,
    setCurrentConversation,
  ]);

  /**
   * Cleanup history when component unmounts
   */
  const cleanup = useCallback(() => {
    if (historyExists(historyId)) {
      deleteHistory(historyId);
    }
  }, [historyId, historyExists, deleteHistory]);

  return {
    // Navigation methods
    navigateToView,
    goBack,
    goForward,

    // Query methods
    canGoBack,
    canGoForward,
    whatsAppView,
    historyLength,

    // Cleanup method
    cleanup,
  };
};
