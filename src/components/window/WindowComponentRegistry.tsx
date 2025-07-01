import type { ComponentType } from "react";
import type { WindowContentProps } from "../../types/storeTypes";
import { DocumentEditor } from "../apps/document/DocumentEditor";
import { WhatsAppMain } from "../apps/whatsApp";
import { Finder } from "../apps/finder/Finder";

// Component registry mapping component keys to React components
export const WINDOW_COMPONENT_REGISTRY: Record<
  string,
  ComponentType<WindowContentProps>
> = {
  testCustom: WhatsAppMain,
  documentEditor: DocumentEditor,
  finder: Finder,
  // Add more custom components here as needed
  // customEditor: CustomEditorComponent,
  // customDashboard: CustomDashboardComponent,
};

// Type-safe function to get component by key
export const getWindowComponent = (
  componentKey: string
): ComponentType<WindowContentProps> | undefined => {
  return WINDOW_COMPONENT_REGISTRY[componentKey];
};

// Get all available component keys (useful for debugging/development)
export const getAvailableComponentKeys = (): string[] => {
  return Object.keys(WINDOW_COMPONENT_REGISTRY);
};
