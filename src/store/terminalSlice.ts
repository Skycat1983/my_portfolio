import type { BaseStoreState, SetState } from "../types/storeTypes";

interface TerminalState {
  isTerminalOpen: boolean;
  terminalZIndex: number;
  currentWorkingDirectory: string;
  terminalHistory: string[];
}

interface TerminalActions {
  openTerminal: () => void;
  closeTerminal: () => void;
  toggleTerminal: () => void;
  focusTerminal: () => void;
  setCurrentWorkingDirectory: (directory: string) => void;
  addToHistory: (command: string) => void;
  clearHistory: () => void;
}

export type TerminalSlice = TerminalState & TerminalActions;

export const createTerminalSlice = (
  set: SetState<BaseStoreState>
): TerminalSlice => ({
  // Terminal state
  isTerminalOpen: false,
  terminalZIndex: 1000,
  currentWorkingDirectory: "", // Will be set to root directory on init
  terminalHistory: [],

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

  setCurrentWorkingDirectory: (directory: string) => {
    console.log(
      "setCurrentWorkingDirectory in terminalSlice: setting to",
      directory
    );
    set((state) => ({
      ...state,
      currentWorkingDirectory: directory,
    }));
  },

  addToHistory: (command: string) => {
    console.log("addToHistory in terminalSlice: adding command", command);
    set((state) => {
      const terminalState = state as BaseStoreState & TerminalState;
      return {
        ...state,
        terminalHistory: [...terminalState.terminalHistory, command],
      };
    });
  },

  clearHistory: () => {
    console.log("clearHistory in terminalSlice: clearing history");
    set((state) => ({
      ...state,
      terminalHistory: [],
    }));
  },
});
