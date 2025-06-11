import type { DirectoryEntry } from "../types/nodeTypes";
import type {
  BaseStoreState,
  SetState,
  GetState,
  WindowData,
} from "../types/storeTypes";

interface WindowActions {
  // Core window management
  openWindow: (nodeId: string) => void;
  closeWindow: (nodeId: string) => void;
  focusWindow: (nodeId: string) => void;
  getWindowByNodeId: (nodeId: string) => WindowData | undefined;

  // Window navigation
  navigateInWindow: (windowNodeId: string, targetNodeId: string) => void;
  canGoBack: (windowNodeId: string) => boolean;
  canGoForward: (windowNodeId: string) => boolean;
  goBack: (windowNodeId: string) => void;
  goForward: (windowNodeId: string) => void;

  // Smart directory handler
  handleDirectoryDoubleClick: (nodeId: DirectoryEntry["id"]) => void;
}

interface WindowStoreState {
  openWindows: WindowData[];
  nextZIndex: number;
}

export type WindowSlice = WindowStoreState & WindowActions;

export const createWindowSlice = (
  set: SetState<BaseStoreState>,
  get: GetState<BaseStoreState>
): WindowSlice => ({
  // Window state
  openWindows: [],
  nextZIndex: 1000, // Start high to avoid conflicts with other elements

  // Core window actions
  openWindow: (nodeId: string) => {
    console.log("openWindow in windowSlice: opening window for nodeId", nodeId);

    const currentState = get();

    // Check if window is already open
    const existingWindow = currentState.openWindows.find(
      (w) => w.id === nodeId
    );
    if (existingWindow) {
      console.log(
        "openWindow in windowSlice: window already open, focusing nodeId",
        nodeId
      );
      // If already open, just focus it by updating z-index
      set((state) => ({
        openWindows: state.openWindows.map((window) =>
          window.id === nodeId
            ? { ...window, zIndex: state.nextZIndex }
            : window
        ),
        nextZIndex: state.nextZIndex + 1,
      }));
      return;
    }

    // Create new window with next available z-index and navigation state
    const newWindow: WindowData = {
      id: nodeId,
      currentNodeId: nodeId,
      zIndex: currentState.nextZIndex,
      navigationHistory: [nodeId],
      currentHistoryIndex: 0,
    };

    set((state) => ({
      openWindows: [...state.openWindows, newWindow],
      nextZIndex: state.nextZIndex + 1,
    }));
  },

  closeWindow: (nodeId: string) => {
    console.log(
      "closeWindow in windowSlice: closing window for nodeId",
      nodeId
    );

    set((state) => ({
      openWindows: state.openWindows.filter((window) => window.id !== nodeId),
    }));
  },

  focusWindow: (nodeId: string) => {
    console.log(
      "focusWindow in windowSlice: focusing window for nodeId",
      nodeId
    );

    const currentState = get();
    const windowToFocus = currentState.openWindows.find((w) => w.id === nodeId);

    if (!windowToFocus) {
      console.log(
        "focusWindow in windowSlice: window not found for nodeId",
        nodeId
      );
      return;
    }

    // Update the focused window to have the highest z-index
    set((state) => ({
      openWindows: state.openWindows.map((window) =>
        window.id === nodeId ? { ...window, zIndex: state.nextZIndex } : window
      ),
      nextZIndex: state.nextZIndex + 1,
    }));
  },

  getWindowByNodeId: (nodeId: string) => {
    const currentState = get();
    return currentState.openWindows.find((window) => window.id === nodeId);
  },

  // Window navigation actions
  navigateInWindow: (windowNodeId: string, targetNodeId: string) => {
    console.log(
      "navigateInWindow in windowSlice: navigating in window",
      windowNodeId,
      "to target",
      targetNodeId
    );

    set((state) => ({
      openWindows: state.openWindows.map((window) => {
        if (window.id !== windowNodeId) return window;

        // Trim history after current position (like browser navigation)
        const newHistory = window.navigationHistory.slice(
          0,
          window.currentHistoryIndex + 1
        );

        // Add new target to history
        newHistory.push(targetNodeId);

        return {
          ...window,
          currentNodeId: targetNodeId,
          navigationHistory: newHistory,
          currentHistoryIndex: newHistory.length - 1,
        };
      }),
    }));
  },

  canGoBack: (windowNodeId: string) => {
    const currentState = get();
    const window = currentState.openWindows.find((w) => w.id === windowNodeId);
    return window ? window.currentHistoryIndex > 0 : false;
  },

  canGoForward: (windowNodeId: string) => {
    const currentState = get();
    const window = currentState.openWindows.find((w) => w.id === windowNodeId);
    return window
      ? window.currentHistoryIndex < window.navigationHistory.length - 1
      : false;
  },

  goBack: (windowNodeId: string) => {
    console.log("goBack in windowSlice: going back in window", windowNodeId);

    const currentState = get();
    const window = currentState.openWindows.find((w) => w.id === windowNodeId);

    if (!window || window.currentHistoryIndex <= 0) return;

    const newIndex = window.currentHistoryIndex - 1;
    const targetNodeId = window.navigationHistory[newIndex];

    set((state) => ({
      openWindows: state.openWindows.map((w) =>
        w.id === windowNodeId
          ? { ...w, currentNodeId: targetNodeId, currentHistoryIndex: newIndex }
          : w
      ),
    }));
  },

  goForward: (windowNodeId: string) => {
    console.log(
      "goForward in windowSlice: going forward in window",
      windowNodeId
    );

    const currentState = get();
    const window = currentState.openWindows.find((w) => w.id === windowNodeId);

    if (
      !window ||
      window.currentHistoryIndex >= window.navigationHistory.length - 1
    )
      return;

    const newIndex = window.currentHistoryIndex + 1;
    const targetNodeId = window.navigationHistory[newIndex];

    set((state) => ({
      openWindows: state.openWindows.map((w) =>
        w.id === windowNodeId
          ? { ...w, currentNodeId: targetNodeId, currentHistoryIndex: newIndex }
          : w
      ),
    }));
  },

  // Smart directory double-click handler that auto-detects context
  handleDirectoryDoubleClick: (nodeId: DirectoryEntry["id"]) => {
    console.log(
      "handleDirectoryDoubleClick in windowSlice: handling directory",
      nodeId
    );

    const currentState = get();
    const directory = currentState.nodeMap[nodeId];

    if (!directory || directory.type !== "directory") {
      console.log("handleDirectoryDoubleClick: not a valid directory");
      return;
    }

    // Auto-detect context: if parentId is rootId (or null), we're on desktop
    const isOnDesktop =
      directory.parentId === currentState.rootId || !directory.parentId;

    if (isOnDesktop) {
      // Desktop context: open new window or focus existing
      const existingWindow = currentState.openWindows.find(
        (w) => w.id === nodeId
      );

      if (existingWindow) {
        // Focus existing window by updating z-index
        set((state) => ({
          openWindows: state.openWindows.map((window) =>
            window.id === nodeId
              ? { ...window, zIndex: state.nextZIndex }
              : window
          ),
          nextZIndex: state.nextZIndex + 1,
        }));
      } else {
        // Create new window
        const newWindow: WindowData = {
          id: nodeId,
          currentNodeId: nodeId,
          zIndex: currentState.nextZIndex,
          navigationHistory: [nodeId],
          currentHistoryIndex: 0,
        };

        set((state) => ({
          openWindows: [...state.openWindows, newWindow],
          nextZIndex: state.nextZIndex + 1,
        }));
      }
    } else {
      // Window context: find which window contains this directory and navigate within it
      // For now, we'll just open a new window - this can be enhanced later
      const newWindow: WindowData = {
        id: nodeId,
        currentNodeId: nodeId,
        zIndex: currentState.nextZIndex,
        navigationHistory: [nodeId],
        currentHistoryIndex: 0,
      };

      set((state) => ({
        openWindows: [...state.openWindows, newWindow],
        nextZIndex: state.nextZIndex + 1,
      }));
    }
  },
});
