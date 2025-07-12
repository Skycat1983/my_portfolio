import type {
  NodeEntry,
  EasterEggEntry,
  DirectoryEntry,
  LinkEntry,
  ApplicationEntry,
  FunctionEntry,
  DocumentEntry,
} from "@/components/nodes/nodeTypes";
import { LinkNode } from "./LinkNode";
import { EasterEggNode } from "./EasterEggNode";
import { ApplicationNode } from "./ApplicationNode";
import { FunctionNode } from "./FunctionNode";
import { DocumentNode } from "./DocumentNode";
import type { WindowId } from "@/constants/applicationRegistry";
import { DirectoryNode } from "./DirectoryNode";
import type { DesktopRootId, DockRootId } from "@/constants/nodeHierarchy";

type NodeSwitchProps = {
  node: NodeEntry;
  windowId: WindowId | DesktopRootId | DockRootId;
  view: "icons" | "list" | "columns";
};

export const NodeSwitch = ({ node, windowId, view }: NodeSwitchProps) => {
  switch (node.type) {
    case "easter-egg":
      return (
        <EasterEggNode key={node.id} egg={node as EasterEggEntry} view={view} />
      );

    case "directory":
      return (
        <DirectoryNode
          key={node.id}
          nodeEntry={node as DirectoryEntry}
          // layout={layout}
          windowId={windowId}
          view={view}
        />
      );

    case "link":
      return <LinkNode key={node.id} link={node as LinkEntry} view={view} />;

    case "application":
      return (
        <ApplicationNode
          key={node.id}
          node={node as ApplicationEntry}
          view={view}
        />
      );

    case "function":
      return (
        <FunctionNode key={node.id} node={node as FunctionEntry} view={view} />
      );

    case "document":
      return (
        <DocumentNode key={node.id} node={node as DocumentEntry} view={view} />
      );

    default:
      console.warn("Unknown node type:", node);
      return null;
  }
};
