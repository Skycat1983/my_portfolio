import React from "react";
import { FinderHeader } from "./FinderHeader";
import { FinderBody } from "./FinderBody";
import { useNewStore } from "../../../hooks/useStore";
import { NodeDropZoneWrapper } from "./NodeDropZoneWrapper";
import { desktopRootId } from "../../../constants/nodes";

export const Finder = ({ windowId }: { windowId: string }) => {
  const window = useNewStore((s) => s.getWindowById(windowId));
  const [input, setInput] = React.useState("");
  const [view, setView] = React.useState<"icons" | "list" | "columns">("icons");
  const nodeMap = useNewStore((s) => s.nodeMap);
  const selectedNodeId = useNewStore((s) => s.selectedNodeId);
  const zIndex = window?.zIndex ?? 0;
  const defaultLocation = desktopRootId;
  const findMany = useNewStore((s) => s.findManyNodes);
  const desktopNodes = findMany((n) => n.parentId === defaultLocation);
  const allNodes = Object.values(nodeMap);

  const nodesToFiler = input.length > 0 ? allNodes : desktopNodes;

  const filteredNodes = nodesToFiler.filter((node) =>
    node.label.toLowerCase().includes(input.toLowerCase())
  );

  console.log("FINDER_01: filteredNodes", filteredNodes);

  return (
    <div className="flex flex-col h-full w-full">
      <FinderHeader
        zIndex={zIndex}
        view={view}
        onChangeView={setView}
        input={input}
        setInput={setInput}
      />
      <NodeDropZoneWrapper nodeId={"finder"} shrinkToFit={false}>
        <FinderBody
          nodes={filteredNodes}
          view={view}
          rootId={defaultLocation}
        />
      </NodeDropZoneWrapper>
    </div>
  );
};
