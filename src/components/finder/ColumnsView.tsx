import type { NodeEntry } from "@/types/nodeTypes";
import { useFinderHistory } from "./hooks/useFinderHistory";
import { NodeSwitch } from "../nodes/NodeSwitch";
// import { useNodeEvents } from "../nodes/hooks/useNodeEvents";
// import { getTitleFrame } from "../nodes/node.styles";
// import { getLabelClasses } from "../nodes/node.styles";
// import { useCallback, useState } from "react";
// import { ChevronRight } from "lucide-react";
// import { useNewStore } from "@/hooks/useStore";

export const ColumnsView = ({
  windowId,
  nodes,
  view,
}: {
  windowId: string;
  nodes: NodeEntry[];
  view: "icons" | "list" | "columns";
}) => {
  // const [columns, setColumns] = useState<NodeEntry[][]>([]);
  const history = useFinderHistory(windowId);
  console.log("COLUMNS_VIEW_01: history", history);
  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="w-1/2 h-full flex flex-col items-start bg-red-500/20">
        {nodes.map((node) => (
          <NodeSwitch
            key={node.id}
            node={node}
            windowId={windowId}
            view={view}
          />
        ))}
      </div>
    </div>
  );
};
