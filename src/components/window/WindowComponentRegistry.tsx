import React from "react";
import { DocumentEditor } from "../applications/document/DocumentEditor";
import { Finder } from "../finder/Finder";
import { TerminalContent } from "../applications/terminal/TerminalContent";
import { BrowserContent } from "../applications/browser/BrowserContent";
import type { WindowContentProps } from "@/types/storeTypes";
import { GeoGame } from "../applications/geoGame/GeoGame";
import GTAVI from "../applications/GTAVI/GTAVI";
import { AchievementContent } from "../applications/achievements/AchievementContent";
import { Map } from "../applications/map/Map";
import Calculator from "../applications/calculator/Calculator";
import { Settings } from "../applications/settings/Settings";
import { WhatsAppWrapper } from "../applications/whatsApp/WhatsAppWrapper";

// Component registry mapping component keys to React components
// Note: Components can define their own prop interfaces
export const WINDOW_COMPONENT_REGISTRY: Record<
  string,
  React.ComponentType<WindowContentProps>
> = {
  documentEditor: DocumentEditor,
  finder: Finder,
  terminal: TerminalContent,
  browser: BrowserContent,
  whatsApp: WhatsAppWrapper,
  directory: Finder,
  geoGame: GeoGame,
  gtaVi: GTAVI,
  achievements: AchievementContent,
  maps: Map,
  calculator: Calculator,
  settings: Settings,
};

interface WindowDimensions {
  width: number;
  height: number;
  fixed: boolean;
}

export const WINDOW_DIMENSIONS_REGISTRY: Record<
  keyof typeof WINDOW_COMPONENT_REGISTRY,
  WindowDimensions
> = {
  documentEditor: { width: 1000, height: 800, fixed: false },
  finder: { width: 800, height: 600, fixed: false },
  terminal: { width: 1000, height: 600, fixed: false },
  browser: { width: 1200, height: 800, fixed: false },
  whatsApp: { width: 900, height: 700, fixed: false },
  directory: { width: 800, height: 600, fixed: false },
  geoGame: { width: 1000, height: 700, fixed: false },
  gtaVi: { width: 1200, height: 800, fixed: false },
  achievements: { width: 800, height: 600, fixed: false },
  maps: { width: 1000, height: 700, fixed: false },
  calculator: { width: 400, height: 500, fixed: true },
  settings: { width: 700, height: 600, fixed: false },
};

export const NODE_FUNCTION_REGISTRY = {
  test: () => {
    console.log("test");
  },
  emailMe: () => {
    const email = "hlaoutaris@gmail.com";
    const subject = "When can you start?";
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    window.location.href = mailtoLink;
  },
};

// Type-safe function to get component by key
export const getWindowComponent = (
  componentKey: string
): React.ComponentType<WindowContentProps> | undefined => {
  return WINDOW_COMPONENT_REGISTRY[componentKey];
};

export const getNodeFunction = (
  functionKey: keyof typeof NODE_FUNCTION_REGISTRY
) => {
  return NODE_FUNCTION_REGISTRY[functionKey];
};

// Get all available component keys (useful for debugging/development)
export const getAvailableComponentKeys = (): string[] => {
  return Object.keys(WINDOW_COMPONENT_REGISTRY);
};
