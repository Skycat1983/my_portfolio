import type { MapNode } from "../constants/nodes";
import { NodeIcon } from "./NodeIcon";

type LayoutType = "desktop" | "window";

type DirectoryLayoutProps = {
  nodes: MapNode[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  onDoubleClickNode?: (nodeId: string) => void;
  layout?: LayoutType;
};

export const DirectoryLayout = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  onDoubleClickNode,
  layout = "window",
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
      {nodes.map((node) => (
        <NodeIcon
          key={node.id}
          node={node}
          isSelected={selectedNodeId === node.id}
          onSelect={onSelectNode}
          onDoubleClick={onDoubleClickNode}
        />
      ))}
    </div>
  );
};
