import type { WindowType } from "../../types/storeTypes";
import { TerminalContent } from "../windowContent/terminal/TerminalContent";

interface WindowContentProps {
  window: WindowType;
}

export const WindowContent = ({ window }: WindowContentProps) => {
  const { windowId, nodeType } = window;
  if (nodeType === "terminal") {
    return <TerminalContent />;
  }
};
