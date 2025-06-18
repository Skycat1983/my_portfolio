import type { BaseStoreState, SetState } from "../../types/storeTypes";

export type OperatingSystem = "mac" | "windows";

export interface SystemState {
  operatingSystem: OperatingSystem;
  wifiEnabled: boolean;
}

interface SystemActions {
  toggleOS: () => void;
  toggleWifi: () => void;
}

export type SystemSlice = SystemState & SystemActions;

export const createSystemSlice = (
  set: SetState<BaseStoreState>
): SystemSlice => ({
  operatingSystem: "mac",
  wifiEnabled: false,
  toggleOS: () =>
    set((state) => ({
      operatingSystem: state.operatingSystem === "mac" ? "windows" : "mac",
    })),
  toggleWifi: () =>
    set((state) => ({
      wifiEnabled: !state.wifiEnabled,
    })),
});
