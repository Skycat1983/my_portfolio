import type { NodeEntry } from "../types/nodeTypes";

type WindowedNode = Exclude<NodeEntry, { type: "icon" | "link" }>;

interface Window {
  id: string;
  nodeId: WindowedNode["id"];
  nodeType: WindowedNode["type"];
  width: number;
  height: number;
  zIndex: number;
  navigationHistory: string[];
  currentHistoryIndex: number;
}

interface WindowState {
  openWindows: Window[];
}

interface WindowActions {
  openWindow: (nodeId: WindowedNode["id"]) => void;
  closeWindow: (windowId: Window["id"]) => void;
  focusWindow: (windowId: Window["id"]) => void;
  //? These states are for directories only. here i want to focus on states consistent to all windowable nodes
  //   navigateInWindow: (windowId: Window["id"], targetNodeId: WindowedNode["id"]) => void;
  //   canGoBack: (windowId: Window["id"]) => boolean;
  //   canGoForward: (windowId: Window["id"]) => boolean;
}
