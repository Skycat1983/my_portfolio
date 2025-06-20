import { defaultNodeMap } from "../../constants/nodes";
import type { NodeMap } from "../../types/nodeTypes";
import type { WindowType } from "../../types/storeTypes";
import type { SetState, GetState } from "../../types/storeTypes";

interface WindowState {
  nodeMap: NodeMap;
  openWindows: WindowType[];
  nextZIndex: number;
}

interface WindowActions {
  // Find operations (predicate-based)
  findOneWindow: (
    predicate: (window: WindowType) => boolean
  ) => WindowType | undefined;
  findManyWindows: (predicate: (window: WindowType) => boolean) => WindowType[];

  // Create operations (generic)
  createOneWindow: (window: WindowType) => boolean;
  createManyWindows: (windows: WindowType[]) => boolean;

  // Update operations (all predicate-based)
  updateOneWindow: (
    predicate: (window: WindowType) => boolean,
    updates: Partial<WindowType>
  ) => boolean;
  updateManyWindows: (
    predicate: (window: WindowType) => boolean,
    updates: Partial<WindowType>
  ) => number;

  // Delete operations (all predicate-based)
  deleteOneWindow: (predicate: (window: WindowType) => boolean) => boolean;
  deleteManyWindows: (predicate: (window: WindowType) => boolean) => number;

  // Query operations (remain here as they're fundamental)
  countWindows: (predicate: (window: WindowType) => boolean) => number;
  windowExists: (predicate: (window: WindowType) => boolean) => boolean;
}

export type WindowCrudSlice = WindowState & WindowActions;

export const createWindowCrudSlice = (
  set: SetState<WindowCrudSlice>,
  get: GetState<WindowCrudSlice>
): WindowCrudSlice => ({
  // Core window data
  openWindows: [],
  nextZIndex: 1000,
  nodeMap: defaultNodeMap,

  // Find operations
  findOneWindow: (predicate: (window: WindowType) => boolean) => {
    const state = get();
    return state.openWindows.find(predicate);
  },

  findManyWindows: (predicate: (window: WindowType) => boolean) => {
    const state = get();
    return state.openWindows.filter(predicate);
  },

  // Create operations (pure - no business logic)
  createOneWindow: (window: WindowType): boolean => {
    console.log(
      "createOneWindow in windowCrudSlice: creating window",
      window.windowId
    );

    const currentState = get();

    // Check if window already exists
    if (currentState.openWindows.find((w) => w.windowId === window.windowId)) {
      console.log("createOneWindow: window already exists", window.windowId);
      return false;
    }

    set((state) => ({
      openWindows: [...state.openWindows, window],
      nextZIndex: Math.max(state.nextZIndex, window.zIndex + 1),
    }));

    return true;
  },

  createManyWindows: (windows: WindowType[]): boolean => {
    console.log(
      "createManyWindows in windowCrudSlice: creating",
      windows.length,
      "windows"
    );

    const currentState = get();

    // Filter out windows that already exist
    const validWindows = windows.filter((window) => {
      if (
        currentState.openWindows.find((w) => w.windowId === window.windowId)
      ) {
        console.log(
          "createManyWindows: skipping existing window",
          window.windowId
        );
        return false;
      }
      return true;
    });

    if (validWindows.length === 0) {
      console.log("createManyWindows: no valid windows to create");
      return false;
    }

    const maxZIndex = Math.max(...validWindows.map((w) => w.zIndex));

    set((state) => ({
      openWindows: [...state.openWindows, ...validWindows],
      nextZIndex: Math.max(state.nextZIndex, maxZIndex + 1),
    }));

    return true;
  },

  // Update operations (all predicate-based)
  updateOneWindow: (
    predicate: (window: WindowType) => boolean,
    updates: Partial<WindowType>
  ): boolean => {
    console.log("updateOneWindow in windowCrudSlice");

    const currentState = get();
    const windowToUpdate = currentState.openWindows.find(predicate);

    if (!windowToUpdate) {
      console.log("updateOneWindow: no window matches predicate");
      return false;
    }

    const updatedWindow = {
      ...windowToUpdate,
      ...updates,
      windowId: windowToUpdate.windowId, // Prevent ID from being changed
    } as WindowType;

    set((state) => ({
      openWindows: state.openWindows.map((window) =>
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

  updateManyWindows: (
    predicate: (window: WindowType) => boolean,
    updates: Partial<WindowType>
  ): number => {
    console.log("updateManyWindows in windowCrudSlice");

    const currentState = get();
    const windowsToUpdate = currentState.openWindows.filter(predicate);

    if (windowsToUpdate.length === 0) {
      console.log("updateManyWindows: no windows match predicate");
      return 0;
    }

    const maxUpdatedZIndex = updates.zIndex ? updates.zIndex : 0;

    set((state) => ({
      openWindows: state.openWindows.map((window) => {
        if (predicate(window)) {
          return {
            ...window,
            ...updates,
            windowId: window.windowId, // Prevent ID from being changed
          } as WindowType;
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

  // Delete operations (all predicate-based)
  deleteOneWindow: (predicate: (window: WindowType) => boolean): boolean => {
    console.log("deleteOneWindow in windowCrudSlice");

    const currentState = get();
    const windowToDelete = currentState.openWindows.find(predicate);

    if (!windowToDelete) {
      console.log("deleteOneWindow: no window matches predicate");
      return false;
    }

    set((state) => ({
      openWindows: state.openWindows.filter(
        (window) => window.windowId !== windowToDelete.windowId
      ),
    }));

    return true;
  },

  deleteManyWindows: (predicate: (window: WindowType) => boolean): number => {
    console.log("deleteManyWindows in windowCrudSlice");

    const currentState = get();
    const windowsToDelete = currentState.openWindows.filter(predicate);

    if (windowsToDelete.length === 0) {
      console.log("deleteManyWindows: no windows match predicate");
      return 0;
    }

    console.log(
      "deleteManyWindows: deleting",
      windowsToDelete.length,
      "windows"
    );

    set((state) => ({
      openWindows: state.openWindows.filter((window) => !predicate(window)),
    }));

    return windowsToDelete.length;
  },

  // Query operations (fundamental operations that belong in CRUD layer)
  countWindows: (predicate: (window: WindowType) => boolean): number => {
    const state = get();
    return state.openWindows.filter(predicate).length;
  },

  windowExists: (predicate: (window: WindowType) => boolean): boolean => {
    const state = get();
    return state.openWindows.some(predicate);
  },
});
