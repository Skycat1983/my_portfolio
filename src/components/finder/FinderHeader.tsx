import React from "react";
import { Input } from "../ui/input";
import { FinderViewControls } from "./FinderViewControls";
import { useNewStore } from "@/hooks/useStore";
import theme from "@/styles/theme";
import { WindowHistoryNavigation } from "../window/windowNavigation/WindowHistoryNavigation";
import { EmptyTrashButton } from "./EmptyTrashButton";
import type { WindowId } from "@/constants/applicationRegistry";
import type { NodeId } from "../nodes/nodeTypes";

type FinderHeaderProps = {
  zIndex: number;
  view: "icons" | "list" | "columns";
  onChangeView: (v: "icons" | "list" | "columns") => void;
  input: string;
  setInput: (v: string) => void;
  windowId: WindowId;
  nodeId: NodeId;
  onHistoryChange: (currentItem: unknown) => void;
};

export const FinderHeader: React.FC<FinderHeaderProps> = ({
  zIndex,
  view,
  onChangeView,
  input,
  setInput,
  windowId,
  nodeId,
  onHistoryChange,
}) => {
  const currentTheme = useNewStore((s) => s.theme);
  const bgColor = theme.colors[currentTheme].background.secondary;
  const bgColourSecondary = theme.colors[currentTheme].background.tertiary;
  const borderColor = theme.colors[currentTheme].border.primary;
  console.log("HISTORY_DEBUG nodeId", nodeId);
  const textColor = theme.colors[currentTheme].text.primary;

  return (
    <div
      className="flex flex-row h-auto items-center justify-between gap-10 bg-black p-2"
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
      }}
    >
      <div className="flex items-center gap-2">
        <WindowHistoryNavigation
          windowId={windowId as WindowId}
          firstHistoryItem={nodeId}
          showForwardButton={true}
          showBackButton={true}
          onHistoryChange={onHistoryChange}
        />
        <EmptyTrashButton windowId={windowId} />
      </div>
      {nodeId !== "trash" && (
        <Input
          placeholder="Search"
          style={{
            color: textColor,
            // borderColor: borderColor,
            backgroundColor: bgColourSecondary,
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      )}

      <FinderViewControls
        view={view}
        onChangeView={onChangeView}
        zIndex={zIndex}
        windowId={windowId}
      />
    </div>
  );
};
