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
import {
  createAchievementSlice,
  type AchievementSlice,
} from "../store/achievementsSlice";

// Combined store interface - now composed of slices
export interface NewDesktopStore
  extends NodeSlice,
    AchievementSlice,
    SelectionSlice,
    EasterEggSlice,
    WindowSlice,
    TerminalSlice,
    NodeMovementSlice,
    SystemSlice,
    BrowserSlice,
    WeatherSlice,
    AchievementSlice {}

export const useNewStore = create<NewDesktopStore>((set, get) => ({
  // All functionality now comes from slices
  ...createSystemSlice(set),
  ...createAchievementSlice(set),
  ...createNodeSlice(set, get),
  ...createSelectionSlice(set),
  ...createEasterEggSlice(set, get),
  ...createWindowSlice(set, get),
  ...createTerminalSlice(set),
  ...createNodeMovementSlice(set, get),
  ...createBrowserSlice(set),
  ...createWeatherSlice(set),
  ...createAchievementSlice(set),
}));
