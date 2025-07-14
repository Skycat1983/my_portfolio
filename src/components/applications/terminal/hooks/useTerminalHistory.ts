import { useCallback, useEffect, useState } from "react";
import { useNewStore } from "@/hooks/useStore";
import type { WindowId } from "@/constants/applicationRegistry";

interface UseTerminalHistoryReturn {
  // Navigation methods
  addCommand: (command: string) => boolean;
  navigateHistory: (direction: "up" | "down") => string;
  clearHistory: () => boolean;

  // Query methods
  canGoBack: boolean;
  canGoForward: boolean;
  historyLength: number;
  currentCommand: string | undefined;

  // State
  historyItems: string[];
  currentIndex: number;
  historyNavigationIndex: number; // Separate index for up/down navigation
}

/**
 * Custom hook for managing terminal command history
 * Coordinates between the generic history slice and terminal-specific navigation behavior
 */
export const useTerminalHistory = (
  windowId: WindowId
): UseTerminalHistoryReturn => {
  const historyId = windowId;

  // History slice actions
  const createHistory = useNewStore((state) => state.createHistory);
  const historyExists = useNewStore((state) => state.historyExists);
  const addToHistory = useNewStore((state) => state.addToHistory);
  const clearHistorySlice = useNewStore((state) => state.clearHistory);
  const canGoBackInHistory = useNewStore((state) => state.canGoBack);
  const canGoForwardInHistory = useNewStore((state) => state.canGoForward);
  const getCurrentItem = useNewStore((state) => state.getCurrentItem);
  const getCurrentIndex = useNewStore((state) => state.getCurrentIndex);
  const getHistoryItems = useNewStore((state) => state.getHistoryItems);
  const getHistoryLength = useNewStore((state) => state.getHistoryLength);

  console.log("useTerminalHistory: initializing for windowId", windowId);

  // Initialize history instance when hook is first used
  useEffect(() => {
    if (!historyExists(historyId)) {
      console.log(
        "useTerminalHistory: creating new history instance",
        historyId
      );
      createHistory(historyId);
    }
  }, [historyId, historyExists, createHistory]);

  // Get current history state
  const currentCommand = getCurrentItem(historyId) as string | undefined;
  const currentIndex = getCurrentIndex(historyId);
  const historyItems = getHistoryItems(historyId) as string[];
  const historyLength = getHistoryLength(historyId);
  const canGoBack = canGoBackInHistory(historyId);
  const canGoForward = canGoForwardInHistory(historyId);

  // Separate navigation index for up/down arrow behavior
  // This starts at -1 (no history selected) and counts backwards from the end
  const [historyNavigationIndex, setHistoryNavigationIndex] = useState(-1);

  console.log("useTerminalHistory: currentCommand", currentCommand);
  console.log("useTerminalHistory: historyLength", historyLength);
  console.log("useTerminalHistory: historyItems", historyItems);

  /**
   * Add a command to history
   */
  const addCommand = useCallback(
    (command: string): boolean => {
      console.log(
        "useTerminalHistory: adding command",
        command,
        "to",
        historyId
      );

      if (!command.trim()) {
        console.log("useTerminalHistory: skipping empty command");
        return false;
      }

      // Add to generic history
      const success = addToHistory(historyId, command);

      if (success) {
        // Reset navigation index when new command is added
        setHistoryNavigationIndex(-1);
        console.log("useTerminalHistory: successfully added command");
      }

      return success;
    },
    [historyId, addToHistory, setHistoryNavigationIndex]
  );

  /**
   * Navigate through command history with up/down arrows
   * This implements the traditional terminal behavior where:
   * - Up arrow goes to previous commands (backwards in time)
   * - Down arrow goes to more recent commands (forwards in time)
   * - Navigation index is separate from the actual history position
   */
  const navigateHistory = useCallback(
    (direction: "up" | "down"): string => {
      console.log("useTerminalHistory: navigating", direction, "in", historyId);

      if (historyItems.length === 0) {
        console.log("useTerminalHistory: no history to navigate");
        return "";
      }

      let newNavigationIndex = historyNavigationIndex;

      if (direction === "up") {
        // Go back in history (older commands)
        if (historyNavigationIndex < historyItems.length - 1) {
          newNavigationIndex = historyNavigationIndex + 1;
        }
      } else if (direction === "down") {
        // Go forward in history (newer commands)
        if (historyNavigationIndex > 0) {
          newNavigationIndex = historyNavigationIndex - 1;
        } else if (historyNavigationIndex === 0) {
          // Return to empty input when going past the most recent command
          newNavigationIndex = -1;
          setHistoryNavigationIndex(-1);
          return "";
        }
      }

      if (newNavigationIndex !== historyNavigationIndex) {
        setHistoryNavigationIndex(newNavigationIndex);

        if (newNavigationIndex >= 0) {
          // Get command from the end of the array (most recent first)
          const commandIndex = historyItems.length - 1 - newNavigationIndex;
          const command = historyItems[commandIndex] || "";
          console.log(
            "useTerminalHistory: returning command",
            command,
            "at index",
            commandIndex
          );
          return command;
        }
      }

      return "";
    },
    [historyId, historyItems, historyNavigationIndex, setHistoryNavigationIndex]
  );

  /**
   * Clear all command history
   */
  const clearHistory = useCallback((): boolean => {
    console.log("useTerminalHistory: clearing history", historyId);

    const success = clearHistorySlice(historyId);
    if (success) {
      setHistoryNavigationIndex(-1);
    }

    return success;
  }, [historyId, clearHistorySlice, setHistoryNavigationIndex]);

  return {
    // Navigation methods
    addCommand,
    navigateHistory,
    clearHistory,

    // Query methods
    canGoBack,
    canGoForward,
    historyLength,
    currentCommand,

    // State
    historyItems,
    currentIndex,
    historyNavigationIndex,
  };
};
