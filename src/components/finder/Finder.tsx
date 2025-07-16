import React from "react";
import { FinderHeader } from "./FinderHeader";
import { FinderBody } from "./FinderBody";
import { useNewStore } from "@/hooks/useStore";
import { NodeDropZoneWrapper } from "./NodeDropZoneWrapper";
import { theme } from "@/styles/theme";
import type { WindowId } from "@/constants/applicationRegistry";
import { systemRootId } from "@/constants/nodeHierarchy";

export const Finder = ({
  windowId,
  nodeId,
}: {
  windowId: WindowId;
  nodeId: string;
}) => {
  console.log("HISTORY_DEBUG Finder rendering", { windowId, nodeId });
  // const nodeMap = useNewStore((s) => s.nodeMap);
  const defaultFinderView = useNewStore((s) => s.defaultFinderView);
  const currentTheme = useNewStore((s) => s.theme);
  const window = useNewStore((s) => s.findWindowById(windowId));
  const updateWindow = useNewStore((s) => s.updateWindow);
  const [input, setInput] = React.useState("");
  const [view, setView] = React.useState<"icons" | "list" | "columns">(
    defaultFinderView
  );
  const zIndex = window?.zIndex ?? 0;

  const nodeIdToFind = nodeId === "finder" ? systemRootId : nodeId;
  console.log("finder nodeIdToFind", nodeIdToFind);
  const getChildrenByParentID = useNewStore((s) => s.getChildrenByParentID);
  const children = getChildrenByParentID(nodeIdToFind);
  console.log("finder children", children);

  // Handle history changes from WindowHistoryNavigation
  const handleHistoryChange = React.useCallback(
    (currentItem: unknown) => {
      if (typeof currentItem === "string") {
        updateWindow((w) => w.windowId === windowId, { nodeId: currentItem });
      }
    },
    [windowId, updateWindow]
  );

  const filteredNodes = children.filter((node) =>
    node.label.toLowerCase().includes(input.toLowerCase())
  );

  console.log("HISTORY_DEBUG window", window);

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
        nodeId={nodeId}
        onHistoryChange={handleHistoryChange}
      />
      <NodeDropZoneWrapper nodeId={nodeIdToFind} shrinkToFit={false}>
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
