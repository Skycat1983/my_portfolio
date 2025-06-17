import type { BaseStoreState, SetState } from "../../types/storeTypes";

export type OperatingSystem = "mac" | "windows";

export interface SystemState {
  operatingSystem: OperatingSystem;
}

interface SystemActions {
  toggleOS: () => void;
}

export type SystemSlice = SystemState & SystemActions;

export const createSystemSlice = (
  set: SetState<BaseStoreState>
): SystemSlice => ({
  operatingSystem: "mac",
  toggleOS: () =>
    set((state) => ({
      operatingSystem: state.operatingSystem === "mac" ? "windows" : "mac",
    })),
});
