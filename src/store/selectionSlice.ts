import type { BaseStoreState, SetState } from "../types/storeTypes";

interface SelectionState {
  selectedNodeId: string | null;
  selectedNodeIds: string[];
}

interface SelectionActions {
  selectOneNode: (nodeId: string) => void;
  selectManyNodes: (nodeIds: string[]) => void;
}

export type SelectionSlice = SelectionState & SelectionActions;

export const createSelectionSlice = (
  set: SetState<BaseStoreState>
): SelectionSlice => ({
  // Selection state
  selectedNodeId: null,
  selectedNodeIds: [],
  // Selection actions
  selectOneNode: (nodeId: string) => {
    console.log("selectOneNode in selectionSlice: selecting node", nodeId);
    set({ selectedNodeId: nodeId });
  },
  selectManyNodes: (nodeIds: string[]) => {
    console.log("selectManyNodes in selectionSlice: selecting nodes", nodeIds);
    set({ selectedNodeIds: nodeIds });
  },
});
