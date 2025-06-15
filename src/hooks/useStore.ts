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

// Combined store interface - now composed of slices
export interface NewDesktopStore
  extends AchievementSlice,
    SelectionSlice,
    EasterEggSlice,
    WindowSlice,
    TerminalSlice,
    SystemSlice,
    BrowserSlice,
    WeatherSlice,
    AchievementSlice,
    NodeCrudSlice,
    NodeOperationsSlice,
    NodeBusinessSlice {}

export const useNewStore = create<NewDesktopStore>((set, get) => ({
  // {operating system}
  ...createSystemSlice(set),
  // {node base crud}
  ...createNodeCrudSlice(set, get),
  // {node operations (derived from base crud)}
  ...createNodeOperationsSlice(set, get),
  // {node business (derived from operations)}
  ...createNodeBusinessSlice(set, get),
  // {achievements}
  ...createAchievementSlice(set),
  // ...createNodeSlice(set, get),
  ...createSelectionSlice(set),
  ...createEasterEggSlice(set, get),
  ...createWindowSlice(set, get),
  ...createTerminalSlice(set, get),
  ...createBrowserSlice(set),
  ...createWeatherSlice(set),
  ...createAchievementSlice(set),
}));
