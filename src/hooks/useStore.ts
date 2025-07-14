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
  createWindowSlice,
  type WindowSlice,
} from "../store/windowState/windowSlice";
import {
  createSystemSlice,
  type SystemSlice,
} from "../store/systemState/systemSlice";
import {
  createAchievementSlice,
  type AchievementSlice,
} from "../store/systemState/achievementsSlice";
import { createWeatherSlice } from "../store/systemState/weatherSlice";
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
import {
  createWhatsAppSlice,
  type WhatsAppSlice,
  type WhatsAppState,
} from "@/store/contentState/whatsAppSlice";
import type { ApplicationState } from "@/types/storeTypes";

const initialWhatsAppState: WhatsAppState = {
  contacts: {
    byId: {},
    allIds: [],
    archived: new Set(),
  },
  messages: {
    byId: {},
    allIds: [],
    byConversation: {},
  },
  conversations: {
    byId: {},
    allIds: [],
  },
  ui: {
    typing: {},
  },
  network: {
    lastSeenTimestamp: Date.now(),
  },
  isInitialized: false,
  callHistory: [],
};

// Combined store type with all slices
export type StoreSlice = NodeCrudSlice &
  NodeOperationsSlice &
  NodeBusinessSlice &
  SelectionSlice &
  WindowCrudSlice &
  WindowOperationsSlice &
  WindowSlice &
  SystemSlice &
  AchievementSlice &
  HistorySlice &
  TerminalSlice &
  GameSlice &
  DocumentRegistrySlice &
  WhatsAppSlice;

// Complete store type combining state and actions
export type Store = ApplicationState & StoreSlice;

// Create the store with all slices
export const useNewStore = create<Store>((set, get) => ({
  // Node state management
  ...createNodeCrudSlice(set, get),
  ...createNodeOperationsSlice(set, get),
  ...createNodeBusinessSlice(set, get),
  ...createSelectionSlice(set, get),

  // Window state management
  ...createWindowCrudSlice(set, get),
  ...createWindowOperationsSlice(set, get),
  ...createWindowSlice(set, get),

  // System state management
  ...createSystemSlice(set),
  ...createAchievementSlice(set),
  ...createWeatherSlice(set),

  // Content state management
  ...createHistorySlice(set, get),
  ...createTerminalSlice(set, get),
  ...createGameSlice(set, get),
  ...createDocumentRegistrySlice(set, get),
  ...createWhatsAppSlice(set),

  // Initialize collection state
  histories: {},
  documents: new Map(),

  // Initialize new window state
  windows: [],

  // Required state properties
  weather: createWeatherSlice(set),
  whatsApp: initialWhatsAppState,
  currentContext: "desktop",
}));
