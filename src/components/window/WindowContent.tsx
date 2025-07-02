import type { WindowType } from "../../types/storeTypes";
import { AchievementContent } from "../apps/achievements/AchievementContent";
import { BrowserContent } from "../apps/browser/BrowserContent";
import { DirectoryContent } from "../apps/directory/DirectoryContent";
import { DocumentEditor } from "../apps/document/DocumentEditor";
import GTAVI from "../apps/games/GTAVI/GTAVI";
import { GeoGame } from "../apps/games/GeoGame/GeoGame";
import { TerminalContent } from "../apps/terminal/TerminalContent";
import { getWindowComponent } from "./WindowComponentRegistry";

export const WindowContent = ({ window }: { window: WindowType }) => {
  const { windowId, nodeType, nodeId, componentKey } = window;

  console.log("WindowContent in WindowContent.tsx: ", window);

  if (componentKey) {
    const RegistryComponent = getWindowComponent(componentKey);
    if (RegistryComponent) {
      return (
        <RegistryComponent
          windowId={windowId}
          nodeId={nodeId}
          window={window}
        />
      );
    } else {
      console.warn(
        "WindowContent: window componentKey",
        window.componentKey,
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
    return <BrowserContent />;
  }
  if (nodeType === "document") {
    return (
      <DocumentEditor windowId={windowId} nodeId={nodeId} window={window} />
    );
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

// // NEW: Check if the node has a componentKey and look up in registry
// const node = nodeMap[nodeId];
// if (node && "componentKey" in node && node.componentKey) {
//   console.log(
//     "WindowContent: checking node componentKey",
//     node.componentKey,
//     "for nodeId",
//     nodeId
//   );
//   const RegistryComponent = getWindowComponent(node.componentKey);
//   if (RegistryComponent) {
//     console.log(
//       "WindowContent: rendering registry component",
//       node.componentKey,
//       "for windowId",
//       windowId
//     );
//     return (
//       <RegistryComponent
//         windowId={windowId}
//         nodeId={nodeId}
//         window={window}
//       />
//     );
//   } else {
//     console.warn(
//       "WindowContent: node componentKey",
//       node.componentKey,
//       "not found in registry"
//     );
//   }
// }
