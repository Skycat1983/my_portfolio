import type {
  ApplicationState,
  SetState,
  GetState,
  WindowType,
} from "@/types/storeTypes";

// Generic history instance that can store any type of items
export interface HistoryInstance<T = unknown> {
  id: WindowType["windowId"]; // Unique identifier for this history
  items: T[]; // Generic array of history items
  currentIndex: number; // Current position (-1 = no items, 0 = first item)
}

// The state shape for a single history collection
export interface HistoryCollection {
  histories: Record<string, HistoryInstance>; // Map of ID -> history instance
}

export interface HistoryActions {
  // === LIFECYCLE OPERATIONS ===
  initializeHistory: (
    id: HistoryInstance["id"],
    initialItem: unknown
  ) => boolean;

  createHistory: (id: HistoryInstance["id"], initialItem?: unknown) => boolean;
  deleteHistory: (id: HistoryInstance["id"]) => boolean;
  clearHistory: (id: HistoryInstance["id"]) => boolean;
  historyExists: (id: HistoryInstance["id"]) => boolean;

  // === NAVIGATION OPERATIONS ===
  addToHistory: (id: HistoryInstance["id"], item: unknown) => boolean;
  goBack: (id: HistoryInstance["id"]) => boolean;
  goForward: (id: HistoryInstance["id"]) => boolean;
  goToIndex: (id: HistoryInstance["id"], index: number) => boolean;

  // === QUERY OPERATIONS ===
  canGoBack: (id: HistoryInstance["id"]) => boolean;
  canGoForward: (id: HistoryInstance["id"]) => boolean;
  getCurrentItem: (id: HistoryInstance["id"]) => unknown | undefined;
  getCurrentIndex: (id: HistoryInstance["id"]) => number;
  getHistory: (id: HistoryInstance["id"]) => HistoryInstance | undefined;
  getHistoryItems: (id: HistoryInstance["id"]) => unknown[];
  getHistoryLength: (id: HistoryInstance["id"]) => number;
}

export type HistorySlice = HistoryCollection & HistoryActions;

export const createHistorySlice = (
  set: SetState<ApplicationState>,
  get: GetState<ApplicationState>
): HistorySlice => ({
  // Initial state
  histories: {},

  // === LIFECYCLE OPERATIONS ===

  initializeHistory: (
    id: HistoryInstance["id"],
    initialItem: unknown
  ): boolean => {
    console.log(
      "BROWSER_DEBUG initializeHistory in historySlice:",
      id,
      initialItem
    );

    const state = get();

    // If history already exists, don't reinitialize
    if (state.histories[id]) {
      console.log("initializeHistory: history already exists", id);
      return false;
    }

    // Create new history instance
    const newHistory: HistoryInstance = {
      id,
      items: [initialItem],
      currentIndex: 0,
    };

    set((state) => ({
      histories: {
        ...state.histories,
        [id]: newHistory,
      },
    }));

    return true;
  },

  /**
   * Create a new history instance with optional initial item
   */
  createHistory: (id: HistoryInstance["id"], initialItem: unknown): boolean => {
    // console.log(
    //   "createHistory in historySlice: creating history",
    //   id,
    //   "with initialItem:",
    //   initialItem
    // );
    console.log(
      "BROWSER_DEBUG createHistory in historySlice:",
      id,
      initialItem
    );

    const state = get();

    if (state.histories[id]) {
      console.log("createHistory: history already exists", id);
      return false;
    }

    const newHistory: HistoryInstance = {
      id,
      items: [initialItem],
      currentIndex: 0,
    };

    set((state) => ({
      histories: {
        ...state.histories,
        [id]: newHistory,
      },
    }));

    return true;
  },

  /**
   * Delete a history instance
   */
  deleteHistory: (id: HistoryInstance["id"]): boolean => {
    console.log("deleteHistory in historySlice: deleting history", id);

    const state = get();

    if (!state.histories[id]) {
      console.log("deleteHistory: history does not exist", id);
      return false;
    }

    set((state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [id]: _removed, ...remainingHistories } = state.histories;
      return {
        histories: remainingHistories,
      };
    });

    return true;
  },

  /**
   * Clear all items from a history instance but keep the instance
   */
  clearHistory: (id: HistoryInstance["id"]): boolean => {
    console.log("clearHistory in historySlice: clearing history", id);

    const state = get();

    if (!state.histories[id]) {
      console.log("clearHistory: history does not exist", id);
      return false;
    }

    set((state) => ({
      histories: {
        ...state.histories,
        [id]: {
          ...state.histories[id],
          items: [],
          currentIndex: -1,
        },
      },
    }));

    return true;
  },

  /**
   * Check if a history instance exists
   */
  historyExists: (id: HistoryInstance["id"]): boolean => {
    return !!get().histories[id];
  },

  // === NAVIGATION OPERATIONS ===

  /**
   * Add item to history and navigate to it
   * Removes any forward history if adding from middle
   */
  addToHistory: (id: HistoryInstance["id"], item: unknown): boolean => {
    console.log(
      "addToHistory in historySlice: adding to history",
      id,
      "item:",
      item
    );

    const state = get();
    const history = state.histories[id];

    if (!history) {
      console.log("addToHistory: history does not exist", id);
      return false;
    }

    // Remove any forward history and add new item
    const newItems = [
      ...history.items.slice(0, history.currentIndex + 1),
      item,
    ];
    const newIndex = newItems.length - 1;

    set((state) => ({
      histories: {
        ...state.histories,
        [id]: {
          ...state.histories[id],
          items: newItems,
          currentIndex: newIndex,
        },
      },
    }));

    return true;
  },

  /**
   * Navigate back in history
   */
  goBack: (id: HistoryInstance["id"]): boolean => {
    console.log("goBack in historySlice: going back in history", id);

    const state = get();
    const history = state.histories[id];

    if (!history) {
      console.log("goBack: history does not exist", id);
      return false;
    }

    if (history.currentIndex <= 0) {
      console.log("goBack: cannot go back, already at beginning", id);
      return false;
    }

    const newIndex = history.currentIndex - 1;

    set((state) => ({
      histories: {
        ...state.histories,
        [id]: {
          ...state.histories[id],
          currentIndex: newIndex,
        },
      },
    }));

    return true;
  },

  /**
   * Navigate forward in history
   */
  goForward: (id: HistoryInstance["id"]): boolean => {
    console.log("goForward in historySlice: going forward in history", id);

    const state = get();
    const history = state.histories[id];

    if (!history) {
      console.log("goForward: history does not exist", id);
      return false;
    }

    if (history.currentIndex >= history.items.length - 1) {
      console.log("goForward: cannot go forward, already at end", id);
      return false;
    }

    const newIndex = history.currentIndex + 1;

    set((state) => ({
      histories: {
        ...state.histories,
        [id]: {
          ...state.histories[id],
          currentIndex: newIndex,
        },
      },
    }));

    return true;
  },

  /**
   * Navigate to specific index in history
   */
  goToIndex: (id: HistoryInstance["id"], index: number): boolean => {
    console.log(
      "goToIndex in historySlice: going to index",
      index,
      "in history",
      id
    );

    const state = get();
    const history = state.histories[id];

    if (!history) {
      console.log("goToIndex: history does not exist", id);
      return false;
    }

    if (index < 0 || index >= history.items.length) {
      console.log("goToIndex: index out of bounds", index, "for history", id);
      return false;
    }

    set((state) => ({
      histories: {
        ...state.histories,
        [id]: {
          ...state.histories[id],
          currentIndex: index,
        },
      },
    }));

    return true;
  },

  // === QUERY OPERATIONS ===

  /**
   * Check if can navigate back in history
   */
  canGoBack: (id: HistoryInstance["id"]): boolean => {
    const history = get().histories[id];
    return history ? history.currentIndex > 0 : false;
  },

  /**
   * Check if can navigate forward in history
   */
  canGoForward: (id: HistoryInstance["id"]): boolean => {
    const history = get().histories[id];
    return history ? history.currentIndex < history.items.length - 1 : false;
  },

  /**
   * Get current item in history
   */
  getCurrentItem: (id: HistoryInstance["id"]): unknown | undefined => {
    const history = get().histories[id];
    if (
      !history ||
      history.currentIndex < 0 ||
      history.currentIndex >= history.items.length
    ) {
      return undefined;
    }
    return history.items[history.currentIndex];
  },

  /**
   * Get current index in history
   */
  getCurrentIndex: (id: HistoryInstance["id"]): number => {
    const history = get().histories[id];
    return history ? history.currentIndex : -1;
  },

  /**
   * Get complete history instance
   */
  getHistory: (id: string): HistoryInstance | undefined => {
    return get().histories[id];
  },

  /**
   * Get all items from history
   */
  getHistoryItems: (id: string): unknown[] => {
    const history = get().histories[id];
    return history ? history.items : [];
  },

  /**
   * Get length of history
   */
  getHistoryLength: (id: string): number => {
    const history = get().histories[id];
    return history ? history.items.length : 0;
  },
});
