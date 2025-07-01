import type {
  NodeEntry,
  EasterEggEntry,
  IconEntry,
  DirectoryEntry,
  LinkEntry,
  TerminalEntry,
  BrowserEntry,
  AchievementEntry,
  GameEntry,
  DocumentEntry,
  AppEntry,
} from "../../types/nodeTypes";
import { IconNode } from "./IconNode";
import { DirectoryNode } from "./DirectoryNode";
import { LinkNode } from "./LinkNode";
import { TerminalNode } from "./TerminalNode";
import { EasterEggNode } from "./EasterEggNode";
import { BrowserNode } from "./BrowserNode";
import { AchievementNode } from "./AchievementNode";
import { GameNode } from "./GameNode";
import { DocumentNode } from "./DocumentNode";
import { AppNode } from "./AppNode";

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

    case "icon":
      return <IconNode key={node.id} icon={node as IconEntry} />;

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

    case "terminal":
      return <TerminalNode key={node.id} terminal={node as TerminalEntry} />;

    case "browser":
      return <BrowserNode key={node.id} browserEntry={node as BrowserEntry} />;

    case "achievement":
      return (
        <AchievementNode key={node.id} achievement={node as AchievementEntry} />
      );

    case "game":
      return <GameNode key={node.id} game={node as GameEntry} />;

    case "document":
      return <DocumentNode key={node.id} document={node as DocumentEntry} />;

    case "app":
      return <AppNode key={node.id} app={node as AppEntry} />;

    default:
      console.warn("Unknown node type:", node);
      return null;
  }
};
