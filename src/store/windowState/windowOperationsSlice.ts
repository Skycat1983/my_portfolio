import type { DocumentConfig, WindowType } from "@/types/storeTypes";
import type { SetState, GetState } from "@/types/storeTypes";
import type { WindowCrudSlice } from "./windowCrudSlice";
import type { NodeEntry } from "@/types/nodeTypes";
import type { SystemSlice } from "../systemState/systemSlice";
import type { HistorySlice } from "../contentState/historySlice";

// Simplified windowed node type - only directories and applications can open windows
export type WindowedNode = Exclude<NodeEntry, { type: "easter-egg" | "link" }>;

// Window sizing configuration
const DEFAULT_WINDOW_SIZES = {
  directory: { width: 600, height: 400 },
  browser: { width: 1000, height: 800 },
  terminal: { width: 1000, height: 600 },
  game: { width: 1000, height: 600 },
  achievements: { width: 800, height: 600 },
} as const;

// Responsive sizing constraints
const VIEWPORT_CONSTRAINTS = {
  desktop: {
    maxWidthRatio: 0.9, // 90% of viewport width
    maxHeightRatio: 0.8, // 80% of viewport height
    minWidth: 320, // Minimum window width
    minHeight: 240, // Minimum window height
  },
  mobile: {
    maxWidthRatio: 1.0, // 100% of viewport width for fullscreen
    maxHeightRatio: 1.0, // 100% of viewport height for fullscreen
    minWidth: 320, // Minimum window width
    minHeight: 240, // Minimum window height
  },
} as const;

export interface WindowOperationsActions {
  //   ! WINDOW VISIBILITY OPERATIONS
  openWindow: (node: WindowedNode, historyItem: string) => void;
  // NEW: Open window with custom component key
  openWindowWithComponentKey: (
    node: WindowedNode,
    historyItem: string,
    componentKey: string
  ) => void;
  // NEW: Open window with document configuration
  openWindowWithDocumentConfig: (
    node: WindowedNode,
    historyItem: string,
    documentConfig?: DocumentConfig
  ) => void;
  closeWindow: (windowId: WindowType["windowId"]) => void;
  focusWindow: (windowId: WindowType["windowId"]) => void;
  minimizeWindow: (windowId: WindowType["windowId"]) => boolean;
  maximizeWindow: (windowId: WindowType["windowId"]) => boolean;
  // toggleMaximizeWindow: (windowId: WindowType["windowId"]) => boolean;

  //   ! WINDOW FRAME OPERATIONS
  moveWindow: (
    windowId: WindowType["windowId"],
    x: number,
    y: number
  ) => boolean;
  resizeWindow: (
    windowId: WindowType["windowId"],
    width: number,
    height: number
  ) => boolean;

  setWindowBounds: (
    windowId: WindowType["windowId"],
    bounds: { x: number; y: number; width: number; height: number }
  ) => boolean;

  // ! WINDOW HISTORY OPERATIONS
  canGoBackInWindowHistory: (windowId: WindowType["windowId"]) => boolean;
  canGoForwardInWindowHistory: (windowId: WindowType["windowId"]) => boolean;
  decrementWindowHistoryIndex: (windowId: WindowType["windowId"]) => boolean;
  incrementWindowHistoryIndex: (windowId: WindowType["windowId"]) => boolean;
  getLocationInHistory: (windowId: WindowType["windowId"]) => string;

  // History navigation

  addToWindowHistory: (
    windowId: WindowType["windowId"],
    item: string
  ) => boolean;

  updateWindowById: (
    windowId: WindowType["windowId"],
    updates: Partial<WindowType>
  ) => boolean;

  // Window state management

  // Utility operations
  isNodeIdWindowOpen: (nodeId: string) => boolean;
  // ID-based accessors (built from predicates)
  getWindowById: (id: WindowType["windowId"]) => WindowType | undefined;
  getWindowByNodeId: (nodeId: WindowType["nodeId"]) => WindowType | undefined;

  // Responsive sizing utilities
  getResponsiveWindowSize: (nodeType: string) => {
    width: number;
    height: number;
  };
}

export type WindowOperationsSlice = WindowCrudSlice &
  WindowOperationsActions &
  SystemSlice &
  HistorySlice;

// Window operations slice - builds ID-based operations from predicate-based CRUD
export const createWindowOperationsSlice = (
  _set: SetState<WindowOperationsSlice>,
  get: GetState<WindowOperationsSlice>
): WindowOperationsActions => ({
  /**
   * Calculate responsive window size based on screen dimensions and node type
   */
  getResponsiveWindowSize: (nodeType: string) => {
    const state = get();
    const { screenDimensions } = state;
    const {
      width: screenWidth,
      height: screenHeight,
      isMobile,
    } = screenDimensions;

    // For mobile, windows should be fullscreen
    if (isMobile) {
      const constraints = VIEWPORT_CONSTRAINTS.mobile;
      const fullscreenWidth = Math.floor(
        screenWidth * constraints.maxWidthRatio
      );
      const fullscreenHeight = Math.floor(
        screenHeight * constraints.maxHeightRatio
      );

      console.log(
        `getResponsiveWindowSize in windowOperationsSlice (MOBILE): ${nodeType} - Screen: ${screenWidth}x${screenHeight}, Fullscreen: ${fullscreenWidth}x${fullscreenHeight}`
      );

      return {
        width: Math.max(constraints.minWidth, fullscreenWidth),
        height: Math.max(constraints.minHeight, fullscreenHeight),
      };
    }

    // For desktop, use default sizes with constraints
    const constraints = VIEWPORT_CONSTRAINTS.desktop;
    const defaultSize =
      DEFAULT_WINDOW_SIZES[nodeType as keyof typeof DEFAULT_WINDOW_SIZES] ||
      DEFAULT_WINDOW_SIZES.directory;

    // Calculate maximum allowed dimensions
    const maxWidth = Math.floor(screenWidth * constraints.maxWidthRatio);
    const maxHeight = Math.floor(screenHeight * constraints.maxHeightRatio);

    // Apply constraints
    const constrainedWidth = Math.max(
      constraints.minWidth,
      Math.min(defaultSize.width, maxWidth)
    );

    const constrainedHeight = Math.max(
      constraints.minHeight,
      Math.min(defaultSize.height, maxHeight)
    );

    console.log(
      `getResponsiveWindowSize in windowOperationsSlice (DESKTOP): ${nodeType} - Screen: ${screenWidth}x${screenHeight}, Default: ${defaultSize.width}x${defaultSize.height}, Constrained: ${constrainedWidth}x${constrainedHeight}`
    );

    return {
      width: constrainedWidth,
      height: constrainedHeight,
    };
  },

  /**
   * Open a new window for a node
   */
  openWindow: (node: WindowedNode, historyItem: string): void => {
    const state = get();

    if (!node) {
      return;
    }

    const nodeId = node.id;

    // Use responsive sizing first to determine if we need special positioning
    const { width, height } = state.getResponsiveWindowSize(node.type);
    const { screenDimensions } = state;
    const { isMobile } = screenDimensions;

    // Position windows based on device type
    let x: number, y: number;

    if (isMobile) {
      // Mobile windows start at top-left for fullscreen experience
      x = 0;
      y = 0;
    } else {
      // Desktop windows are offset to maintain visibility of all open windows
      const count = state.openWindows.length;
      x = 100 * (count + 1);
      y = 100 * (count + 1);
    }

    let isMaximized = false;

    // Mobile windows should be maximized by default for fullscreen experience
    // Game applications should also be maximized by default
    const isGameApp =
      node.type === "application" &&
      (node.componentKey === "gtaVi" || node.componentKey === "geoGame");
    if (isMobile || isGameApp) {
      isMaximized = true;
    }

    // Create new window with responsive dimensions
    const baseWindow: WindowType = {
      windowId: `window-${nodeId}-${Date.now()}`, // Unique window ID
      title: node.label,
      nodeId,
      nodeType: node.type,
      width,
      height,
      x,
      y,
      zIndex: state.nextZIndex,
      isMinimized: false,
      isMaximized: isMaximized,
      isResizing: false,
      itemHistory: [historyItem],
      currentHistoryIndex: 0,
    };

    state.createOneWindow(baseWindow);
  },

  /**
   * Open a new window for a node with document configuration
   */
  openWindowWithDocumentConfig: (
    node: WindowedNode,
    historyItem: string,
    documentConfig?: DocumentConfig
  ): void => {
    const state = get();

    if (!node) {
      return;
    }

    const nodeId = node.id;

    // Use responsive sizing first to determine if we need special positioning
    const { width, height } = state.getResponsiveWindowSize(node.type);
    const { screenDimensions } = state;
    const { isMobile } = screenDimensions;

    // Position windows based on device type
    let x: number, y: number;

    if (isMobile) {
      // Mobile windows start at top-left for fullscreen experience
      x = 0;
      y = 0;
    } else {
      // Desktop windows are offset to maintain visibility of all open windows
      const count = state.openWindows.length;
      x = 100 * (count + 1);
      y = 100 * (count + 1);
    }

    let isMaximized = false;

    // Mobile windows should be maximized by default for fullscreen experience
    // Game applications should also be maximized by default
    const isGameApp =
      node.type === "application" &&
      (node.componentKey === "gtaVi" || node.componentKey === "geoGame");
    if (isMobile || isGameApp) {
      isMaximized = true;
    }

    // Create new window with responsive dimensions and document configuration
    const baseWindow: WindowType = {
      windowId: `window-${nodeId}-${Date.now()}`, // Unique window ID
      title: node.label,
      nodeId,
      nodeType: node.type,
      width,
      height,
      x,
      y,
      zIndex: state.nextZIndex,
      isMinimized: false,
      isMaximized: isMaximized,
      isResizing: false,
      itemHistory: [historyItem],
      currentHistoryIndex: 0,
      documentConfig: documentConfig, // Include document configuration
    };

    console.log(
      "openWindowWithDocumentConfig: creating window with config",
      documentConfig
    );
    state.createOneWindow(baseWindow);
  },

  /**
   * Close a window and clean up associated history
   */
  closeWindow: (windowId: WindowType["windowId"]): void => {
    console.log("closeWindow: closing window", windowId);

    const state = get();

    // Clean up finder history for this window if it exists
    const finderHistoryId = `finder-${windowId}`;
    if (state.historyExists(finderHistoryId)) {
      console.log("closeWindow: cleaning up finder history", finderHistoryId);
      state.deleteHistory(finderHistoryId);
    }

    const browserHistoryId = `browser-${windowId}`;
    if (state.historyExists(browserHistoryId)) {
      console.log("closeWindow: cleaning up browser history", browserHistoryId);
      state.deleteHistory(browserHistoryId);
    }

    const terminalHistoryId = `terminal-${windowId}`;
    if (state.historyExists(terminalHistoryId)) {
      console.log(
        "closeWindow: cleaning up terminal history",
        terminalHistoryId
      );
      state.deleteHistory(terminalHistoryId);
    }

    // Finally, delete the window itself
    state.deleteOneWindow((window: WindowType) => window.windowId === windowId);
  },

  /**
   * Focus a window by bringing it to the front (update zIndex)
   */
  focusWindow: (windowId: WindowType["windowId"]): boolean => {
    console.log("focusWindow: focusing window", windowId);

    const state = get();
    const window = state.findOneWindow(
      (w: WindowType) => w.windowId === windowId
    );

    if (!window) {
      return false;
    }

    return state.updateOneWindow((w: WindowType) => w.windowId === windowId, {
      zIndex: state.nextZIndex,
    });
  },

  /**
   * Minimize a window
   */
  minimizeWindow: (windowId: WindowType["windowId"]): boolean => {
    console.log("minimizeWindow: minimizing window", windowId);

    return get().updateOneWindow(
      (window: WindowType) => window.windowId === windowId,
      {
        isMinimized: true,
        isMaximized: false,
      }
    );
  },

  /**
   * Maximize a window
   */
  // TODO
  maximizeWindow: (windowId: WindowType["windowId"]): boolean => {
    console.log("maximizeWindow: maximizing window", windowId);

    return get().updateOneWindow(
      (window: WindowType) => window.windowId === windowId,
      {
        isMaximized: true,
        isMinimized: false,
      }
    );
  },

  // toggleMaximizeWindow:(windowId: WindowType["windowId"]): boolean => {
  //   console.log("maximizeWindow: maximizing window", windowId);

  //   return get().updateOneWindow(
  //     (window: WindowType) => window.windowId === windowId,
  //     {
  //       isMaximized: !window.isMaximized,
  //       isMinimized: false,
  //     }
  //   );
  // },

  //   ! WINDOW FRAME OPERATIONS
  /**
   * Move a window to specific coordinates
   */
  moveWindow: (
    windowId: WindowType["windowId"],
    x: number,
    y: number
  ): boolean => {
    console.log("moveWindow: moving window", windowId, "to", x, ",", y);

    return get().updateOneWindow(
      (window: WindowType) => window.windowId === windowId,
      {
        x,
        y,
      }
    );
  },

  /**
   * Resize a window to specific dimensions
   */
  resizeWindow: (
    windowId: WindowType["windowId"],
    width: number,
    height: number
  ): boolean => {
    console.log(
      "resizeWindow: resizing window",
      windowId,
      "to",
      width,
      "x",
      height
    );

    return get().updateOneWindow(
      (window: WindowType) => window.windowId === windowId,
      {
        width,
        height,
      }
    );
  },

  /**
   * Set window bounds (position + size) in one operation
   */
  setWindowBounds: (
    windowId: WindowType["windowId"],
    bounds: { x: number; y: number; width: number; height: number }
  ): boolean => {
    console.log("setWindowBounds: setting bounds for window", windowId, bounds);

    return get().updateOneWindow(
      (window: WindowType) => window.windowId === windowId,
      bounds
    );
  },

  //   ! WINDOW HISTORY OPERATIONS
  canGoBackInWindowHistory: (windowId: WindowType["windowId"]): boolean => {
    const state = get();
    const window = state.getWindowById(windowId);
    return (window?.currentHistoryIndex ?? 0) > 0;
  },
  canGoForwardInWindowHistory: (windowId: WindowType["windowId"]): boolean => {
    const state = get();
    const window = state.getWindowById(windowId);
    return (
      (window?.currentHistoryIndex ?? 0) < (window?.itemHistory.length ?? 0) - 1
    );
  },
  /**
   * Navigate back in window's history - simple index decrement
   */
  decrementWindowHistoryIndex: (windowId: WindowType["windowId"]): boolean => {
    // console.log("navigateBackInHistory: navigating back in window", windowId);

    const state = get();
    const window = state.getWindowById(windowId);

    if (!window) {
      console.log("navigateBackInHistory: window not found", windowId);
      return false;
    }

    const { itemHistory, currentHistoryIndex } = window;

    if (currentHistoryIndex <= 0 || itemHistory.length === 0) {
      // console.log("navigateBackInHistory: cannot go back", windowId);
      return false;
    }

    // Simple index decrement
    const newIndex = currentHistoryIndex - 1;

    return state.updateWindowById(windowId, {
      currentHistoryIndex: newIndex,
    });
  },

  /**
   * Navigate forward in window's history - simple index increment
   */
  incrementWindowHistoryIndex: (windowId: WindowType["windowId"]): boolean => {
    console.log("goForwardInHistory: navigating forward in window", windowId);

    const state = get();
    const window = state.getWindowById(windowId);

    if (!window) {
      console.log("navigateForwardInHistory: window not found", windowId);
      return false;
    }

    const { itemHistory, currentHistoryIndex } = window;

    if (currentHistoryIndex >= itemHistory.length - 1) {
      console.log("navigateForwardInHistory: cannot go forward", windowId);
      return false;
    }

    // Simple index increment
    const newIndex = currentHistoryIndex + 1;

    return state.updateWindowById(windowId, {
      currentHistoryIndex: newIndex,
    });
  },
  getLocationInHistory: (windowId: WindowType["windowId"]): string => {
    const state = get();
    const window = state.getWindowById(windowId);
    return window?.itemHistory[window?.currentHistoryIndex ?? 0] ?? "";
  },

  /**
   * Add item to window's history and navigate to it
   */
  addToWindowHistory: (
    windowId: WindowType["windowId"],
    item: string
  ): boolean => {
    console.log(
      "addToWindowHistory: adding item to window",
      windowId,
      "item:",
      item
    );

    const state = get();
    const window = state.getWindowById(windowId);

    if (!window) {
      console.log("addToWindowHistory: window not found", windowId);
      return false;
    }

    const currentHistory = window.itemHistory || [];
    const currentIndex = window.currentHistoryIndex ?? -1;

    // Add to history and navigate (remove any forward history if we're in the middle)
    const newHistory = [...currentHistory.slice(0, currentIndex + 1), item];
    const newIndex = newHistory.length - 1;

    return state.updateWindowById(windowId, {
      itemHistory: newHistory,
      currentHistoryIndex: newIndex,
    });
  },

  /**
   * Check if a window is open for a specific node
   */
  isNodeIdWindowOpen: (nodeId: string): boolean => {
    return get().windowExists((window: WindowType) => window.nodeId === nodeId);
  },

  /**
   * Get a window by its ID (builds on findOneWindow)
   */
  getWindowById: (id: WindowType["windowId"]): WindowType | undefined => {
    return get().findOneWindow((window: WindowType) => window.windowId === id);
  },

  /**
   * Get a window by the nodeId it represents
   */
  getWindowByNodeId: (nodeId: string): WindowType | undefined => {
    return get().findOneWindow(
      (window: WindowType) => window.nodeId === nodeId
    );
  },
  /**
   * Update a window by its ID (builds on updateOneWindow)
   */
  updateWindowById: (
    windowId: WindowType["windowId"],
    updates: Partial<WindowType>
  ): boolean => {
    console.log("updateWindowById: updating window", windowId, "with", updates);
    return get().updateOneWindow(
      (window: WindowType) => window.windowId === windowId,
      updates
    );
  },

  // NEW: Open window with custom component key
  openWindowWithComponentKey: (
    node: WindowedNode,
    historyItem: string,
    componentKey: string
  ) => {
    const state = get();

    if (!node) {
      return;
    }

    const nodeId = node.id;

    // Use responsive sizing first to determine if we need special positioning
    const { width, height } = state.getResponsiveWindowSize(node.type);
    const { screenDimensions } = state;
    const { isMobile } = screenDimensions;

    // Position windows based on device type
    let x: number, y: number;

    if (isMobile) {
      // Mobile windows start at top-left for fullscreen experience
      x = 0;
      y = 0;
    } else {
      // Desktop windows are offset to maintain visibility of all open windows
      const count = state.openWindows.length;
      x = 100 * (count + 1);
      y = 100 * (count + 1);
    }

    let isMaximized = false;

    // Mobile windows should be maximized by default for fullscreen experience
    // Game windows should also be maximized by default
    if (isMobile || node.id === "application-gtaVi") {
      isMaximized = true;
    }

    // Create new window with responsive dimensions and custom component key
    const baseWindow: WindowType = {
      windowId: `window-${nodeId}-${Date.now()}`, // Unique window ID
      title: node.label,
      nodeId,
      nodeType: node.type,
      width,
      height,
      x,
      y,
      zIndex: state.nextZIndex,
      isMinimized: false,
      isMaximized: isMaximized,
      isResizing: false,
      itemHistory: [historyItem],
      currentHistoryIndex: 0,
      componentKey, // Custom component key for this window
    };

    state.createOneWindow(baseWindow);
  },
});
