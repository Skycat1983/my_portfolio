import React from "react";
import { DocumentEditor } from "../apps/document/DocumentEditor";
import { WhatsAppMain } from "../apps/whatsApp/WhatsAppMain";
import { Finder } from "../apps/finder/Finder";
import { TerminalContent } from "../apps/terminal/TerminalContent";
import { BrowserContent } from "../apps/browser/BrowserContent";
import type { WindowContentProps } from "../../types/storeTypes";

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
