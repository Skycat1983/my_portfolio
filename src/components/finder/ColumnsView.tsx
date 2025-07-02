import React from "react";
import { ChevronRight } from "lucide-react";
import { useNewStore } from "@/hooks/useStore";

export const ColumnsView = ({ windowId }: { windowId: string }) => {
  // Use window history for column navigation (per-window state)
  const finderWindow = useNewStore((s) => s.getWindowById(windowId));
  const getChildrenByParentID = useNewStore((s) => s.getChildrenByParentID);
  const getNodeByID = useNewStore((s) => s.getNodeByID);

  // Window history actions
  const addToWindowHistory = useNewStore((s) => s.addToWindowHistory);
  const updateWindowById = useNewStore((s) => s.updateWindowById);

  // Build column structure from window history
  const columns = React.useMemo(() => {
    if (!finderWindow) return [];

    // Get current navigation path from window history
    const currentPath =
      finderWindow.itemHistory?.slice(
        0,
        (finderWindow.currentHistoryIndex || 0) + 1
      ) || [];

    // If no history, start with window's current directory
    const startingNodeId = finderWindow.nodeId || "desktop-root";
    const fullPath = currentPath.length > 0 ? currentPath : [startingNodeId];

    return fullPath.map((nodeId, depth) => {
      const children = getChildrenByParentID(nodeId);
      const selectedChild = fullPath[depth + 1] || null;

      return {
        nodeId,
        depth,
        children,
        selectedChild, // What's selected in this column
      };
    });
  }, [finderWindow, getChildrenByParentID]);

  if (!finderWindow) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-gray-500">No finder window context</div>
      </div>
    );
  }

  const handleColumnItemClick = (columnDepth: number, nodeId: string) => {
    console.log(
      "ColumnsView: item clicked at depth",
      columnDepth,
      "nodeId",
      nodeId
    );

    const node = getNodeByID(nodeId);

    if (node?.type === "directory") {
      // For directories: navigate to the directory (add to history)
      addToWindowHistory(finderWindow.windowId, nodeId);
      updateWindowById(finderWindow.windowId, {
        nodeId,
        title: `Finder - ${node.label}`,
      });
    } else {
      // For non-directories: just update current selection without navigation
      updateWindowById(finderWindow.windowId, {
        nodeId,
        title: `Finder - ${node?.label || nodeId}`,
      });
      console.log("ColumnsView: non-directory item selected:", node?.label);
    }
  };

  const handleColumnHeaderClick = (targetDepth: number) => {
    console.log(
      "ColumnsView: header clicked, navigating to depth",
      targetDepth
    );

    // Navigate back to this depth by updating history index
    const targetHistoryIndex = targetDepth;
    const targetNodeId = finderWindow.itemHistory?.[targetHistoryIndex];

    if (targetNodeId) {
      updateWindowById(finderWindow.windowId, {
        nodeId: targetNodeId,
        currentHistoryIndex: targetHistoryIndex,
      });
    }
  };

  const getNodeLabel = (nodeId: string): string => {
    if (nodeId === "desktop-root") return "Desktop";
    const node = getNodeByID(nodeId);
    return node?.label || nodeId;
  };

  return (
    <div className="w-full h-full flex bg-white">
      {columns.map((column) => (
        <div
          key={`${column.nodeId}-${column.depth}`}
          className="flex-shrink-0 w-48 border-r border-gray-200 flex flex-col bg-white"
        >
          {/* Column Header */}
          <div className="bg-gray-100 border-b border-gray-200 px-3 py-2">
            <button
              onClick={() => handleColumnHeaderClick(column.depth)}
              className="text-sm font-medium text-gray-700 hover:text-gray-900 truncate w-full text-left"
              title={column.nodeId}
            >
              {getNodeLabel(column.nodeId)}
            </button>
          </div>

          {/* Column Content */}
          <div className="flex-1 overflow-auto">
            {column.children.map((child) => (
              <div
                key={child.id}
                className={`
                  px-3 py-2 border-b border-gray-100 cursor-pointer 
                  hover:bg-blue-100 transition-colors
                  ${child.id === column.selectedChild ? "bg-blue-50" : ""}
                  ${
                    child.type === "directory"
                      ? "text-blue-600"
                      : "text-gray-700"
                  }
                `}
                onClick={() => handleColumnItemClick(column.depth, child.id)}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={
                      Array.isArray(child.image) ? child.image[0] : child.image
                    }
                    alt={child.label}
                    className="w-4 h-4 object-contain flex-shrink-0"
                  />
                  <span className="text-sm truncate">{child.label}</span>
                  {child.type === "directory" && (
                    <ChevronRight size={12} className="text-gray-400 ml-auto" />
                  )}
                </div>
              </div>
            ))}

            {column.children.length === 0 && (
              <div className="px-3 py-4 text-center text-gray-500 text-sm">
                Empty
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Preview column for when we have a selected item */}
      {columns.length > 0 && (
        <div className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-sm">
              {finderWindow.nodeId ? "Selected" : "No Selection"}
            </div>
            <div className="text-xs mt-1">
              {finderWindow.nodeId
                ? `${getNodeLabel(finderWindow.nodeId)}`
                : "Click an item to select"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
