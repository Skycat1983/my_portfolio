import { create } from "zustand";
import {
  createEasterEggSlice,
  type EasterEggSlice,
} from "../store/easterEggSlice";
import { createWindowSlice, type WindowSlice } from "../store/windowSlice";
import { createNodeSlice, type NodeSlice } from "../store/nodeSlice";
import {
  createSelectionSlice,
  type SelectionSlice,
} from "../store/selectionSlice";
import {
  createTerminalSlice,
  type TerminalSlice,
} from "../store/terminalSlice";
import {
  createNodeMovementSlice,
  type NodeMovementSlice,
} from "../store/nodeMovementSlice";
import { createSystemSlice, type SystemSlice } from "../store/systemSlice";
import { createBrowserSlice, type BrowserSlice } from "../store/browserSlice";
import { createWeatherSlice, type WeatherSlice } from "../store/weatherSlice";

// Combined store interface - now composed of slices
export interface NewDesktopStore
  extends NodeSlice,
    SelectionSlice,
    EasterEggSlice,
    WindowSlice,
    TerminalSlice,
    NodeMovementSlice,
    SystemSlice,
    BrowserSlice,
    WeatherSlice {}

// Properly typed set/get functions for slices
export type SetState = (
  partial:
    | Partial<NewDesktopStore>
    | ((state: NewDesktopStore) => Partial<NewDesktopStore>)
) => void;
export type GetState = () => NewDesktopStore;

export const useNewStore = create<NewDesktopStore>((set, get) => ({
  // All functionality now comes from slices
  ...createSystemSlice(set),
  ...createNodeSlice(set, get),
  ...createSelectionSlice(set),
  ...createEasterEggSlice(set, get),
  ...createWindowSlice(set, get),
  ...createTerminalSlice(set),
  ...createNodeMovementSlice(set, get),
  ...createBrowserSlice(set),
  ...createWeatherSlice(set),
}));
