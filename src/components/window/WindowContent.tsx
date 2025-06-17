import type { DirectoryWindow, WindowType } from "../../types/storeTypes";
import { DirectoryContent } from "../windowContent/directory/DirectoryContent";
import { TerminalContent } from "../windowContent/terminal/TerminalContent";

interface WindowContentProps {
  window: WindowType;
}

export const WindowContent = ({ window }: WindowContentProps) => {
  const { nodeType } = window;
  if (nodeType === "terminal") {
    return <TerminalContent />;
  }
  if (nodeType === "directory") {
    return <DirectoryContent window={window as DirectoryWindow} />;
  }
};
