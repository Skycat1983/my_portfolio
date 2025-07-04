import type { NodeEntry } from "@/types/nodeTypes";
import { NodeSwitch } from "../nodes/NodeSwitch";
import { useNewStore } from "@/hooks/useStore";

interface IconsViewProps {
  nodes: NodeEntry[];
  windowId: string;
  view: "icons" | "list" | "columns";
}

export const IconsView = ({ nodes, windowId, view }: IconsViewProps) => {
  const operatingSystem = useNewStore((s) => s.operatingSystem);

  return (
    <div className="w-full h-full p-6">
      {/* Mobile/Tablet: Use CSS Grid for better centering control */}
      <div className="block lg:hidden">
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(80px,_1fr))] justify-items-center gap-6 w-full md:justify-items-start">
          {nodes.map((node) => (
            <div key={node.id} className="w-20 md:w-24">
              <NodeSwitch
                node={node}
                layout="window"
                windowId={windowId}
                view={view}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Use OS-specific layout direction */}
      <div
        className={`hidden lg:flex flex-col w-full gap-6 h-full content-start ${
          operatingSystem === "windows" ? "flex-wrap" : "flex-wrap-reverse"
        }`}
      >
        {nodes.map((node) => (
          <div key={node.id} className="w-20 flex-shrink-0">
            <NodeSwitch
              node={node}
              layout="window"
              windowId={windowId}
              view={view}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
