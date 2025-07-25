import type { NodeEntry } from "@/components/nodes/nodeTypes";
import { useNewStore } from "@/hooks/useStore";
import { desktopRootId } from "@/constants/nodeHierarchy";
import { NodeSwitch } from "@/components/nodes/NodeSwitch";

type DirectoryLayoutProps = {
  nodes: NodeEntry[];
  // desktopId: string;
  // isWindow: boolean;
};

export const DesktopLayout = ({
  nodes,
}: // desktopId,
DirectoryLayoutProps) => {
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  const windowId = desktopRootId;

  return (
    <>
      {/* Mobile/Tablet: Use CSS Grid for better centering control */}
      <div className="block lg:hidden">
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(50px,_1fr))]  justify-items-center gap-x-6 gap-y-12 w-full md:grid-cols-[repeat(auto-fit,_minmax(80px,_1fr))] md:justify-items-start">
          {nodes.map((node) => (
            <div key={node.id} className="w-16 rounded-xl md:w-20">
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
