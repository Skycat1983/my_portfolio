import type { NodeEntry } from "../../../types/nodeTypes";
import { IconsView } from "./IconsView";
import { ColumnsView } from "./ColumnsView";
import { ListView } from "./ListView";

interface FinderBodyProps {
  view: "icons" | "list" | "columns";
  nodes: NodeEntry[];
  rootId: string;
  windowId?: string; // Optional for now, only needed for columns view
}

export const FinderBody = ({ nodes, view, windowId }: FinderBodyProps) => {
  if (view === "list") return <ListView nodes={nodes} />;
  if (view === "columns") return <ColumnsView windowId={windowId!} />;
  return <IconsView nodes={nodes} />;
};
