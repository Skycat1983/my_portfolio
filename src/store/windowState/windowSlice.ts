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
  type ApplicationRegistryId,
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
  findWindowByApplicationId: (
    applicationId: ApplicationRegistryId
  ) => Window | undefined;
  findWindowById: (windowId: WindowId) => Window | undefined;
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
  openApplication: (applicationId: ApplicationRegistryId) => string | null; // Returns windowId or null if failed
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

    findWindowById: (windowId: WindowId) => {
      const state = get();
      return state.windows.find((w) => w.windowId === windowId);
    },

    findWindowByApplicationId: (applicationId: ApplicationRegistryId) => {
      const state = get();
      return state.windows.find(
        (w) => w.applicationRegistryId === applicationId
      );
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
      const currentState = get();

      // Check if window already exists
      if (currentState.windows.find((w) => w.windowId === window.windowId)) {
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
      const currentState = get();

      // Filter out windows that already exist
      const validWindows = windows.filter((window) => {
        if (currentState.windows.find((w) => w.windowId === window.windowId)) {
          return false;
        }
        return true;
      });

      if (validWindows.length === 0) {
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
      const currentState = get();
      const windowToUpdate = currentState.windows.find(predicate);

      if (!windowToUpdate) {
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
      const currentState = get();
      const windowsToUpdate = currentState.windows.filter(predicate);

      if (windowsToUpdate.length === 0) {
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
      const currentState = get();
      const windowToDelete = currentState.windows.find(predicate);

      if (!windowToDelete) {
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
      const currentState = get();
      const windowsToDelete = currentState.windows.filter(predicate);

      if (windowsToDelete.length === 0) {
        return 0;
      }

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

      // Add the window to the state - calculate z-index within set callback
      set((currentState) => {
        const highestWindowZIndex =
          currentState.windows.length > 0
            ? Math.max(...currentState.windows.map((window) => window.zIndex))
            : 0;

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
          zIndex: highestWindowZIndex + 1,
          fixed: config.fixedSize,
          isMinimized: false,
          isMaximized: config.defaultMaximized,
        };

        return {
          windows: [...currentState.windows, newWindow],
        };
      });

      return windowId;
    },

    /**
     * Open an application window directly by applicationId
     */
    openApplication: (applicationId: ApplicationRegistryId): string | null => {
      const config = getApplicationConfig(applicationId);
      const windowId = generateWindowId(applicationId, {});

      // Check if window already exists based on window scope
      const state = get();
      const { windowScope } = config;

      let existingWindow: Window | undefined;

      switch (windowScope) {
        case "per-application":
          // Only one window per application type
          existingWindow = state.windows.find(
            (w) => w.applicationRegistryId === applicationId
          );
          break;

        case "per-nodeId":
        case "per-document":
          // These scopes require specific context, so we can't open them directly
          console.warn(
            `Cannot open ${applicationId} directly - requires node context`
          );
          return null;

        default:
          console.warn(`Unknown window scope: ${windowScope}`);
          break;
      }

      if (existingWindow) {
        slice.focusWindow(existingWindow.windowId);
        return existingWindow.windowId;
      }

      // Calculate position (offset for multiple windows)
      const windowCount = state.windows.length;
      const x = 100 * (windowCount + 1);
      const y = 100 * (windowCount + 1);

      // Add the window to the state - calculate z-index within set callback
      set((currentState) => {
        const highestWindowZIndex =
          currentState.windows.length > 0
            ? Math.max(...currentState.windows.map((window) => window.zIndex))
            : 0;

        // Create new window with registry configuration
        const newWindow: Window = {
          windowId,
          title: applicationId, // Use applicationId as window title
          nodeId: `${applicationId}-app`, // Generate a synthetic nodeId
          applicationRegistryId: applicationId,
          x,
          y,
          width: config.width,
          height: config.height,
          zIndex: highestWindowZIndex + 1,
          fixed: config.fixedSize,
          isMinimized: false,
          isMaximized: config.defaultMaximized,
        };

        return {
          windows: [...currentState.windows, newWindow],
        };
      });

      return windowId;
    },

    /**
     * Focus a window by its ID
     */
    focusWindow: (windowId: WindowableNode["id"]): boolean => {
      const currentState = get();
      const windowToFocus = currentState.windows.find(
        (w) => w.windowId === windowId
      );

      if (!windowToFocus) {
        return false;
      }

      // Update zIndex to bring window to front - calculate highest z-index within set callback
      set((state) => {
        const highestWindowZIndex =
          state.windows.length > 0
            ? Math.max(...state.windows.map((window) => window.zIndex))
            : 0;

        return {
          windows: state.windows.map((w) =>
            w.windowId === windowId
              ? { ...w, zIndex: highestWindowZIndex + 1 }
              : w
          ),
        };
      });

      return true;
    },

    /**
     * Close a window by its ID and delete its history if required
     */
    closeWindow: (windowId: WindowId): boolean => {
      const currentState = get();
      const windowToClose = currentState.windows.find(
        (w) => w.windowId === windowId
      );

      if (!windowToClose) {
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
      return slice.updateWindow(
        (window: Window) => window.windowId === windowId,
        bounds
      );
    },

    toggleMaximizeWindow: (windowId: Window["windowId"]): boolean => {
      const predicate = (window: Window) => window.windowId === windowId;
      const window = slice.findWindow(predicate);

      if (!window) {
        return false;
      }
      return slice.updateWindow(predicate, {
        isMaximized: !window.isMaximized,
      });
    },
  };

  return slice;
};
