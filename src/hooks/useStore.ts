import { create } from "zustand";
import {
  createEasterEggSlice,
  type EasterEggSlice,
} from "../store/contentState/easterEggSlice";
// import { createWindowSlice, type WindowSlice } from "../store/windowSlice";
import {
  createSelectionSlice,
  type SelectionSlice,
} from "../store/nodeState/nodeSelectionSlice";
import {
  createTerminalSlice,
  type TerminalSlice,
} from "../store/contentState/terminalSlice";

import {
  createSystemSlice,
  type SystemSlice,
} from "../store/systemState/systemSlice";
import {
  createBrowserSlice,
  type BrowserSlice,
} from "../store/contentState/browserSlice";
import {
  createWeatherSlice,
  type WeatherSlice,
} from "../store/systemState/weatherSlice";
import {
  createAchievementSlice,
  type AchievementSlice,
} from "../store/systemState/achievementsSlice";
import {
  createNodeCrudSlice,
  type NodeCrudSlice,
} from "../store/nodeState/nodeCrudSlice";
import {
  createNodeOperationsSlice,
  type NodeOperationsSlice,
} from "../store/nodeState/nodeOperationsSlice";
import {
  createNodeBusinessSlice,
  type NodeBusinessSlice,
} from "../store/nodeState/nodeBusinessSlice";
import {
  createWindowCrudSlice,
  type WindowCrudSlice,
} from "../store/windowState/windowCrudSlice";
import {
  createWindowOperationsSlice,
  type WindowOperationsSlice,
} from "../store/windowState/windowOperationsSlice";
import {
  createDirectoryOperationsSlice,
  type DirectoryOperationsSlice,
} from "../store/contentState/directorySlice";

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
    DirectoryOperationsSlice,
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
  // {directory operations (derived from window crud)}
  ...createDirectoryOperationsSlice(set, get),
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
