import React from "react";
import { FinderHeader } from "./FinderHeader";
import { FinderBody } from "./FinderBody";
import { useNewStore } from "@/hooks/useStore";
import { NodeDropZoneWrapper } from "./NodeDropZoneWrapper";
import { theme } from "@/styles/theme";

export const Finder = ({
  windowId,
  nodeId,
}: {
  windowId: string;
  nodeId: string;
}) => {
  // const nodeMap = useNewStore((s) => s.nodeMap);
  const currentTheme = useNewStore((s) => s.theme);
  const window = useNewStore((s) => s.getWindowById(windowId));
  const [input, setInput] = React.useState("");
  const [view, setView] = React.useState<"icons" | "list" | "columns">("icons");
  const zIndex = window?.zIndex ?? 0;

  const getChildrenByParentID = useNewStore((s) => s.getChildrenByParentID);
  const children = getChildrenByParentID(nodeId);

  const filteredNodes = children.filter((node) =>
    node.label.toLowerCase().includes(input.toLowerCase())
  );

  console.log("FINDER_VIEW_CONTROL: window", window);

  const bgColor = theme.colors[currentTheme].background.primary;
  const borderColor = theme.colors[currentTheme].border.primary;
  // const textColor = theme.colors[currentTheme].text.primary;

  return (
    <div
      className="flex flex-col h-full w-full"
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
      }}
    >
      <FinderHeader
        zIndex={zIndex}
        view={view}
        onChangeView={setView}
        input={input}
        setInput={setInput}
        windowId={windowId}
      />
      <NodeDropZoneWrapper nodeId={nodeId} shrinkToFit={false}>
        <FinderBody
          nodes={filteredNodes}
          view={view}
          nodeId={nodeId}
          windowId={windowId}
        />
      </NodeDropZoneWrapper>
    </div>
  );
};
