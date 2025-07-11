import type { NodeEntry } from "@/components/nodes/nodeTypes";
import { useNewStore } from "@/hooks/useStore";
import { desktopRootId } from "@/constants/nodes";
import { NodeSwitch } from "@/components/nodes/NodeSwitch";

type DirectoryLayoutProps = {
  nodes: NodeEntry[];
  windowId: string;
};

export const DirectoryLayout = ({ nodes, windowId }: DirectoryLayoutProps) => {
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  const isWindow = windowId !== desktopRootId;

  // Window directory layout
  if (isWindow) {
    return (
      <div className="w-full h-full flex justify-start items-start gap-6 flex-wrap">
        {nodes.map((node) => (
          <div key={node.id} className="w-20 flex-shrink-0">
            <NodeSwitch node={node} windowId={windowId} view="icons" />
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
              <NodeSwitch node={node} windowId={windowId} view="icons" />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Use the working logic from commented code */}
      <div
        className={`hidden lg:flex flex-col w-full gap-10 space-y-10 h-full content-start ${
          operatingSystem === "windows" ? "flex-wrap" : "flex-wrap-reverse"
        }`}
      >
        {nodes.map((node) => (
          <div key={node.id} className="w-20 flex-shrink-0">
            <NodeSwitch node={node} windowId={windowId} view="icons" />
          </div>
        ))}
      </div>
    </>
  );
};
