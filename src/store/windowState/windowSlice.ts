import type { ApplicationState, SetState, GetState } from "@/types/storeTypes";
import type {
  Window,
  WindowCreationContext,
} from "@/components/window/windowTypes";
import type { ApplicationRegistryId } from "@/constants/applicationRegistry";
import {
  generateWindowId as createWindowId,
  getApplicationConfig,
} from "@/constants/applicationRegistry";
import type { NodeEntry, ApplicationEntry } from "@/components/nodes/nodeTypes";

interface WindowState {
  windows: Window[];
}

interface WindowActions {
  // ═══════════════════════════════════════════════════════════════════════════════
  // PREDICATE-BASED CRUD OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════════

  // Find operations (predicate-based)
  findWindow: (predicate: (window: Window) => boolean) => Window | undefined;
  findWindows: (predicate: (window: Window) => boolean) => Window[];
  hasWindow: (predicate: (window: Window) => boolean) => boolean;

  // Create operations
  createWindow: (window: Window) => boolean;
  createWindows: (windows: Window[]) => boolean;

  // Update operations (predicate-based)
  updateWindow: (
    predicate: (window: Window) => boolean,
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
  // REGISTRY-BASED SMART OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════════

  createWindowFromNode: (
    node: NodeEntry,
    context?: WindowCreationContext
  ) => string | null; // Returns windowId or null if failed

  openOrFocusWindow: (
    applicationRegistryId: ApplicationRegistryId,
    context?: WindowCreationContext
  ) => string | null; // Returns windowId (existing or new)
}

export type WindowSlice = WindowState & WindowActions;

export const createWindowSlice = (
  set: SetState<ApplicationState>,
  get: GetState<ApplicationState>
): WindowSlice => ({
  // ═══════════════════════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════════════════════

  windows: [],

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
  hasWindow: (predicate: (window: Window) => boolean) => {
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
        console.log("createWindows: skipping existing window", window.windowId);
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
  // REGISTRY-BASED SMART OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Create a window from a node using application registry configuration
   */
  createWindowFromNode: (
    node: NodeEntry,
    context?: WindowCreationContext
  ): string | null => {
    console.log("createWindowFromNode: creating window for node", node.id);

    if (node.type !== "application") {
      console.error("createWindowFromNode: node must be application type");
      return null;
    }

    const applicationNode = node as ApplicationEntry;

    // Use applicationRegistryId if available, fallback to componentKey
    const applicationRegistryId = (applicationNode.applicationRegistryId ||
      applicationNode.componentKey) as ApplicationRegistryId;

    const config = getApplicationConfig(applicationRegistryId);

    // Generate window ID based on application scope
    const windowId = createWindowId(applicationRegistryId, {
      nodeId: node.id,
      ...context,
    });

    // Check if window already exists (for single-instance apps)
    if (!config.allowMultipleWindows) {
      const state = get();
      const existingWindow = state.windows.find((w) => w.windowId === windowId);
      if (existingWindow) {
        console.log("createWindowFromNode: focusing existing window", windowId);
        // Focus existing window by updating its zIndex
        state.updateWindow((w) => w.windowId === windowId, {
          zIndex: state.nextZIndex,
        });
        return windowId;
      }
    }

    const state = get();

    // Calculate position (offset for multiple windows)
    const windowCount = state.windows.length;
    const x = 100 * (windowCount + 1);
    const y = 100 * (windowCount + 1);

    // Create new window with registry configuration
    const newWindow: Window = {
      windowId,
      title: node.label,
      nodeId: node.id,
      applicationRegistryId,
      x,
      y,
      width: config.width,
      height: config.height,
      zIndex: state.nextZIndex,
      fixed: config.fixedSize,
      isMinimized: false,
      isMaximized: config.defaultMaximized,
    };

    const success = state.createWindow(newWindow);

    if (success) {
      console.log("createWindowFromNode: created window", windowId);
      return windowId;
    }

    return null;
  },

  /**
   * Open window or focus existing based on application configuration
   */
  openOrFocusWindow: (
    applicationRegistryId: ApplicationRegistryId,
    context?: WindowCreationContext
  ): string | null => {
    console.log("openOrFocusWindow: processing", applicationRegistryId);

    const config = getApplicationConfig(applicationRegistryId);

    // Generate potential window ID
    const windowId = createWindowId(applicationRegistryId, context);

    // For single-instance apps, check if already open
    if (!config.allowMultipleWindows) {
      const state = get();
      const existingWindow = state.findWindow((w) => w.windowId === windowId);
      if (existingWindow) {
        console.log("openOrFocusWindow: focusing existing", windowId);
        state.updateWindow((w) => w.windowId === windowId, {
          zIndex: state.nextZIndex,
        });
        return windowId;
      }
    }

    // For multi-instance apps or when no existing window, we need a node
    console.log("openOrFocusWindow: would need node to create new window");
    return null; // Caller should use createWindowFromNode with actual node
  },
});
