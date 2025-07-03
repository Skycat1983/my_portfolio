import type {
  NodeEntry,
  EasterEggEntry,
  DirectoryEntry,
  LinkEntry,
  ApplicationEntry,
  FunctionEntry,
  DocumentEntry,
} from "@/types/nodeTypes";
import { LinkNode } from "./LinkNode";
import { EasterEggNode } from "./EasterEggNode";
import { ApplicationNode } from "./ApplicationNode";
import { FinderNode } from "./FinderNode";
import { FunctionNode } from "./FunctionNode";
import { DocumentNode } from "./DocumentNode";

type LayoutType = "desktop" | "window" | "dock";

type NodeSwitchProps = {
  node: NodeEntry;
  layout?: LayoutType;
  windowId: string;
};

export const NodeSwitch = ({
  node,
  layout = "window",
  windowId,
}: NodeSwitchProps) => {
  switch (node.type) {
    case "easter-egg":
      return <EasterEggNode key={node.id} egg={node as EasterEggEntry} />;

    case "directory":
      return (
        <FinderNode
          key={node.id}
          nodeEntry={node as DirectoryEntry}
          layout={layout}
          windowId={windowId}
        />
      );

    case "link":
      return <LinkNode key={node.id} link={node as LinkEntry} />;

    case "application":
      return (
        <ApplicationNode key={node.id} application={node as ApplicationEntry} />
      );

    case "function":
      return <FunctionNode key={node.id} node={node as FunctionEntry} />;

    case "document":
      return <DocumentNode key={node.id} document={node as DocumentEntry} />;

    default:
      console.warn("Unknown node type:", node);
      return null;
  }
};
