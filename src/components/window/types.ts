// ═══════════════════════════════════════════════════════════════════════════════
// NEW WINDOW SYSTEM TYPES (Application Registry Based)
// ═══════════════════════════════════════════════════════════════════════════════

import type { ApplicationId, WindowId } from "@/constants/applicationRegistry";
import type { NodeId } from "@/types/nodeTypes";
import type { DocumentConfig } from "@/types/storeTypes";

// New Window interface for the application registry system
export interface Window {
  // Core identification
  windowId: WindowId; // Generated using our new ID system
  title: string;
  nodeId: NodeId;
  applicationId: ApplicationId; // Type-safe application ID from registry

  // Position and dimensions
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;

  // Window state
  fixed: boolean;
  isMinimized: boolean;
  isMaximized: boolean;

  // Component configuration
  componentKey: ApplicationId; // Same as applicationId in our unified system

  // Optional configurations
  documentConfig?: DocumentConfig; // Only present for document windows
}

// Window creation context for ID generation
export interface WindowCreationContext {
  nodeId?: NodeId;
  documentConfigId?: string;
  timestamp?: number;
}

// New window state interface for the registry system
export interface NewWindowState {
  openWindows: Window[];
  nextZIndex: number;
}

// New window content props for the registry system
export interface NewWindowContentProps {
  windowId: WindowId;
  nodeId: NodeId;
  applicationId: ApplicationId;
  window: Window;
}
