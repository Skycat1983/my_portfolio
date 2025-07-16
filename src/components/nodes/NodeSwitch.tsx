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
import type { RootDirectoryId } from "@/constants/nodeHierarchy";

type NodeSwitchProps = {
  node: NodeEntry;
  windowId: WindowId | RootDirectoryId;
  view: "icons" | "list" | "columns";
};

export const NodeSwitch = ({ node, windowId, view }: NodeSwitchProps) => {
  switch (node.type) {
    case "easter-egg":
      return (
        <EasterEggNode
          key={node.id}
          egg={node as EasterEggEntry}
          view={view}
          windowId={windowId}
        />
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
      return (
        <LinkNode
          key={node.id}
          link={node as LinkEntry}
          view={view}
          windowId={windowId}
        />
      );

    case "application":
      return (
        <ApplicationNode
          key={node.id}
          node={node as ApplicationEntry}
          view={view}
          windowId={windowId}
        />
      );

    case "function":
      return (
        <FunctionNode
          key={node.id}
          node={node as FunctionEntry}
          view={view}
          windowId={windowId}
        />
      );

    case "document":
      return (
        <DocumentNode
          key={node.id}
          node={node as DocumentEntry}
          view={view}
          windowId={windowId}
        />
      );

    default:
      console.warn("Unknown node type:", node);
      return null;
  }
};
