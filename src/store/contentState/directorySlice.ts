import type { DirectoryWindow } from "../../types/storeTypes";
import type { SetState, GetState } from "../../types/storeTypes";
import type { WindowCrudSlice } from "../windowState/windowCrudSlice";

// Store interface that includes window CRUD and directory operations
interface StoreWithDirectoryOps extends WindowCrudSlice {
  getDirectoryWindow: (windowId: string) => DirectoryWindow | undefined;
  isDirectoryWindow: (windowId: string) => boolean;
}

export interface DirectoryOperationsActions {
  // Directory navigation operations
  navigateBack: (windowId: DirectoryWindow["windowId"]) => boolean;
  navigateForward: (windowId: DirectoryWindow["windowId"]) => boolean;
  navigateUp: (windowId: DirectoryWindow["windowId"]) => boolean;

  // Directory state helpers
  getDirectoryWindow: (windowId: string) => DirectoryWindow | undefined;
  isDirectoryWindow: (windowId: string) => boolean;
}

export type DirectoryOperationsSlice = DirectoryOperationsActions;

export const createDirectoryOperationsSlice = (
  set: SetState<StoreWithDirectoryOps>,
  get: GetState<StoreWithDirectoryOps>
): DirectoryOperationsSlice => ({
  /**
   * Get a window as DirectoryWindow if it exists and is a directory
   */
  getDirectoryWindow: (windowId: string): DirectoryWindow | undefined => {
    const window = get().findOneWindow((w) => w.windowId === windowId);

    if (!window || window.nodeType !== "directory") {
      return undefined;
    }

    return window as DirectoryWindow;
  },

  /**
   * Check if a window is a directory window
   */
  isDirectoryWindow: (windowId: string): boolean => {
    const window = get().findOneWindow((w) => w.windowId === windowId);
    return window?.nodeType === "directory" || false;
  },

  /**
   * Navigate back in directory history
   */
  navigateBack: (windowId: DirectoryWindow["windowId"]): boolean => {
    console.log(
      "navigateBack in directoryOperationsSlice: navigating back in window",
      windowId
    );

    const state = get();
    const dirWindow = state.getDirectoryWindow(windowId);

    if (!dirWindow) {
      console.log(
        "navigateBack: window not found or not a directory",
        windowId
      );
      return false;
    }

    // Safety check: initialize navigation properties if they don't exist
    const currentHistory = dirWindow.navigationHistory || [dirWindow.nodeId];
    const currentIndex = dirWindow.currentHistoryIndex ?? 0;
    const canGoBack = dirWindow.canGoBack ?? false;

    if (!canGoBack || currentIndex <= 0) {
      console.log("navigateBack: cannot go back", windowId);
      return false;
    }

    const newIndex = currentIndex - 1;
    const newPath = currentHistory[newIndex];

    return state.updateOneWindow((w) => w.windowId === windowId, {
      currentPath: newPath,
      currentHistoryIndex: newIndex,
      canGoBack: newIndex > 0,
      canGoForward: true,
    });
  },

  /**
   * Navigate forward in directory history
   */
  navigateForward: (windowId: DirectoryWindow["windowId"]): boolean => {
    console.log(
      "navigateForward in directoryOperationsSlice: navigating forward in window",
      windowId
    );

    const state = get();
    const dirWindow = state.getDirectoryWindow(windowId);

    if (!dirWindow) {
      console.log(
        "navigateForward: window not found or not a directory",
        windowId
      );
      return false;
    }

    // Safety check: initialize navigation properties if they don't exist
    const currentHistory = dirWindow.navigationHistory || [dirWindow.nodeId];
    const currentIndex = dirWindow.currentHistoryIndex ?? 0;
    const canGoForward = dirWindow.canGoForward ?? false;

    if (!canGoForward || currentIndex >= currentHistory.length - 1) {
      console.log("navigateForward: cannot go forward", windowId);
      return false;
    }

    const newIndex = currentIndex + 1;
    const newPath = currentHistory[newIndex];

    return state.updateOneWindow((w) => w.windowId === windowId, {
      currentPath: newPath,
      currentHistoryIndex: newIndex,
      canGoBack: true,
      canGoForward: newIndex < dirWindow.navigationHistory.length - 1,
    });
  },

  /**
   * Navigate up one directory level (parent directory)
   */
  navigateUp: (windowId: DirectoryWindow["windowId"]): boolean => {
    console.log(
      "navigateUp in directoryOperationsSlice: navigating up in window",
      windowId
    );

    const state = get();
    const dirWindow = state.getDirectoryWindow(windowId);

    if (!dirWindow) {
      console.log("navigateUp: window not found or not a directory", windowId);
      return false;
    }

    // Safety check: initialize navigation properties if they don't exist
    const currentPath = dirWindow.currentPath || dirWindow.nodeId;
    const currentHistory = dirWindow.navigationHistory || [dirWindow.nodeId];
    const currentIndex = dirWindow.currentHistoryIndex ?? 0;

    // Calculate parent path - remove the last directory segment
    const pathParts = currentPath
      .split("/")
      .filter((part: string) => part.length > 0);
    if (pathParts.length === 0) {
      console.log("navigateUp: already at root", windowId);
      return false;
    }

    const parentPath = "/" + pathParts.slice(0, -1).join("/");

    // Add to history and navigate
    const newHistory = [
      ...currentHistory.slice(0, currentIndex + 1),
      parentPath,
    ];
    const newIndex = newHistory.length - 1;

    return state.updateOneWindow((w) => w.windowId === windowId, {
      currentPath: parentPath,
      navigationHistory: newHistory,
      currentHistoryIndex: newIndex,
      canGoBack: newIndex > 0,
      canGoForward: false,
    });
  },
});
