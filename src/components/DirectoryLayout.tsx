import type {
  NodeEntry,
  EasterEggEntry,
  IconEntry,
  DirectoryEntry,
  LinkEntry,
  TerminalEntry,
} from "../types/nodeTypes";
import { IconNode } from "./nodes/IconNode";
import { DirectoryNode } from "./nodes/DirectoryNode";
import { LinkNode } from "./nodes/LinkNode";
import { TerminalNode } from "./nodes/TerminalNode";
import { EasterEggNode } from "./nodes/EasterEggNode";

type LayoutType = "desktop" | "window";

type DirectoryLayoutProps = {
  nodes: NodeEntry[];
  layout?: LayoutType;
};

export const DirectoryLayout = ({
  nodes,
  layout = "window",
}: DirectoryLayoutProps) => {
  const getLayoutClasses = () =>
    layout === "desktop"
      ? "flex flex-col flex-wrap-reverse content-start w-full gap-10 h-full"
      : "flex flex-row flex-wrap justify-start items-start w-full gap-4 p-2";

  return (
    <div className={getLayoutClasses()}>
      {nodes.map((node) => {
        switch (node.type) {
          case "easter-egg":
            return <EasterEggNode key={node.id} egg={node as EasterEggEntry} />;

          case "icon":
            return <IconNode key={node.id} icon={node as IconEntry} />;

          case "directory":
            return (
              <DirectoryNode key={node.id} directory={node as DirectoryEntry} />
            );

          case "link":
            return <LinkNode key={node.id} link={node as LinkEntry} />;

          case "terminal":
            return (
              <TerminalNode key={node.id} terminal={node as TerminalEntry} />
            );

          default:
            // This should never happen if all node types are handled above
            console.warn("Unknown node type:", node);
            return null;
        }
      })}
    </div>
  );
};
