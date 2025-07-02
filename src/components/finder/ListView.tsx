import React from "react";
import type { NodeEntry } from "@/types/nodeTypes";

interface ListViewProps {
  nodes: NodeEntry[];
}

export const ListView = ({ nodes }: ListViewProps) => {
  const [sortBy, setSortBy] = React.useState<
    "name" | "type" | "size" | "modified"
  >("name");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "asc"
  );

  const handleSort = (column: "name" | "type" | "size" | "modified") => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  const sortedNodes = React.useMemo(() => {
    return [...nodes].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case "name":
          aValue = a.label.toLowerCase();
          bValue = b.label.toLowerCase();
          break;
        case "type":
          aValue = a.type;
          bValue = b.type;
          break;
        case "size":
          // For now, return 0 for directories, 1 for files
          aValue = a.type === "directory" ? 0 : 1;
          bValue = b.type === "directory" ? 0 : 1;
          break;
        case "modified":
          // For now, use creation order (could be enhanced with actual dates)
          aValue = a.id;
          bValue = b.id;
          break;
        default:
          aValue = a.label.toLowerCase();
          bValue = b.label.toLowerCase();
      }

      if (sortDirection === "desc") {
        [aValue, bValue] = [bValue, aValue];
      }

      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    });
  }, [nodes, sortBy, sortDirection]);

  const getSortIcon = (column: "name" | "type" | "size" | "modified") => {
    if (sortBy !== column) return "↕️";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const getTypeDisplay = (node: NodeEntry) => {
    switch (node.type) {
      case "directory":
        return "Folder";
      case "application":
        return "Application";
      case "link":
        return "Link";
      case "easter-egg":
        return "Easter Egg";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Table Header */}
      <div className="bg-gray-100 border-b border-gray-200 px-4 py-2">
        <div className="grid grid-cols-[2fr_1fr_80px_120px] gap-4 text-sm font-medium text-gray-600">
          <button
            onClick={() => handleSort("name")}
            className="text-left hover:text-gray-900 transition-colors"
          >
            Name {getSortIcon("name")}
          </button>
          <button
            onClick={() => handleSort("type")}
            className="text-left hover:text-gray-900 transition-colors"
          >
            Kind {getSortIcon("type")}
          </button>
          <button
            onClick={() => handleSort("size")}
            className="text-left hover:text-gray-900 transition-colors"
          >
            Size {getSortIcon("size")}
          </button>
          <button
            onClick={() => handleSort("modified")}
            className="text-left hover:text-gray-900 transition-colors"
          >
            Modified {getSortIcon("modified")}
          </button>
        </div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-auto">
        {sortedNodes.map((node) => (
          <div
            key={node.id}
            className="border-b border-gray-100 px-4 py-2 hover:bg-blue-50 cursor-pointer"
            onClick={() => {
              // TODO: Implement node activation for list view
              console.log("List item clicked:", node.label);
            }}
          >
            <div className="grid grid-cols-[2fr_1fr_80px_120px] gap-4 text-sm items-center">
              {/* Name with icon */}
              <div className="flex items-center gap-2">
                <img
                  src={Array.isArray(node.image) ? node.image[0] : node.image}
                  alt={node.label}
                  className="w-4 h-4 object-contain"
                />
                <span className="truncate">{node.label}</span>
              </div>

              {/* Type */}
              <span className="text-gray-600 truncate">
                {getTypeDisplay(node)}
              </span>

              {/* Size */}
              <span className="text-gray-600 text-xs">
                {node.type === "directory" ? "--" : "1 KB"}
              </span>

              {/* Modified */}
              <span className="text-gray-600 text-xs">Today</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
