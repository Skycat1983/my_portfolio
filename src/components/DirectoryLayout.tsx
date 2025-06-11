import type { EasterEggEntry, NodeEntry } from "../types/nodeTypes";
import type { DragHandlers } from "../types/dragHandlers";
import { NodeIcon } from "./NodeIcon";
import { EasterEgg } from "./nodes/easterEgg/EasterEgg";

type LayoutType = "desktop" | "window";

type DirectoryLayoutProps = {
  nodes: NodeEntry[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  onDoubleClickNode?: (nodeId: string) => void;
  layout?: LayoutType;
  dragHandlers?: DragHandlers;
};

export const DirectoryLayout = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  onDoubleClickNode,
  layout = "window",
  dragHandlers,
}: DirectoryLayoutProps) => {
  const getLayoutClasses = () => {
    if (layout === "desktop") {
      // Desktop layout: column-first, wrap-reverse (Mac-style)
      return "flex flex-col flex-wrap-reverse content-start w-full gap-10 h-full";
    } else {
      // Window layout: row-first, wrap-down (standard file browser)
      return "flex flex-row flex-wrap justify-start items-start w-full gap-4 p-2";
    }
  };

  return (
    <div className={getLayoutClasses()}>
      {nodes.map((node) =>
        node.type === "easter-egg" ? (
          <EasterEgg key={node.id} egg={node as EasterEggEntry} />
        ) : (
          <NodeIcon
            key={node.id}
            node={node}
            isSelected={selectedNodeId === node.id}
            onSelect={onSelectNode}
            onDoubleClick={onDoubleClickNode}
            dragHandlers={dragHandlers}
          />
        )
      )}
    </div>
  );
};
