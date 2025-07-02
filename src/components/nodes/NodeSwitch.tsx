import type {
  NodeEntry,
  EasterEggEntry,
  DirectoryEntry,
  LinkEntry,
  ApplicationEntry,
} from "../../types/nodeTypes";
import { DirectoryNode } from "./DirectoryNode";
import { LinkNode } from "./LinkNode";
import { EasterEggNode } from "./EasterEggNode";
import { AppNode } from "./ApplicationNode";

type LayoutType = "desktop" | "window";

type NodeSwitchProps = {
  node: NodeEntry;
  layout?: LayoutType;
  parentWindowId?: string;
};

export const NodeSwitch = ({
  node,
  layout = "window",
  parentWindowId,
}: NodeSwitchProps) => {
  switch (node.type) {
    case "easter-egg":
      return <EasterEggNode key={node.id} egg={node as EasterEggEntry} />;

    case "directory":
      return (
        <DirectoryNode
          key={node.id}
          nodeEntry={node as DirectoryEntry}
          layout={layout}
          parentWindowId={parentWindowId || ""}
        />
      );

    case "link":
      return <LinkNode key={node.id} link={node as LinkEntry} />;

    case "application":
      return <AppNode key={node.id} app={node as ApplicationEntry} />;

    default:
      console.warn("Unknown node type:", node);
      return null;
  }
};
