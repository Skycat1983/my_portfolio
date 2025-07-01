import type { NodeEntry } from "../../../types/nodeTypes";

interface FinderBodyProps {
  view: "icons" | "list" | "columns";
  nodes: NodeEntry[];
  rootId: string;
}

const ListLayout = ({ nodes }: { nodes: NodeEntry[] }) => {
  return <div>ListLayout</div>;
};

const ColumnsLayout = ({ nodes }: { nodes: NodeEntry[] }) => {
  return <div>ColumnsLayout</div>;
};

const IconsLayout = ({ nodes }: { nodes: NodeEntry[] }) => {
  return <div>IconsLayout</div>;
};

export const FinderBody = ({ nodes, view, rootId }: FinderBodyProps) => {
  if (view === "list") return <ListLayout nodes={nodes} />;
  if (view === "columns") return <ColumnsLayout nodes={nodes} />;
  return <IconsLayout nodes={nodes} />;
};
