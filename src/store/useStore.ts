import { create } from "zustand";
import {
  createEasterEggSlice,
  type EasterEggSlice,
} from "./contentState/easterEggSlice";
// import { createWindowSlice, type WindowSlice } from "../store/windowSlice";
import {
  createSelectionSlice,
  type SelectionSlice,
} from "./nodeState/nodeSelectionSlice";
import {
  createTerminalSlice,
  type TerminalSlice,
} from "./contentState/terminalSlice";

import {
  createSystemSlice,
  type SystemSlice,
} from "./desktopState/systemSlice";
import {
  createBrowserSlice,
  type BrowserSlice,
} from "./contentState/browserSlice";
import {
  createWeatherSlice,
  type WeatherSlice,
} from "./desktopState/weatherSlice";
import {
  createAchievementSlice,
  type AchievementSlice,
} from "./desktopState/achievementsSlice";
import {
  createNodeCrudSlice,
  type NodeCrudSlice,
} from "./nodeState/nodeCrudSlice";
import {
  createNodeOperationsSlice,
  type NodeOperationsSlice,
} from "./nodeState/nodeOperationsSlice";
import {
  createNodeBusinessSlice,
  type NodeBusinessSlice,
} from "./nodeState/nodeBusinessSlice";
import {
  createWindowCrudSlice,
  type WindowCrudSlice,
} from "./windowState/windowCrudSlice";
import {
  createWindowOperationsSlice,
  type WindowOperationsSlice,
} from "./windowState/windowOperationsSlice";
import {
  createDirectoryOperationsSlice,
  type DirectoryOperationsSlice,
} from "./contentState/directorySlice";

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
