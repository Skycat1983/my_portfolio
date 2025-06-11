import type { BaseStoreState, SetState } from "../types/storeTypes";

interface TerminalState {
  isTerminalOpen: boolean;
}

interface TerminalActions {
  openTerminal: () => void;
  closeTerminal: () => void;
  toggleTerminal: () => void;
}

export type TerminalSlice = TerminalState & TerminalActions;

export const createTerminalSlice = (
  set: SetState<BaseStoreState>
): TerminalSlice => ({
  // Terminal state
  isTerminalOpen: false,

  // Terminal actions
  openTerminal: () => {
    console.log("openTerminal in terminalSlice: opening terminal");
    set({ isTerminalOpen: true });
  },

  closeTerminal: () => {
    console.log("closeTerminal in terminalSlice: closing terminal");
    set({ isTerminalOpen: false });
  },

  toggleTerminal: () => {
    console.log("toggleTerminal in terminalSlice: toggling terminal");
    set((state) => ({ isTerminalOpen: !state.isTerminalOpen }));
  },
});
