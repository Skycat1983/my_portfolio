import type { WindowContentProps } from "../../types/storeTypes";
import { AchievementContent } from "../apps/achievements/AchievementContent";
import { BrowserContent } from "../apps/browser/BrowserContent";
import { DirectoryContent } from "../apps/directory/DirectoryContent";
import GTAVI from "../apps/games/GTAVI/GTAVI";
import { GeoGame } from "../apps/games/GeoGame/GeoGame";
import { TerminalContent } from "../apps/terminal/TerminalContent";
import { getWindowComponent } from "./WindowComponentRegistry";
import { useNewStore } from "../../hooks/useStore";

export const WindowContent = ({ window }: WindowContentProps) => {
  const { windowId, nodeType, nodeId } = window;
  const nodeMap = useNewStore((s) => s.nodeMap);

  console.log("WindowContent in WindowContent.tsx: ", window);

  // NEW: Check if window has a custom component (takes priority)
  if (window.component) {
    console.log(
      "WindowContent: rendering custom component for windowId",
      windowId
    );
    const CustomComponent = window.component;
    return <CustomComponent window={window} />;
  }

  // NEW: Check if the node has a componentKey and look up in registry
  const node = nodeMap[nodeId];
  if (node && "componentKey" in node && node.componentKey) {
    console.log(
      "WindowContent: checking componentKey",
      node.componentKey,
      "for nodeId",
      nodeId
    );
    const RegistryComponent = getWindowComponent(node.componentKey);
    if (RegistryComponent) {
      console.log(
        "WindowContent: rendering registry component",
        node.componentKey,
        "for windowId",
        windowId
      );
      return <RegistryComponent window={window} />;
    } else {
      console.warn(
        "WindowContent: componentKey",
        node.componentKey,
        "not found in registry"
      );
    }
  }

  // EXISTING: Fallback to current logic (unchanged for backward compatibility)
  console.log("WindowContent: using fallback logic for nodeType", nodeType);

  if (nodeType === "terminal") {
    return <TerminalContent />;
  }
  if (nodeType === "directory") {
    return <DirectoryContent nodeId={nodeId} />;
  }
  if (nodeType === "achievement") {
    return <AchievementContent />;
  }
  if (nodeType === "browser") {
    return <BrowserContent windowId={windowId} />;
  }
  if (nodeId === "gtaiv") {
    return <GTAVI windowId={windowId} />;
  }
  if (nodeId === "geo") {
    console.log("GeoGame: windowId", windowId);
    return <GeoGame windowId={windowId} />;
  }

  // Fallback for unknown types
  console.warn(
    "WindowContent: no component found for nodeType",
    nodeType,
    "nodeId",
    nodeId
  );
  return null;
};
