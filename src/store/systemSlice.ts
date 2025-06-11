import type { BaseStoreState, SetState } from "../types/storeTypes";

export type OS = "mac" | "windows";

export interface SystemState {
  os: OS;
}

interface SystemActions {
  toggleOS: () => void;
}

export type SystemSlice = SystemState & SystemActions;

export const createSystemSlice = (
  set: SetState<BaseStoreState>
): SystemSlice => ({
  os: "windows",
  toggleOS: () =>
    set((state) => ({ os: state.os === "mac" ? "windows" : "mac" })),
});
