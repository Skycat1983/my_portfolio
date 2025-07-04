import React from "react";
import type {
  NodeEntry,
  ApplicationEntry,
  LinkEntry,
  EasterEggEntry,
  FunctionEntry,
  DocumentEntry,
} from "@/types/nodeTypes";
import { NodeSwitch } from "../nodes/NodeSwitch";
import { useNewStore } from "@/hooks/useStore";
import clsx from "clsx";

interface ListViewProps {
  nodes: NodeEntry[];
  windowId: string;
}

export const ListView = ({ nodes, windowId }: ListViewProps) => {
  const [sortBy, setSortBy] = React.useState<
    "name" | "type" | "size" | "modified"
  >("name");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "asc"
  );
  const selectedNodeId = useNewStore((state) => state.selectedNodeId);

  const handleSort = (column: "name" | "type" | "size" | "modified") => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  const getExtension = (node: NodeEntry): string => {
    if (node.type === "directory") return "";
    switch (node.type) {
      case "application":
        return (
          (node as ApplicationEntry).macExtension ||
          (node as ApplicationEntry).windowsExtension
        );
      case "link":
        return (
          (node as LinkEntry).macExtension ||
          (node as LinkEntry).windowsExtension
        );
      case "easter-egg":
        return (
          (node as EasterEggEntry).macExtension ||
          (node as EasterEggEntry).windowsExtension
        );
      case "function":
        return (
          (node as FunctionEntry).macExtension ||
          (node as FunctionEntry).windowsExtension
        );
      case "document":
        return (
          (node as DocumentEntry).macExtension ||
          (node as DocumentEntry).windowsExtension
        );
      default:
        return "";
    }
  };

  const formatSize = (size: number | null): string => {
    if (size === null) return "--";
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getKindDisplay = (node: NodeEntry): string => {
    const ext = getExtension(node);
    switch (node.type) {
      case "directory":
        return "Folder";
      case "application":
        return ext === ".app" ? "Application" : "Windows Application";
      case "link":
        switch (ext) {
          case ".webloc":
            return "Web Link";
          case ".url":
            return "Web Link";
          case ".pdf":
            return "PDF Document";
          case ".png":
          case ".jpg":
            return "Image";
          default:
            return "Link";
        }
      case "easter-egg":
        return "Easter Egg";
      case "function":
        return "Function";
      case "document":
        return "Text Document";
      default:
        return "Unknown";
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
          aValue = getExtension(a);
          bValue = getExtension(b);
          break;
        case "size":
          aValue = a.size || -1;
          bValue = b.size || -1;
          break;
        case "modified":
          aValue = new Date(a.dateModified).getTime();
          bValue = new Date(b.dateModified).getTime();
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

  const textColor = "text-white";
  const getLineColor = (index: number) => {
    if (index % 2 === 0) return "bg-gray-800";
    return "bg-gray-900";
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Table Header */}
      <div className="bg-gray-100 border-b border-gray-200 px-4 py-2">
        <div className="grid grid-cols-[2fr_1.5fr_80px_1fr] gap-4 text-sm font-medium text-gray-600">
          <button
            onClick={() => handleSort("name")}
            className={clsx(
              "text-left hover:text-gray-900 transition-colors flex items-center",
              sortBy === "name" && "font-bold"
            )}
          >
            Name
            <span className="ml-1 text-xs">
              {sortBy === "name" && (sortDirection === "asc" ? "▲" : "▼")}
            </span>
          </button>
          <button
            onClick={() => handleSort("modified")}
            className={clsx(
              "text-left hover:text-gray-900 transition-colors flex items-center",
              sortBy === "modified" && "font-bold"
            )}
          >
            Date Modified
            <span className="ml-1 text-xs">
              {sortBy === "modified" && (sortDirection === "asc" ? "▲" : "▼")}
            </span>
          </button>
          <button
            onClick={() => handleSort("size")}
            className={clsx(
              "text-right hover:text-gray-900 transition-colors flex items-center justify-end",
              sortBy === "size" && "font-bold"
            )}
          >
            Size
            <span className="ml-1 text-xs">
              {sortBy === "size" && (sortDirection === "asc" ? "▲" : "▼")}
            </span>
          </button>
          <button
            onClick={() => handleSort("type")}
            className={clsx(
              "text-left hover:text-gray-900 transition-colors flex items-center",
              sortBy === "type" && "font-bold"
            )}
          >
            Kind
            <span className="ml-1 text-xs">
              {sortBy === "type" && (sortDirection === "asc" ? "▲" : "▼")}
            </span>
          </button>
        </div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-auto">
        {sortedNodes.map((node, index) => (
          <div
            key={node.id}
            className={clsx(
              "grid grid-cols-[2fr_1.5fr_80px_1fr] gap-4 px-4 py-1 text-s cursor-pointer",
              getLineColor(index),
              selectedNodeId === node.id && "bg-blue-500/30"
            )}
          >
            <div className="flex items-center">
              <NodeSwitch
                key={node.id}
                node={node}
                windowId={windowId}
                view="list"
              />
            </div>
            <div
              className={clsx(
                textColor,
                "text-left truncate text-sm flex items-center"
              )}
            >
              {formatDate(node.dateModified)}
            </div>
            <div
              className={clsx(
                textColor,
                "text-right truncate text-sm flex items-center"
              )}
            >
              {formatSize(node.size)}
            </div>
            <div
              className={clsx(
                textColor,
                "text-left truncate text-sm flex items-center"
              )}
            >
              {getKindDisplay(node)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
