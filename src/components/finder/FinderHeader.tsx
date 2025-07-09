import React from "react";
import { FinderNavigation } from "./FinderNavigation";
import { Input } from "../ui/input";
import { FinderViewControls } from "./FinderViewControls";
import { useNewStore } from "@/hooks/useStore";
import theme from "@/styles/theme";
import { WindowHistoryNavigation } from "../window/windowNavigation/WindowHistoryNavigation";

type FinderHeaderProps = {
  zIndex: number;
  view: "icons" | "list" | "columns";
  onChangeView: (v: "icons" | "list" | "columns") => void;
  input: string;
  setInput: (v: string) => void;
  windowId: string;
  nodeId: string;
};

export const FinderHeader: React.FC<FinderHeaderProps> = ({
  zIndex,
  view,
  onChangeView,
  input,
  setInput,
  windowId,
  nodeId,
}) => {
  const currentTheme = useNewStore((s) => s.theme);
  const bgColor = theme.colors[currentTheme].background.primary;
  const borderColor = theme.colors[currentTheme].border.primary;
  console.log("HISTORY_DEBUG nodeId", nodeId);
  // const textColor = theme.colors[currentTheme].text.primary;

  return (
    <div
      className="flex flex-row h-auto items-center justify-between gap-10 bg-black p-2"
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
      }}
    >
      <FinderNavigation windowId={windowId} />
      {/* <WindowHistoryNavigation
        windowId={windowId}
        firstHistoryItem={nodeId}
        showForwardButton={true}
        showBackButton={true}
        onHistoryChange={handleHistoryChange}
      /> */}

      <Input
        placeholder="Search"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <FinderViewControls
        view={view}
        onChangeView={onChangeView}
        zIndex={zIndex}
        windowId={windowId}
      />
    </div>
  );
};
