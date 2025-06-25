import type { DirectoryWindow, WindowType } from "../../types/storeTypes";
import { AchievementContent } from "../windowContent/achievements/AchievementContent";
import { BrowserContent } from "../windowContent/browser/BrowserContent";
import { DirectoryContent } from "../windowContent/directory/DirectoryContent";
import { TerminalContent } from "../windowContent/terminal/TerminalContent";

interface WindowContentProps {
  window: WindowType;
}

export const WindowContent = ({ window }: WindowContentProps) => {
  const { windowId, nodeType } = window;
  console.log("WindowContent", window);
  if (nodeType === "terminal") {
    return <TerminalContent />;
  }
  if (nodeType === "directory") {
    return <DirectoryContent window={window as DirectoryWindow} />;
  }
  if (nodeType === "achievement") {
    return <AchievementContent />;
  }
  if (nodeType === "browser") {
    return <BrowserContent windowId={windowId} />;
  }
};
