import type { NewDesktopStore } from "../hooks/useStore";
import type { NodeEntry } from "../types/nodeTypes";
import type { GetState, SetState } from "../types/storeTypes";

export type WindowedNode = Exclude<NodeEntry, { type: "icon" | "link" }>;

interface Window {
  id: string;
  nodeId: string;
  nodeType: string;
  width: number;
  height: number;
  zIndex: number;
  // navigationHistory: string[];
  // currentHistoryIndex: number;
}

interface WindowState {
  openWindows: Window[];
  nextZIndex: number;
}

// export interface StoreWithWindows extends StoreWithCrud {}

interface WindowActions {
  openWindow: (nodeId: WindowedNode["id"]) => void;
  closeWindow: (windowId: Window["id"]) => void;
  focusWindow: (windowId: Window["id"]) => void;
  getWindowById: (windowId: Window["id"]) => Window | undefined;
  getWindowByNodeId: (nodeId: string) => Window | undefined;
  //? These states are for directories only. here i want to focus on states consistent to all windowable nodes
  //   navigateDirectory: (windowId: Window["id"], targetNodeId: WindowedNode["id"]) => void;
  //   canGoBack: (windowId: Window["id"]) => boolean;
  //   canGoForward: (windowId: Window["id"]) => boolean;
}

export type WindowSliceNew = WindowState & WindowActions;

export const createNewWindowSlice = (
  set: SetState<NewDesktopStore>,
  get: GetState<NewDesktopStore>
): WindowSliceNew => ({
  // Initial state
  openWindows: [],
  nextZIndex: 1000,

  // Actions
  openWindow: (nodeId: WindowedNode["id"]) => {
    console.log(
      "openWindow in newWindowSlice: creating window for nodeId",
      nodeId
    );

    const state = get();
    const node = state.getNodeByID(nodeId);

    if (!node) {
      console.log("openWindow: node not found", nodeId);
      return;
    }

    // Check if window already exists for this node
    const existingWindow = state.openWindows.find(
      (window) => window.nodeId === nodeId
    );

    if (existingWindow) {
      // Focus existing window instead of creating new one
      console.log("newWindow: focusing existing window", nodeId);
      set((state) => ({
        openWindows: state.openWindows.map((window) =>
          window.id === existingWindow.id
            ? { ...window, zIndex: state.nextZIndex }
            : window
        ),
        nextZIndex: state.nextZIndex + 1,
      }));
      return;
    }

    // Create new window
    const newWindow: Window = {
      id: `window-${nodeId}-${Date.now()}`, // Unique window ID
      nodeId,
      nodeType: node.type,
      width: 800,
      height: 600,
      zIndex: state.nextZIndex,
      // navigationHistory: [nodeId],
      // currentHistoryIndex: 0,
    };

    set((state) => ({
      openWindows: [...state.openWindows, newWindow],
      nextZIndex: state.nextZIndex + 1,
    }));
  },

  closeWindow: (windowId: Window["id"]) => {
    console.log("closeWindow in newWindowSlice: closing window", windowId);

    set((state) => ({
      openWindows: state.openWindows.filter((window) => window.id !== windowId),
    }));
  },

  focusWindow: (windowId: Window["id"]) => {
    console.log("focusWindow in newWindowSlice: focusing window", windowId);

    set((state) => ({
      openWindows: state.openWindows.map((window) =>
        window.id === windowId
          ? { ...window, zIndex: state.nextZIndex }
          : window
      ),
      nextZIndex: state.nextZIndex + 1,
    }));
  },

  getWindowById: (windowId: Window["id"]) => {
    const state = get();
    return state.openWindows.find((window) => window.id === windowId);
  },

  getWindowByNodeId: (nodeId: string) => {
    const state = get();
    return state.openWindows.find((window) => window.nodeId === nodeId);
  },
});
