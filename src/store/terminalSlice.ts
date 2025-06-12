import type { BaseStoreState, SetState } from "../types/storeTypes";

interface TerminalState {
  isTerminalOpen: boolean;
  terminalZIndex: number;
}

interface TerminalActions {
  openTerminal: () => void;
  closeTerminal: () => void;
  toggleTerminal: () => void;
  focusTerminal: () => void;
}

export type TerminalSlice = TerminalState & TerminalActions;

export const createTerminalSlice = (
  set: SetState<BaseStoreState>
): TerminalSlice => ({
  // Terminal state
  isTerminalOpen: false,
  terminalZIndex: 1000,

  // Terminal actions
  openTerminal: () => {
    console.log("openTerminal in terminalSlice: opening terminal");
    set((state) => ({
      isTerminalOpen: true,
      terminalZIndex: state.nextZIndex,
      nextZIndex: state.nextZIndex + 1,
    }));
  },

  closeTerminal: () => {
    console.log("closeTerminal in terminalSlice: closing terminal");
    set({ isTerminalOpen: false });
  },

  toggleTerminal: () => {
    console.log("toggleTerminal in terminalSlice: toggling terminal");
    set((state) => ({
      isTerminalOpen: !state.isTerminalOpen,
      terminalZIndex: !state.isTerminalOpen
        ? state.nextZIndex
        : state.terminalZIndex,
      nextZIndex: !state.isTerminalOpen
        ? state.nextZIndex + 1
        : state.nextZIndex,
    }));
  },

  focusTerminal: () => {
    console.log("focusTerminal in terminalSlice: focusing terminal");
    set((state) => ({
      terminalZIndex: state.nextZIndex,
      nextZIndex: state.nextZIndex + 1,
    }));
  },
});
