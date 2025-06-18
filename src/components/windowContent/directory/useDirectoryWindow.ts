import { useDirectoryWindow } from "../../../hooks/useWindowState";
import { useNewStore } from "../../../hooks/useStore";

/**
 * Enhanced directory hook that combines window-specific state with directory functionality
 * @param windowId - The ID of the directory window
 */
export const useDirectoryWindowContent = (windowId: string) => {
  // Get window-specific state and operations using generic system
  const directoryWindow = useDirectoryWindow(windowId);

  // Get legacy directory operations for backward compatibility
  const navigateBack = useNewStore((state) => state.navigateBack);
  const navigateForward = useNewStore((state) => state.navigateForward);
  const navigateUp = useNewStore((state) => state.navigateUp);

  // Directory-specific state
  const currentPath = directoryWindow.currentPath;
  const pathHistory = directoryWindow.pathHistory;
  const pathHistoryIndex = directoryWindow.pathHistoryIndex;
  const canGoBack = directoryWindow.canGoBack;
  const canGoForward = directoryWindow.canGoForward;

  const directoryOperations = {
    goBackInHistory: () => directoryWindow.goBackToPath(),
    goForwardInHistory: () => directoryWindow.goForwardToPath(),
    navigateToPath: (path: string) => directoryWindow.navigateToPath(path),

    // Legacy operations for existing components that expect them
    navigateBack: () => navigateBack(windowId),
    navigateForward: () => navigateForward(windowId),
    navigateUp: () => navigateUp(windowId),

    // Direct state operations
    setCurrentPath: (path: string) => directoryWindow.setPath(path),
    addPathToHistory: (path: string) => directoryWindow.addPathToHistory(path),
    clearHistory: () => directoryWindow.clearHistory(),
  };

  return {
    // Window state
    window: directoryWindow.window,
    windowId,

    // Directory state
    currentPath,
    pathHistory,
    pathHistoryIndex,
    canGoBack,
    canGoForward,

    // Operations (both new and legacy)
    ...directoryOperations,

    // Raw window operations for advanced use
    windowOperations: directoryWindow,
  };
};
