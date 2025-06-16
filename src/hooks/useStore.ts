import { create } from "zustand";
import {
  createEasterEggSlice,
  type EasterEggSlice,
} from "../store/easterEggSlice";
// import { createWindowSlice, type WindowSlice } from "../store/windowSlice";
import {
  createSelectionSlice,
  type SelectionSlice,
} from "../store/selectionSlice";
import {
  createTerminalSlice,
  type TerminalSlice,
} from "../store/terminalSlice";

import { createSystemSlice, type SystemSlice } from "../store/systemSlice";
import { createBrowserSlice, type BrowserSlice } from "../store/browserSlice";
import { createWeatherSlice, type WeatherSlice } from "../store/weatherSlice";
import {
  createAchievementSlice,
  type AchievementSlice,
} from "../store/achievementsSlice";
import {
  createNodeCrudSlice,
  type NodeCrudSlice,
} from "../store/nodeCrudSlice";
import {
  createNodeOperationsSlice,
  type NodeOperationsSlice,
} from "../store/nodeOperationsSlice";
import {
  createNodeBusinessSlice,
  type NodeBusinessSlice,
} from "../store/nodeBusinessSlice";
import {
  createWindowCrudSlice,
  type WindowCrudSlice,
} from "../store/windowCrudSlice";
import {
  createWindowOperationsSlice,
  type WindowOperationsSlice,
} from "../store/windowOperationsSlice";

// Combined store interface - now composed of slices
export interface NewDesktopStore
  extends NodeCrudSlice,
    NodeOperationsSlice,
    NodeBusinessSlice,
    AchievementSlice,
    SelectionSlice,
    EasterEggSlice,
    WindowCrudSlice,
    WindowOperationsSlice,
    // WindowSlice, // Temporarily disabled to avoid conflicts
    TerminalSlice,
    SystemSlice,
    BrowserSlice,
    WeatherSlice {}

export const useNewStore = create<NewDesktopStore>((set, get) => ({
  // {operating system}
  ...createSystemSlice(set),
  // {node base crud}
  ...createNodeCrudSlice(set, get),
  // {node operations (derived from base crud)}
  ...createNodeOperationsSlice(set, get),
  // {node business (derived from operations)}
  ...createNodeBusinessSlice(set, get),

  ...createSelectionSlice(set),
  // {window base crud}
  ...createWindowCrudSlice(set, get),
  // {window operations (derived from window crud)}
  ...createWindowOperationsSlice(set, get),
  // {easter egg}
  // {achievements}
  ...createAchievementSlice(set),
  // ...createNodeSlice(set, get),
  ...createEasterEggSlice(set, get),
  // ...createWindowSlice(set, get), // Temporarily disabled to avoid conflicts
  ...createTerminalSlice(set, get),
  ...createBrowserSlice(set),
  ...createWeatherSlice(set),
}));
