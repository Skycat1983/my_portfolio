import type { ApplicationState, SetState } from "@/types/storeTypes";

interface SelectionState {
  selectedNodeId: string | null;
  selectedNodeIds: string[]; // Navigation path - used as stack for column navigation
}

interface SelectionActions {
  selectOneNode: (nodeId: string) => void;
  selectManyNodes: (nodeIds: string[]) => void;

  // Stack operations (LIFO - end of array) for column navigation
  pushStackSelection: (nodeId: string) => void; // Add to end of path
  popStackSelection: () => string | null; // Remove from end, return removed
  peekStackSelection: () => string | null; // View end without removing

  // Heap operations (FIFO - beginning of array) for breadcrumb manipulation
  unshiftHeapSelection: (nodeId: string) => void; // Add to beginning
  shiftHeapSelection: () => string | null; // Remove from beginning, return removed
  peekHeapSelection: () => string | null; // View beginning without removing

  // Path management operations for column navigation
  truncateSelectionStack: (depth: number) => void; // Keep only first N items
  setSelectionAtDepth: (depth: number, nodeId: string) => void; // Set item at specific index
  getSelectionPath: () => string[]; // Get full path array
  getSelectionDepth: () => number; // Get array length
  clearSelectionPath: () => void; // Reset to empty path
}

export type SelectionSlice = SelectionState & SelectionActions;

export const createSelectionSlice = (
  set: SetState<ApplicationState>,
  get: () => ApplicationState
): SelectionSlice => ({
  // Selection state
  selectedNodeId: null,
  selectedNodeIds: [],

  // Original selection actions
  selectOneNode: (nodeId: string) => {
    set({ selectedNodeId: nodeId });
  },

  selectManyNodes: (nodeIds: string[]) => {
    set({ selectedNodeIds: nodeIds });
  },

  // Stack operations (LIFO - end of array)
  pushStackSelection: (nodeId: string) => {
    set((state) => {
      const newPath = [...state.selectedNodeIds, nodeId];
      return {
        selectedNodeIds: newPath,
        selectedNodeId: nodeId, // Sync to deepest selection
      };
    });
  },

  popStackSelection: () => {
    let poppedNode: string | null = null;

    set((state) => {
      if (state.selectedNodeIds.length === 0) return state;

      const newPath = [...state.selectedNodeIds];
      poppedNode = newPath.pop() || null;
      const newSelected = newPath[newPath.length - 1] || null;

      return {
        selectedNodeIds: newPath,
        selectedNodeId: newSelected,
      };
    });

    return poppedNode;
  },

  peekStackSelection: () => {
    const state = get();
    const deepestSelection =
      state.selectedNodeIds[state.selectedNodeIds.length - 1] || null;
    return deepestSelection;
  },

  // Heap operations (FIFO - beginning of array)
  unshiftHeapSelection: (nodeId: string) => {
    set((state) => {
      const newPath = [nodeId, ...state.selectedNodeIds];
      return {
        selectedNodeIds: newPath,
        selectedNodeId: newPath[newPath.length - 1] || null, // Keep deepest as selected
      };
    });
  },

  shiftHeapSelection: () => {
    let shiftedNode: string | null = null;

    set((state) => {
      if (state.selectedNodeIds.length === 0) return state;

      const newPath = [...state.selectedNodeIds];
      shiftedNode = newPath.shift() || null;
      const newSelected = newPath[newPath.length - 1] || null;

      return {
        selectedNodeIds: newPath,
        selectedNodeId: newSelected,
      };
    });

    return shiftedNode;
  },

  peekHeapSelection: () => {
    const state = get();
    const rootSelection = state.selectedNodeIds[0] || null;
    return rootSelection;
  },

  // Path management operations
  truncateSelectionStack: (depth: number) => {
    set((state) => {
      const newPath = state.selectedNodeIds.slice(0, depth);
      const newSelected = newPath[newPath.length - 1] || null;

      return {
        selectedNodeIds: newPath,
        selectedNodeId: newSelected,
      };
    });
  },

  setSelectionAtDepth: (depth: number, nodeId: string) => {
    set((state) => {
      const newPath = [...state.selectedNodeIds];

      // Ensure array is long enough
      while (newPath.length <= depth) {
        newPath.push("");
      }

      // Set the selection at the specified depth
      newPath[depth] = nodeId;

      // Truncate anything beyond this depth
      const finalPath = newPath.slice(0, depth + 1);
      const newSelected = finalPath[finalPath.length - 1] || null;

      return {
        selectedNodeIds: finalPath,
        selectedNodeId: newSelected,
      };
    });
  },

  getSelectionPath: () => {
    const state = get();
    return [...state.selectedNodeIds];
  },

  getSelectionDepth: () => {
    const state = get();
    const depth = state.selectedNodeIds.length;
    return depth;
  },

  clearSelectionPath: () => {
    set({
      selectedNodeIds: [],
      selectedNodeId: null,
    });
  },
});
