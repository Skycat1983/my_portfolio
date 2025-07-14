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
  const window = findWindow((w) => w.windowId === windowId);
  console.log("WhatsApp: useWhatsAppHistory window", window);

  // WhatsApp actions
  // const setView = useNewStore((state) => state.setView);
  const setCurrentConversation = useNewStore(
    (state) => state.setCurrentConversation
  );

  // Initialize history instance when hook is first used
  useEffect(() => {
    console.log(
      "WhatsApp: useWhatsAppHistory useEffect, historyExists",
      historyExists(historyId)
    );
    if (!historyExists(historyId)) {
      console.log(
        "useWhatsAppHistory: initializing history for window",
        windowId
      );
      const window = findWindow((w) => w.windowId === windowId);
      // console.log("WhatsApp: useWhatsAppHistory window", window);
      const initialView =
        window?.nodeId === "phone"
          ? { view: "recentCalls" as const }
          : { view: "chatList" as const };
      createHistory(historyId, initialView);
      console.log(
        "WhatsApp: useWhatsAppHistory useEffect, historyExists2",
        historyExists(historyId)
      );

      const currentViewItem = getCurrentItem(historyId) as
        | ViewState
        | undefined;
      console.log(
        "WhatsApp: useWhatsAppHistory useEffect, currentView",
        currentViewItem
      );
    }
  }, [
    historyId,
    historyExists,
    createHistory,
    windowId,
    getCurrentItem,
    findWindow,
  ]);

  const historyLength = getHistoryLength(historyId);
  const canGoBack = canGoBackInHistory(historyId);
  const canGoForward = canGoForwardInHistory(historyId);

  /**
   * Navigate to a specific view and update WhatsApp state
   */
  const navigateToView = useCallback(
    (view: WhatsAppView, params?: ViewState["params"]): boolean => {
      console.log("useWhatsAppHistory: navigateToView", view, params);

      // we don't want the phone call screen to be added to the history
      // ! potential_issue: unsure if this hack will cause issues with the back button or history
      // if (view !== "phoneCall") {
      // Add to history first
      const historySuccess = addToHistory(historyId, { view, params });
      if (!historySuccess) {
        console.log("useWhatsAppHistory: failed to add to history");
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

      console.log("useWhatsAppHistory: successfully navigated to", view);
      return true;
    },
    [historyId, addToHistory, setCurrentConversation]
  );

  /**
   * Navigate back in history
   */
  const goBack = useCallback((): boolean => {
    console.log("useWhatsAppHistory: goBack");

    if (!canGoBack) {
      console.log("useWhatsAppHistory: cannot go back");
      return false;
    }

    // Navigate back in history
    const historySuccess = goBackInHistory(historyId);
    if (!historySuccess) {
      console.log("useWhatsAppHistory: failed to go back in history");
      return false;
    }

    // Get the new current view after going back
    const newView = getCurrentItem(historyId) as ViewState;
    if (!newView) {
      console.log("useWhatsAppHistory: no view after going back");
      return false;
    }

    // Update WhatsApp state
    // setView(newView.view);
    if (newView.view === "chat" && newView.params?.conversationId) {
      setCurrentConversation(newView.params.conversationId);
    } else if (newView.view !== "chat") {
      setCurrentConversation(null);
    }

    console.log("useWhatsAppHistory: successfully went back to", newView.view);
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
    console.log("useWhatsAppHistory: goForward");

    if (!canGoForward) {
      console.log("useWhatsAppHistory: cannot go forward");
      return false;
    }

    // Navigate forward in history
    const historySuccess = goForwardInHistory(historyId);
    if (!historySuccess) {
      console.log("useWhatsAppHistory: failed to go forward in history");
      return false;
    }

    // Get the new current view after going forward
    const newView = getCurrentItem(historyId) as ViewState;
    if (!newView) {
      console.log("useWhatsAppHistory: no view after going forward");
      return false;
    }

    // Update WhatsApp state
    // setView(newView.view);
    if (newView.view === "chat" && newView.params?.conversationId) {
      setCurrentConversation(newView.params.conversationId);
    } else if (newView.view !== "chat") {
      setCurrentConversation(null);
    }

    console.log(
      "useWhatsAppHistory: successfully went forward to",
      newView.view
    );
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
    console.log("useWhatsAppHistory: cleaning up history for window", windowId);
    if (historyExists(historyId)) {
      deleteHistory(historyId);
    }
  }, [historyId, historyExists, deleteHistory, windowId]);

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
