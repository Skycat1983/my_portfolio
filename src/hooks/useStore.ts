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
  createGameSlice,
  type GameSlice,
} from "../store/contentState/gameSlice";
import {
  createDocumentRegistrySlice,
  type DocumentRegistrySlice,
} from "../store/contentState/documentRegistrySlice";

import {
  createSystemSlice,
  type SystemSlice,
} from "../store/systemState/systemSlice";

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
  type WindowOperationsActions,
} from "../store/windowState/windowOperationsSlice";

// Combined store interface - now composed of slices
export interface NewDesktopStore
  extends NodeCrudSlice,
    NodeOperationsSlice,
    NodeBusinessSlice,
    AchievementSlice,
    SelectionSlice,
    EasterEggSlice,
    WindowCrudSlice,
    WindowOperationsActions,
    TerminalSlice,
    GameSlice,
    SystemSlice,
    WeatherSlice,
    DocumentRegistrySlice {}

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
  // {achievements}
  ...createAchievementSlice(set),
  // ...createNodeSlice(set, get),
  ...createEasterEggSlice(set, get),
  // ...createWindowSlice(set, get), // Temporarily disabled to avoid conflicts
  ...createTerminalSlice(set, get),
  ...createGameSlice(set, get),
  ...createWeatherSlice(set),
  // {document registry}
  ...createDocumentRegistrySlice(set, get),
}));
