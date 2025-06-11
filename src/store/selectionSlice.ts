import type { BaseStoreState, SetState } from "../types/storeTypes";

interface SelectionState {
  selectedNodeId: string | null;
}

interface SelectionActions {
  selectNode: (nodeId: string) => void;
}

export type SelectionSlice = SelectionState & SelectionActions;

export const createSelectionSlice = (
  set: SetState<BaseStoreState>
): SelectionSlice => ({
  // Selection state
  selectedNodeId: null,

  // Selection actions
  selectNode: (nodeId: string) => {
    console.log("selectNode in selectionSlice: selecting node", nodeId);
    set({ selectedNodeId: nodeId });
  },
});
