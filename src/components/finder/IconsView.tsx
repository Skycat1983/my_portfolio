import type { NodeEntry } from "@/components/nodes/nodeTypes";
import { NodeSwitch } from "../nodes/NodeSwitch";
import { useNewStore } from "@/hooks/useStore";
import { NodeDropZoneWrapper } from "./NodeDropZoneWrapper";
import type { WindowId } from "@/constants/applicationRegistry";
import theme from "@/styles/theme";

interface IconsViewProps {
  nodes: NodeEntry[];
  windowId: WindowId;
  view: "icons" | "list" | "columns";
  nodeId: string;
}

export const IconsView = ({
  nodes,
  windowId,
  view,
  nodeId,
}: IconsViewProps) => {
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  const currentTheme = useNewStore((s) => s.theme);
  const bgColourTertiary = theme.colors[currentTheme].background.tertiary;
  return (
    <div
      className="w-full h-full p-6"
      style={{
        backgroundColor: bgColourTertiary,
        // borderColor: borderColor,
      }}
    >
      <NodeDropZoneWrapper nodeId={nodeId} shrinkToFit={false}>
        {/* Mobile/Tablet: Use CSS Grid for better centering control */}
        <div className="block lg:hidden">
          <div className="grid grid-cols-[repeat(auto-fit,_minmax(80px,_1fr))] justify-items-center gap-6 w-full md:justify-items-start">
            {nodes.map((node) => (
              <div key={node.id} className="w-20 md:w-24">
                <NodeSwitch node={node} windowId={windowId} view={view} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Use OS-specific layout direction */}
        <div
          className={`hidden lg:flex flex-row w-full gap-6 space-y-6 h-full content-start ${
            operatingSystem === "windows" ? "flex-wrap" : "flex-wrap"
          }`}
        >
          {nodes.map((node) => (
            <div key={node.id} className="w-20 flex-shrink-0">
              <NodeSwitch node={node} windowId={windowId} view={view} />
            </div>
          ))}
        </div>
      </NodeDropZoneWrapper>
    </div>
  );
};
