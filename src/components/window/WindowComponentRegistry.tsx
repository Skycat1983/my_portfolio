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
