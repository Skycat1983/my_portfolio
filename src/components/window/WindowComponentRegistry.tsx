import React from "react";
import { DocumentEditor } from "../applications/document/DocumentEditor";
import { WhatsAppMain } from "../applications/whatsApp/WhatsAppMain";
import { Finder } from "../finder/Finder";
import { TerminalContent } from "../applications/terminal/TerminalContent";
import { BrowserContent } from "../applications/browser/BrowserContent";
import type { WindowContentProps } from "@/types/storeTypes";
import { GeoGame } from "../applications/games/GeoGame/GeoGame";
import GTAVI from "../applications/games/GTAVI/GTAVI";
import { AchievementContent } from "../applications/achievements/AchievementContent";

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
  whatsApp: WhatsAppMain,
  directory: Finder,
  geoGame: GeoGame,
  gtaVi: GTAVI,
  achievements: AchievementContent,
};

// Type-safe function to get component by key
export const getWindowComponent = (
  componentKey: string
): React.ComponentType<WindowContentProps> | undefined => {
  return WINDOW_COMPONENT_REGISTRY[componentKey];
};

// Get all available component keys (useful for debugging/development)
export const getAvailableComponentKeys = (): string[] => {
  return Object.keys(WINDOW_COMPONENT_REGISTRY);
};
