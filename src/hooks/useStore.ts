import { create } from "zustand";
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
  createSelectionSlice,
  type SelectionSlice,
} from "../store/nodeState/nodeSelectionSlice";
import {
  createWindowCrudSlice,
  type WindowCrudSlice,
} from "../store/windowState/windowCrudSlice";
import {
  createWindowOperationsSlice,
  type WindowOperationsSlice,
} from "../store/windowState/windowOperationsSlice";
import {
  createSystemSlice,
  type SystemSlice,
} from "../store/systemState/systemSlice";
import {
  createAchievementSlice,
  type AchievementSlice,
} from "../store/systemState/achievementsSlice";
import {
  createWeatherSlice,
  type WeatherSlice,
} from "../store/systemState/weatherSlice";
import {
  createHistorySlice,
  type HistorySlice,
} from "../store/contentState/historySlice";
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

// Combine all slice types into one store type
export type NewDesktopStore = NodeCrudSlice &
  NodeOperationsSlice &
  NodeBusinessSlice &
  SelectionSlice &
  WindowCrudSlice &
  WindowOperationsSlice &
  SystemSlice &
  AchievementSlice &
  WeatherSlice &
  HistorySlice &
  TerminalSlice &
  GameSlice &
  DocumentRegistrySlice;

// Create the store with all slices
export const useNewStore = create<NewDesktopStore>((set, get) => ({
  // Node state management
  ...createNodeCrudSlice(set, get),
  ...createNodeOperationsSlice(set, get),
  ...createNodeBusinessSlice(set, get),
  ...createSelectionSlice(set, get),

  // Window state management
  ...createWindowCrudSlice(set, get),
  ...createWindowOperationsSlice(set, get),

  // System state management
  ...createSystemSlice(set),
  ...createAchievementSlice(set),
  ...createWeatherSlice(set),

  // Content state management
  ...createHistorySlice(set, get),
  ...createTerminalSlice(set, get),
  ...createGameSlice(set, get),
  ...createDocumentRegistrySlice(set, get),
}));
