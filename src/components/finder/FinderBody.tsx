import type { NodeEntry } from "@/components/nodes/nodeTypes";
import { IconsView } from "./IconsView";
import { ColumnsView } from "./ColumnsView";
import { ListView } from "./ListView";
import type { WindowId } from "@/constants/applicationRegistry";

interface FinderBodyProps {
  view: "icons" | "list" | "columns";
  nodes: NodeEntry[];
  nodeId: string;
  windowId: WindowId;
}

export const FinderBody = ({
  nodes,
  view,
  windowId,
  nodeId,
}: FinderBodyProps) => {
  if (view === "list") return <ListView nodes={nodes} windowId={windowId} />;
  if (view === "columns")
    return <ColumnsView windowId={windowId!} view={view} />;
  return (
    <IconsView nodes={nodes} windowId={windowId} nodeId={nodeId} view={view} />
  );
};
