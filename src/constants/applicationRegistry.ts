import React from "react";
import { DocumentEditor } from "../components/applications/document/DocumentEditor";
import { Finder } from "../components/finder/Finder";
import { TerminalContent } from "../components/applications/terminal/TerminalContent";
import { BrowserContent } from "../components/applications/browser/BrowserMain";
import type { WindowContentProps } from "@/types/storeTypes";
import { GeoGame } from "../components/applications/geoGame/GeoGame";
import GTAVI from "../components/applications/GTAVI/GTAVI";
import { AchievementContent } from "../components/applications/achievements/AchievementContent";
import { Map } from "../components/applications/map/Map";
import Calculator from "../components/applications/calculator/Calculator";
import { Settings } from "../components/applications/settings/Settings";
import { WhatsAppWrapper } from "../components/applications/whatsApp/WhatsAppWrapper";
import { StocksMain } from "@/components/applications/stocks";

// ═══════════════════════════════════════════════════════════════════════════════
// APPLICATION REGISTRY - CONSOLIDATED CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

type WindowScope = "per-application" | "per-nodeId" | "per-document";

interface ApplicationConfig {
  // Component & rendering
  component: React.ComponentType<WindowContentProps>;

  // Window behavior
  allowMultipleWindows: boolean;
  windowScope: WindowScope;

  // Dimensions
  width: number;
  height: number;
  fixedSize: boolean;

  // State management
  requiresHistory: boolean;
  defaultMaximized: boolean;
}
// TODO: remove per-document scope from all code. is effectively the same as per-nodeId
export const APPLICATION_REGISTRY: Record<string, ApplicationConfig> = {
  // ─────────── File Management ───────────
  finder: {
    component: Finder,
    allowMultipleWindows: true,
    windowScope: "per-nodeId" as const, // One window per directory node
    width: 800,
    height: 600,
    fixedSize: false,
    requiresHistory: true,
    defaultMaximized: false,
  },

  // ─────────── Document Applications ───────────
  documentEditor: {
    component: DocumentEditor,
    allowMultipleWindows: true,
    windowScope: "per-nodeId" as const, // One window per document instance
    width: 1000,
    height: 800,
    fixedSize: false,
    requiresHistory: false,
    defaultMaximized: false,
  },

  // ─────────── Internet & Communication ───────────
  browser: {
    component: BrowserContent,
    allowMultipleWindows: false,
    windowScope: "per-application" as const,
    width: 1200,
    height: 800,
    fixedSize: false,
    requiresHistory: true,
    defaultMaximized: false,
  },

  whatsApp: {
    component: WhatsAppWrapper,
    allowMultipleWindows: false,
    windowScope: "per-application" as const,
    width: 900,
    height: 700,
    fixedSize: false,
    requiresHistory: true,
    defaultMaximized: false,
  },

  // ─────────── System Applications ───────────
  terminal: {
    component: TerminalContent,
    allowMultipleWindows: false,
    windowScope: "per-application" as const,
    width: 1000,
    height: 600,
    fixedSize: false,
    requiresHistory: true,
    defaultMaximized: false,
  },

  calculator: {
    component: Calculator,
    allowMultipleWindows: false,
    windowScope: "per-application" as const,
    width: 400,
    height: 500,
    fixedSize: true,
    requiresHistory: false,
    defaultMaximized: false,
  },

  settings: {
    component: Settings,
    allowMultipleWindows: false,
    windowScope: "per-application" as const,
    width: 700,
    height: 600,
    fixedSize: false,
    requiresHistory: false,
    defaultMaximized: false,
  },

  // ─────────── Entertainment & Games ───────────
  geoGame: {
    component: GeoGame,
    allowMultipleWindows: false,
    windowScope: "per-application" as const,
    width: 1000,
    height: 700,
    fixedSize: false,
    requiresHistory: false,
    defaultMaximized: false,
  },

  gtaVi: {
    component: GTAVI,
    allowMultipleWindows: false,
    windowScope: "per-application" as const,
    width: 1200,
    height: 800,
    fixedSize: false,
    requiresHistory: false,
    defaultMaximized: true, // Games should start maximized
  },

  stocks: {
    component: StocksMain,
    allowMultipleWindows: false,
    windowScope: "per-application" as const,
    width: 1200,
    height: 800,
    fixedSize: false,
    requiresHistory: false,
    defaultMaximized: false,
  },

  // ─────────── Utility Applications ───────────
  achievements: {
    component: AchievementContent,
    allowMultipleWindows: false,
    windowScope: "per-application" as const,
    width: 800,
    height: 600,
    fixedSize: false,
    requiresHistory: false,
    defaultMaximized: false,
  },

  maps: {
    component: Map,
    allowMultipleWindows: false,
    windowScope: "per-application" as const,
    width: 1000,
    height: 700,
    fixedSize: false,
    requiresHistory: false,
    defaultMaximized: false,
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE-SAFE DERIVED TYPES & UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

export type ApplicationRegistryId = keyof typeof APPLICATION_REGISTRY;

export type ComponentKey = ApplicationRegistryId;

// Type-safe component registry (for backward compatibility)
export const WINDOW_COMPONENT_REGISTRY: Record<
  ApplicationRegistryId,
  React.ComponentType<WindowContentProps>
> = Object.fromEntries(
  Object.entries(APPLICATION_REGISTRY).map(([key, config]) => [
    key,
    config.component,
  ])
) as Record<ApplicationRegistryId, React.ComponentType<WindowContentProps>>;

// Type-safe dimensions registry (for backward compatibility)
export const WINDOW_DIMENSIONS_REGISTRY: Record<
  ApplicationRegistryId,
  { width: number; height: number; fixed: boolean }
> = Object.fromEntries(
  Object.entries(APPLICATION_REGISTRY).map(([key, config]) => [
    key,
    {
      width: config.width,
      height: config.height,
      fixed: config.fixedSize,
    },
  ])
) as Record<
  ApplicationRegistryId,
  { width: number; height: number; fixed: boolean }
>;

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE-SAFE ID GENERATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

// Base types for ID generation
type NodeId = string;
type DocumentConfigId = string;
type Timestamp = number;

// Window ID generation based on application scope
export type WindowId<T extends ApplicationRegistryId = ApplicationRegistryId> =
  T extends ApplicationRegistryId
    ? (typeof APPLICATION_REGISTRY)[T]["windowScope"] extends "per-application"
      ? `${T}-singleton`
      : (typeof APPLICATION_REGISTRY)[T]["windowScope"] extends "per-nodeId"
      ? `${T}-${NodeId}`
      : (typeof APPLICATION_REGISTRY)[T]["windowScope"] extends "per-document"
      ? `${T}-${DocumentConfigId}`
      : never
    : never;

// History ID = Window ID (for applications that require history)
export type HistoryId<T extends ApplicationRegistryId = ApplicationRegistryId> =
  (typeof APPLICATION_REGISTRY)[T]["requiresHistory"] extends true
    ? WindowId<T>
    : never;

/**
 * Generate a type-safe window ID based on application configuration
 */
export const generateWindowId = <T extends ApplicationRegistryId>(
  applicationId: T,
  context?: {
    nodeId?: NodeId;
    documentConfigId?: DocumentConfigId;
    timestamp?: Timestamp;
  }
): WindowId<T> => {
  const config = APPLICATION_REGISTRY[applicationId];

  switch (config.windowScope) {
    case "per-application":
      return `${applicationId}-singleton` as WindowId<T>;

    case "per-nodeId":
      if (!context?.nodeId) {
        throw new Error(
          `Node ID required for ${applicationId} (per-node scope)`
        );
      }
      return `${applicationId}-${context.nodeId}` as WindowId<T>;

    case "per-document":
      if (!context?.documentConfigId) {
        throw new Error(
          `Document config ID required for ${applicationId} (per-document scope)`
        );
      }
      return `${applicationId}-${context.documentConfigId}` as WindowId<T>;

    default:
      throw new Error(`Invalid window scope for ${applicationId}`);
  }
};

/**
 * Generate a history ID (same as window ID for applications that need history)
 */
export const generateHistoryId = <T extends ApplicationRegistryId>(
  applicationId: T,
  context?: {
    nodeId?: NodeId;
    documentConfigId?: DocumentConfigId;
    timestamp?: Timestamp;
  }
): HistoryId<T> | null => {
  const config = APPLICATION_REGISTRY[applicationId];

  if (!config.requiresHistory) {
    return null;
  }

  return generateWindowId(applicationId, context) as HistoryId<T>;
};

/**
 * Check if an application allows multiple windows
 */
export const allowsMultipleWindows = (
  applicationId: ApplicationRegistryId
): boolean => {
  return APPLICATION_REGISTRY[applicationId].allowMultipleWindows;
};

/**
 * Check if an application requires history
 */
export const requiresHistory = (
  applicationId: ApplicationRegistryId
): boolean => {
  return APPLICATION_REGISTRY[applicationId].requiresHistory;
};

/**
 * Get application configuration
 */
export const getApplicationConfig = (
  applicationId: ApplicationRegistryId
): ApplicationConfig => {
  return APPLICATION_REGISTRY[applicationId];
};

// ═══════════════════════════════════════════════════════════════════════════════
// BACKWARD COMPATIBILITY EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

// For components that still use the old registry pattern
export const getWindowComponent = (
  componentKey: ApplicationRegistryId
): React.ComponentType<WindowContentProps> | undefined => {
  return WINDOW_COMPONENT_REGISTRY[componentKey];
};

export const getAvailableComponentKeys = (): ApplicationRegistryId[] => {
  return Object.keys(APPLICATION_REGISTRY) as ApplicationRegistryId[];
};
