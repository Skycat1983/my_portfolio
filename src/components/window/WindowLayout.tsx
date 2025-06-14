import type {
  NodeEntry,
  EasterEggEntry,
  IconEntry,
  DirectoryEntry,
  LinkEntry,
  TerminalEntry,
  BrowserEntry,
} from "../../types/nodeTypes";
import { IconNode } from "../nodes/IconNode";
import { DirectoryNode } from "../nodes/DirectoryNode";
import { LinkNode } from "../nodes/LinkNode";
import { TerminalNode } from "../nodes/TerminalNode";
import { EasterEggNode } from "../nodes/EasterEggNode";
import { useNewStore } from "../../hooks/useStore";
import { BrowserNode } from "../nodes/BrowserNode";

type LayoutType = "desktop" | "window";

type DirectoryLayoutProps = {
  nodes: NodeEntry[];
  layout?: LayoutType;
};
export const WindowLayout = ({
  nodes,
  layout = "window",
}: DirectoryLayoutProps) => {
  const operatingSystem = useNewStore((s) => s.operatingSystem);

  const getLayoutClasses = () => {
    if (layout === "desktop") {
      // Windows wants normal wrapping; everything else keeps wrap-reverse
      const wrapClass =
        operatingSystem === "windows" ? "flex-wrap" : "flex-wrap-reverse pt-8";
      return `flex flex-col ${wrapClass} content-start w-full gap-10 h-full`;
    }
    // “window” layout
    return "flex flex-row flex-wrap justify-start items-start w-full gap-4 p-2";
  };

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

          case "browser":
            return <BrowserNode key={node.id} browser={node as BrowserEntry} />;

          default:
            console.warn("Unknown node type:", node);
            return null;
        }
      })}
    </div>
  );
};
