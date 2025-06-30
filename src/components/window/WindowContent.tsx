import type { WindowType } from "../../types/storeTypes";
import { AchievementContent } from "../apps/achievements/AchievementContent";
import { BrowserContent } from "../apps/browser/BrowserContent";
import { DirectoryContent } from "../apps/directory/DirectoryContent";
import GTAVI from "../apps/games/GTAVI/GTAVI";
import { GeoGame } from "../apps/games/GeoGame/GeoGame";
import { TerminalContent } from "../apps/terminal/TerminalContent";

interface WindowContentProps {
  window: WindowType;
}

export const WindowContent = ({ window }: WindowContentProps) => {
  const { windowId, nodeType, nodeId } = window;
  console.log("WindowContent", window);
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
};
