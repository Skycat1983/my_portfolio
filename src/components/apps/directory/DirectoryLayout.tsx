import type { NodeEntry } from "../../../types/nodeTypes";
import { NodeSwitch } from "../../nodes/NodeSwitch";
import { useNewStore } from "../../../hooks/useStore";

type DirectoryLayoutProps = {
  nodes: NodeEntry[];
  isWindow?: boolean;
};

export const DirectoryLayout = ({
  nodes,
  isWindow = false,
}: DirectoryLayoutProps) => {
  const operatingSystem = useNewStore((s) => s.operatingSystem);

  // Window directory layout
  if (isWindow) {
    return (
      <div className="w-full h-full flex justify-start items-start gap-6 flex-wrap">
        {nodes.map((node) => (
          <div key={node.id} className="w-20 flex-shrink-0">
            <NodeSwitch node={node} />
          </div>
        ))}
      </div>
    );
  }
  // Desktop/Mobile home page directory layout

  return (
    <>
      {/* Mobile/Tablet: Use CSS Grid for better centering control */}
      <div className="block lg:hidden">
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(80px,_1fr))] justify-items-center gap-6 w-full md:justify-items-start">
          {nodes.map((node) => (
            <div key={node.id} className="w-20 md:w-24">
              <NodeSwitch node={node} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Use the working logic from commented code */}
      <div
        className={`hidden lg:flex flex-col w-full gap-10 h-full content-start ${
          operatingSystem === "windows" ? "flex-wrap" : "flex-wrap-reverse"
        }`}
      >
        {nodes.map((node) => (
          <div key={node.id} className="w-20 flex-shrink-0">
            <NodeSwitch node={node} />
          </div>
        ))}
      </div>
    </>
  );
};
