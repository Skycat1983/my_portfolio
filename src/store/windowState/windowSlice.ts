import type { ApplicationState, SetState, GetState } from "@/types/storeTypes";
import type {
  Window,
  WindowableNode,
  WindowCreationContext,
} from "@/components/window/windowTypes";
import {
  generateWindowId,
  getApplicationConfig,
  requiresHistory,
  type WindowId,
} from "@/constants/applicationRegistry";
import type { DocumentEntry } from "@/components/nodes/nodeTypes";

interface WindowState {
  windows: Window[];
  nextZIndex: number;
}

interface WindowActions {
  // ═══════════════════════════════════════════════════════════════════════════════
  // PREDICATE-BASED CRUD OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════════

  // Find operations (predicate-based)
  findWindow: (predicate: (window: Window) => boolean) => Window | undefined;
  findWindows: (predicate: (window: Window) => boolean) => Window[];
  windowExists: (predicate: (window: Window) => boolean) => boolean;

  // Create operations
  createWindow: (window: Window) => boolean;
  createWindows: (windows: Window[]) => boolean;

  // Update operations (predicate-based)
  updateWindow: (
    predicate: (window: Window) => boolean,
    updates: Partial<Window>
  ) => boolean;
  updateWindowById: (
    windowId: Window["windowId"],
    updates: Partial<Window>
  ) => boolean;
  updateWindows: (
    predicate: (window: Window) => boolean,
    updates: Partial<Window>
  ) => number;

  // Delete operations (predicate-based)
  deleteWindow: (predicate: (window: Window) => boolean) => boolean;
  deleteWindows: (predicate: (window: Window) => boolean) => number;

  // Query operations
  windowCount: (predicate: (window: Window) => boolean) => number;

  // ═══════════════════════════════════════════════════════════════════════════════
  // WINDOW LIFECYCLE OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════════

  openWindow: (node: WindowableNode) => string | null; // Returns windowId or null if failed
  focusWindow: (windowId: WindowId) => boolean; // Returns true if window was found and focused
  closeWindow: (windowId: WindowId) => boolean; // Returns true if window was found and closed
  moveWindow: (windowId: WindowId, x: number, y: number) => boolean; // Returns true if window was found and moved
  resizeWindow: (
    windowId: Window["windowId"],
    width: number,
    height: number
  ) => boolean; // Returns true if window was found and resized

  setWindowBounds: (
    windowId: Window["windowId"],
    bounds: { x: number; y: number; width: number; height: number }
  ) => boolean;

  toggleMaximizeWindow: (windowId: Window["windowId"]) => boolean;
}

export type WindowSlice = WindowState & WindowActions;

export const createWindowSlice = (
  set: SetState<ApplicationState>,
  get: GetState<ApplicationState>
): WindowSlice => {
  const slice: WindowSlice = {
    // ═══════════════════════════════════════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════════════════════════════════════

    windows: [],
    nextZIndex: 1000,
    // ═══════════════════════════════════════════════════════════════════════════════
    // PREDICATE-BASED CRUD OPERATIONS
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Find single window by predicate
     */
    findWindow: (predicate: (window: Window) => boolean) => {
      const state = get();
      return state.windows.find(predicate);
    },

    /**
     * Find multiple windows by predicate
     */
    findWindows: (predicate: (window: Window) => boolean) => {
      const state = get();
      return state.windows.filter(predicate);
    },

    /**
     * Check if any window matches predicate
     */
    windowExists: (predicate: (window: Window) => boolean) => {
      const state = get();
      return state.windows.some(predicate);
    },

    /**
     * Create a single window
     */
    createWindow: (window: Window): boolean => {
      console.log("createWindow: creating window", window.windowId);

      const currentState = get();

      // Check if window already exists
      if (currentState.windows.find((w) => w.windowId === window.windowId)) {
        console.log("createWindow: window already exists", window.windowId);
        return false;
      }

      set((state) => ({
        windows: [...state.windows, window],
        nextZIndex: Math.max(state.nextZIndex, window.zIndex + 1),
      }));

      return true;
    },

    /**
     * Create multiple windows
     */
    createWindows: (windows: Window[]): boolean => {
      console.log("createWindows: creating", windows.length, "windows");

      const currentState = get();

      // Filter out windows that already exist
      const validWindows = windows.filter((window) => {
        if (currentState.windows.find((w) => w.windowId === window.windowId)) {
          console.log(
            "createWindows: skipping existing window",
            window.windowId
          );
          return false;
        }
        return true;
      });

      if (validWindows.length === 0) {
        console.log("createWindows: no valid windows to create");
        return false;
      }

      const maxZIndex = Math.max(...validWindows.map((w) => w.zIndex));

      set((state) => ({
        windows: [...state.windows, ...validWindows],
        nextZIndex: Math.max(state.nextZIndex, maxZIndex + 1),
      }));

      return true;
    },

    /**
     * Update single window by predicate
     */
    updateWindow: (
      predicate: (window: Window) => boolean,
      updates: Partial<Window>
    ): boolean => {
      console.log("updateWindow: updating window with predicate");

      const currentState = get();
      const windowToUpdate = currentState.windows.find(predicate);

      if (!windowToUpdate) {
        console.log("updateWindow: no window matches predicate");
        return false;
      }

      const updatedWindow = {
        ...windowToUpdate,
        ...updates,
        windowId: windowToUpdate.windowId, // Prevent ID from being changed
      } as Window;

      set((state) => ({
        windows: state.windows.map((window) =>
          window.windowId === windowToUpdate.windowId ? updatedWindow : window
        ),
        // Update nextZIndex if we're updating zIndex
        nextZIndex:
          updates.zIndex && updates.zIndex >= state.nextZIndex
            ? updates.zIndex + 1
            : state.nextZIndex,
      }));

      return true;
    },
    updateWindowById: (
      windowId: Window["windowId"],
      updates: Partial<Window>
    ): boolean => {
      console.log("updateWindowById: updating window by ID", windowId);
      return slice.updateWindow(
        (window) => window.windowId === windowId,
        updates
      );
    },

    /**
     * Update multiple windows by predicate
     */
    updateWindows: (
      predicate: (window: Window) => boolean,
      updates: Partial<Window>
    ): number => {
      console.log("updateWindows: updating windows with predicate");

      const currentState = get();
      const windowsToUpdate = currentState.windows.filter(predicate);

      if (windowsToUpdate.length === 0) {
        console.log("updateWindows: no windows match predicate");
        return 0;
      }

      const maxUpdatedZIndex = updates.zIndex ? updates.zIndex : 0;

      set((state) => ({
        windows: state.windows.map((window) => {
          if (predicate(window)) {
            return {
              ...window,
              ...updates,
              windowId: window.windowId, // Prevent ID from being changed
            } as Window;
          }
          return window;
        }),
        nextZIndex:
          maxUpdatedZIndex >= state.nextZIndex
            ? maxUpdatedZIndex + 1
            : state.nextZIndex,
      }));

      return windowsToUpdate.length;
    },

    /**
     * Delete single window by predicate
     */
    deleteWindow: (predicate: (window: Window) => boolean): boolean => {
      console.log("deleteWindow: deleting window with predicate");

      const currentState = get();
      const windowToDelete = currentState.windows.find(predicate);

      if (!windowToDelete) {
        console.log("deleteWindow: no window matches predicate");
        return false;
      }

      set((state) => ({
        windows: state.windows.filter(
          (window) => window.windowId !== windowToDelete.windowId
        ),
      }));

      return true;
    },

    /**
     * Delete multiple windows by predicate
     */
    deleteWindows: (predicate: (window: Window) => boolean): number => {
      console.log("deleteWindows: deleting windows with predicate");

      const currentState = get();
      const windowsToDelete = currentState.windows.filter(predicate);

      if (windowsToDelete.length === 0) {
        console.log("deleteWindows: no windows match predicate");
        return 0;
      }

      console.log("deleteWindows: deleting", windowsToDelete.length, "windows");

      set((state) => ({
        windows: state.windows.filter((window) => !predicate(window)),
      }));

      return windowsToDelete.length;
    },

    /**
     * Count windows matching predicate
     */
    windowCount: (predicate: (window: Window) => boolean): number => {
      const state = get();
      return state.windows.filter(predicate).length;
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // WINDOW LIFECYCLE OPERATIONS
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Open a window from any windowable node (applications, documents, directories)
     */
    openWindow: (node: WindowableNode): string | null => {
      console.log("openWindowFromNode: opening window for node", node.id);

      // Build context from node properties
      const context: WindowCreationContext = {
        nodeId: node.id,
        ...(node.type === "document" && {
          documentConfigId: (node as DocumentEntry).documentConfigId,
        }),
      };

      const config = getApplicationConfig(node.applicationRegistryId);
      const windowId = generateWindowId(node.applicationRegistryId, context);

      // Check if window already exists based on window scope
      const state = get();
      const { windowScope } = config;

      let existingWindow: Window | undefined;

      switch (windowScope) {
        case "per-application":
          // Only one window per application type (e.g., calculator, browser)
          existingWindow = state.windows.find(
            (w) => w.applicationRegistryId === node.applicationRegistryId
          );
          break;

        case "per-nodeId":
          // One window per node (e.g., finder - each directory gets its own window)
          existingWindow = state.windows.find(
            (w) =>
              w.applicationRegistryId === node.applicationRegistryId &&
              w.nodeId === node.id
          );
          break;

        case "per-document":
          // One window per document (e.g., documentEditor)
          //  we can use nodeId since each document node is unique (simpler than tracking documentConfigId separately)
          existingWindow = state.windows.find(
            (w) =>
              w.applicationRegistryId === node.applicationRegistryId &&
              w.nodeId === node.id
          );
          break;

        default:
          console.warn(`Unknown window scope: ${windowScope}`);
          break;
      }

      if (existingWindow) {
        // Use the focusWindow method from this slice
        slice.focusWindow(existingWindow.windowId);
        return existingWindow.windowId;
      }

      // Calculate position (offset for multiple windows)
      const windowCount = state.windows.length;
      const x = 100 * (windowCount + 1);
      const y = 100 * (windowCount + 1);

      // Create new window with registry configuration
      const newWindow: Window = {
        windowId,
        title: node.label, // Use node label as window title
        nodeId: node.id,
        applicationRegistryId: node.applicationRegistryId,
        x,
        y,
        width: config.width,
        height: config.height,
        zIndex: state.nextZIndex,
        fixed: config.fixedSize,
        isMinimized: false,
        isMaximized: config.defaultMaximized,
      };

      // Add the window to the state
      set((state) => ({
        windows: [...state.windows, newWindow],
        nextZIndex: state.nextZIndex + 1,
      }));

      console.log("openWindowFromNode: created window", windowId);
      return windowId;
    },

    /**
     * Focus a window by its ID
     */
    focusWindow: (windowId: WindowableNode["id"]): boolean => {
      console.log("focusWindow: focusing window", windowId);

      const currentState = get();
      const windowToFocus = currentState.windows.find(
        (w) => w.windowId === windowId
      );

      if (!windowToFocus) {
        console.log("focusWindow: no window found with ID", windowId);
        return false;
      }

      // Update zIndex to bring window to front
      set((state) => ({
        windows: state.windows.map((w) =>
          w.windowId === windowId ? { ...w, zIndex: state.nextZIndex } : w
        ),
        nextZIndex: state.nextZIndex + 1,
      }));

      console.log("focusWindow: focused window", windowId);
      return true;
    },

    /**
     * Close a window by its ID and delete its history if required
     */
    closeWindow: (windowId: string): boolean => {
      console.log("closeWindow: closing window", windowId);

      const currentState = get();
      const windowToClose = currentState.windows.find(
        (w) => w.windowId === windowId
      );

      if (!windowToClose) {
        console.log("closeWindow: no window found with ID", windowId);
        return false;
      }

      // Delete the window
      set((state) => ({
        windows: state.windows.filter((w) => w.windowId !== windowId),
      }));

      // Note: For applications that require history, the history entry
      // should be deleted externally using the history slice's deleteHistory action
      // with windowId as the historyId (they are the same for apps that require history)
      if (requiresHistory(windowToClose.applicationRegistryId)) {
        console.log(
          "closeWindow: window requires history - history should be deleted externally"
        );
      }

      console.log("closeWindow: closed window", windowId);
      return true;
    },

    /**
     * Move a window to specific coordinates
     */
    moveWindow: (
      windowId: Window["windowId"],
      x: number,
      y: number
    ): boolean => {
      console.log("moveWindow: moving window", windowId, "to", x, ",", y);
      return slice.updateWindow(
        (window: Window) => window.windowId === windowId,
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
      windowId: Window["windowId"],
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

      return slice.updateWindow(
        (window: Window) => window.windowId === windowId,
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
      windowId: Window["windowId"],
      bounds: { x: number; y: number; width: number; height: number }
    ): boolean => {
      console.log(
        "setWindowBounds: setting bounds for window",
        windowId,
        bounds
      );

      return slice.updateWindow(
        (window: Window) => window.windowId === windowId,
        bounds
      );
    },

    toggleMaximizeWindow: (windowId: Window["windowId"]): boolean => {
      console.log("maximizeWindow: maximizing window", windowId);

      const predicate = (window: Window) => window.windowId === windowId;
      const window = slice.findWindow(predicate);

      if (!window) {
        console.log("toggleMaximizeWindow: no window found with ID", windowId);
        return false;
      }
      return slice.updateWindow(predicate, {
        isMaximized: !window.isMaximized,
      });
    },
  };

  return slice;
};
