import type { BaseStoreState, SetState } from "../../types/storeTypes";

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
  set: SetState<BaseStoreState>,
  get: () => BaseStoreState
): SelectionSlice => ({
  // Selection state
  selectedNodeId: null,
  selectedNodeIds: [],

  // Original selection actions
  selectOneNode: (nodeId: string) => {
    console.log("selectOneNode in selectionSlice: selecting node", nodeId);
    set({ selectedNodeId: nodeId });
  },

  selectManyNodes: (nodeIds: string[]) => {
    console.log("selectManyNodes in selectionSlice: selecting nodes", nodeIds);
    set({ selectedNodeIds: nodeIds });
  },

  // Stack operations (LIFO - end of array)
  pushStackSelection: (nodeId: string) => {
    console.log("pushStackSelection: adding to path end", nodeId);
    set((state) => {
      const newPath = [...state.selectedNodeIds, nodeId];
      return {
        selectedNodeIds: newPath,
        selectedNodeId: nodeId, // Sync to deepest selection
      };
    });
  },

  popStackSelection: () => {
    console.log("popStackSelection: removing from path end");
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

    console.log("popStackSelection: popped", poppedNode);
    return poppedNode;
  },

  peekStackSelection: () => {
    const state = get();
    const deepestSelection =
      state.selectedNodeIds[state.selectedNodeIds.length - 1] || null;
    console.log("peekStackSelection: deepest selection", deepestSelection);
    return deepestSelection;
  },

  // Heap operations (FIFO - beginning of array)
  unshiftHeapSelection: (nodeId: string) => {
    console.log("unshiftHeapSelection: adding to path beginning", nodeId);
    set((state) => {
      const newPath = [nodeId, ...state.selectedNodeIds];
      return {
        selectedNodeIds: newPath,
        selectedNodeId: newPath[newPath.length - 1] || null, // Keep deepest as selected
      };
    });
  },

  shiftHeapSelection: () => {
    console.log("shiftHeapSelection: removing from path beginning");
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

    console.log("shiftHeapSelection: shifted", shiftedNode);
    return shiftedNode;
  },

  peekHeapSelection: () => {
    const state = get();
    const rootSelection = state.selectedNodeIds[0] || null;
    console.log("peekHeapSelection: root selection", rootSelection);
    return rootSelection;
  },

  // Path management operations
  truncateSelectionStack: (depth: number) => {
    console.log("truncateSelectionStack: truncating path to depth", depth);
    set((state) => {
      const newPath = state.selectedNodeIds.slice(0, depth);
      const newSelected = newPath[newPath.length - 1] || null;

      console.log(
        "truncateSelectionStack: new path",
        newPath,
        "new selected",
        newSelected
      );
      return {
        selectedNodeIds: newPath,
        selectedNodeId: newSelected,
      };
    });
  },

  setSelectionAtDepth: (depth: number, nodeId: string) => {
    console.log(
      "setSelectionAtDepth: setting at depth",
      depth,
      "nodeId",
      nodeId
    );
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

      console.log(
        "setSelectionAtDepth: final path",
        finalPath,
        "new selected",
        newSelected
      );
      return {
        selectedNodeIds: finalPath,
        selectedNodeId: newSelected,
      };
    });
  },

  getSelectionPath: () => {
    const state = get();
    console.log("getSelectionPath: current path", state.selectedNodeIds);
    return [...state.selectedNodeIds];
  },

  getSelectionDepth: () => {
    const state = get();
    const depth = state.selectedNodeIds.length;
    console.log("getSelectionDepth: current depth", depth);
    return depth;
  },

  clearSelectionPath: () => {
    console.log("clearSelectionPath: clearing entire selection path");
    set({
      selectedNodeIds: [],
      selectedNodeId: null,
    });
  },
});
