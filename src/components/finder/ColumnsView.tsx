import { useFinderHistory } from "./hooks/useFinderHistory";
import { NodeSwitch } from "../nodes/NodeSwitch";
import { useNewStore } from "@/hooks/useStore";
import { NodeDropZoneWrapper } from "./NodeDropZoneWrapper";
import { useEffect, useRef, useMemo } from "react";
import type { WindowId } from "@/constants/applicationRegistry";
import theme from "@/styles/theme";
import type { NodeId } from "@/components/nodes/nodeTypes";
import { desktopRootId, systemRootId } from "@/constants/nodeHierarchy";

export const ColumnsView = ({
  windowId,
  view,
  nodeId,
}: {
  windowId: WindowId;
  view: "icons" | "list" | "columns";
  nodeId: NodeId;
}) => {
  const selectedNodeId = useNewStore((s) => s.selectedNodeId);
  const getChildrenByParentID = useNewStore((s) => s.getChildrenByParentID);
  const currentTheme = useNewStore((s) => s.theme);
  const history = useFinderHistory(windowId, nodeId);
  const containerRef = useRef<HTMLDivElement>(null);
  const window = useNewStore((s) => s.findWindowById(windowId));
  const isMaximized = window?.isMaximized;

  console.log("COLUMNS_VIEW_03  : windowId", windowId);
  console.log("COLUMNS_VIEW_04: nodeId", nodeId);

  // Theme colors
  const bgColorSecondary = theme.colors[currentTheme].background.secondary;
  const contentTextColor = theme.colors[currentTheme].text.secondary;
  const borderColor = theme.colors[currentTheme].border.primary;

  // Get column path using new helper method
  const columnPath = history.getColumnPath();

  // Calculate total available width and number of columns that can fit
  const totalColumns = useMemo(() => {
    if (!window) return 0;
    const columnWidth = 250; // Width of each column
    const padding = 32; // Total horizontal padding (16px * 2)
    const gap = 8; // Gap between columns
    const availableWidth = isMaximized ? window.width : window.width - padding;
    return (
      Math.max(
        Math.floor(availableWidth / (columnWidth + gap)),
        columnPath.length
      ) + 1
    );
  }, [window, columnPath.length, isMaximized]);

  // Scroll to show active columns whenever they change
  useEffect(() => {
    if (containerRef.current && columnPath.length > 0) {
      const activeColumnWidth = 250; // Width of active column
      const gap = 8; // Gap between columns
      const scrollPosition =
        (columnPath.length - 1) * (activeColumnWidth + gap);
      containerRef.current.scrollLeft = scrollPosition;
    }
  }, [columnPath.length]);

  console.log("COLUMNS_VIEW_05: selectedNodeId", selectedNodeId);
  console.log("COLUMNS_VIEW_06: columnPath", columnPath);
  console.log("COLUMNS_VIEW_07: window maximized state:", window?.isMaximized);
  console.log("COLUMNS_VIEW_08: total columns:", totalColumns);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-row p-4 overflow-x-auto scroll-smooth"
      style={{ color: contentTextColor }}
    >
      {/* Active columns */}
      {columnPath.map((nodeId, depth) => (
        <div
          key={nodeId}
          className="w-[250px] min-w-[250px] h-full flex flex-col items-start rounded-lg p-2 mr-2"
          style={{
            backgroundColor: bgColorSecondary,
            borderColor: borderColor,
            border: `1px solid ${borderColor}`,
          }}
        >
          <NodeDropZoneWrapper nodeId={nodeId} shrinkToFit={false}>
            {getChildrenByParentID(nodeId).map((node) => (
              <div
                key={node.id}
                className="w-full"
                onClick={() => history.handleColumnClick(depth, node.id)}
              >
                <NodeSwitch
                  key={node.id}
                  node={node}
                  windowId={windowId}
                  view={view}
                />
              </div>
            ))}
          </NodeDropZoneWrapper>
        </div>
      ))}

      {/* Placeholder columns - only render enough to fill available space */}
      {Array.from({
        length: Math.max(0, totalColumns - columnPath.length),
      }).map((_, index) => (
        <div
          key={`placeholder-${index}`}
          className="w-[250px] min-w-[250px] h-full flex flex-col items-start rounded-lg p-2 mr-2"
          style={{
            backgroundColor: bgColorSecondary,
            borderColor: borderColor,
            border: `1px solid ${borderColor}`,
            opacity: 0.5,
          }}
        />
      ))}
    </div>
  );
};
