import { useFinderHistory } from "./hooks/useFinderHistory";
import { NodeSwitch } from "../nodes/NodeSwitch";
import { useNewStore } from "@/hooks/useStore";
import { NodeDropZoneWrapper } from "./NodeDropZoneWrapper";
import { useEffect, useRef, useMemo } from "react";

export const ColumnsView = ({
  windowId,
  view,
}: {
  windowId: string;
  view: "icons" | "list" | "columns";
}) => {
  const selectedNodeId = useNewStore((s) => s.selectedNodeId);
  const getChildrenByParentID = useNewStore((s) => s.getChildrenByParentID);
  const history = useFinderHistory(windowId);
  const containerRef = useRef<HTMLDivElement>(null);
  const window = useNewStore((s) => s.getWindowById(windowId));
  const isMaximized = window?.isMaximized;

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

  console.log("COLUMNS_VIEW_01: selectedNodeId", selectedNodeId);
  console.log("COLUMNS_VIEW_02: columnPath", columnPath);
  console.log("COLUMNS_VIEW_03: window maximized state:", window?.isMaximized);
  console.log("COLUMNS_VIEW_04: total columns:", totalColumns);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-row p-4 overflow-x-auto scroll-smooth"
    >
      {/* Active columns */}
      {columnPath.map((nodeId, depth) => (
        <div
          key={nodeId}
          className="w-[250px] min-w-[250px] h-full flex flex-col items-start bg-neutral-900/50 rounded-lg p-2 mr-2"
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
          className="w-[250px] min-w-[250px] h-full flex flex-col items-start bg-neutral-900/50 rounded-lg p-2 mr-2"
        />
      ))}
    </div>
  );
};
