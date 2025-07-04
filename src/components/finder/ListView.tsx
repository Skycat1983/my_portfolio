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
import { Separator } from "../ui/separator";

interface ListViewProps {
  nodes: NodeEntry[];
  windowId: string;
}

const ROW_HEIGHT = 35; // px
const ROW_PADDING = 4; // px

export const ListView = ({ nodes, windowId }: ListViewProps) => {
  const [sortBy, setSortBy] = React.useState<
    "name" | "type" | "size" | "modified"
  >("name");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "asc"
  );
  const selectedNodeId = useNewStore((state) => state.selectedNodeId);
  const selectOneNode = useNewStore((state) => state.selectOneNode);
  const theme = useNewStore((state) => state.theme);

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

  const getBackgroundColor = (index: number) => {
    if (theme === "light") {
      return index % 2 === 0 ? "bg-gray-50" : "bg-white";
    }
    return index % 2 === 0 ? "bg-gray-800/50" : "bg-gray-900/50";
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Table Header */}
      <div
        className={clsx(
          "px-4 border-b sticky top-0 z-10",
          theme === "light"
            ? "bg-gray-100 border-gray-200"
            : "bg-gray-800 border-gray-700"
        )}
      >
        <div className="flex items-center h-9">
          <button
            onClick={() => handleSort("name")}
            className={clsx(
              "text-left hover:text-gray-900 transition-colors flex items-center whitespace-nowrap overflow-hidden flex-[2.5]",
              sortBy === "name" && "font-bold"
            )}
          >
            <span className="truncate">Name</span>
            <span className="ml-1 flex-shrink-0">
              {sortBy === "name" && (sortDirection === "asc" ? "▲" : "▼")}
            </span>
          </button>

          <div className="flex items-center h-full px-2">
            <Separator
              orientation="vertical"
              className="h-[10px] bg-gray-200/10"
            />
          </div>

          <button
            onClick={() => handleSort("modified")}
            className={clsx(
              "text-left hover:text-gray-900 transition-colors flex items-center whitespace-nowrap overflow-hidden flex-[2]",
              sortBy === "modified" && "font-bold"
            )}
          >
            <span className="truncate">Date Modified</span>
            <span className="ml-1 flex-shrink-0">
              {sortBy === "modified" && (sortDirection === "asc" ? "▲" : "▼")}
            </span>
          </button>

          <div className="flex items-center h-full px-2">
            <Separator
              orientation="vertical"
              className="h-[10px] bg-gray-200/10"
            />
          </div>

          <button
            onClick={() => handleSort("size")}
            className={clsx(
              "text-right hover:text-gray-900 transition-colors flex items-center justify-end whitespace-nowrap overflow-hidden w-[100px]",
              sortBy === "size" && "font-bold"
            )}
          >
            <span className="truncate">Size</span>
            <span className="ml-1 flex-shrink-0">
              {sortBy === "size" && (sortDirection === "asc" ? "▲" : "▼")}
            </span>
          </button>

          <div className="flex items-center h-full px-2">
            <Separator
              orientation="vertical"
              className="h-[10px] bg-gray-200/10"
            />
          </div>

          <button
            onClick={() => handleSort("type")}
            className={clsx(
              "text-left hover:text-gray-900 transition-colors flex items-center whitespace-nowrap overflow-hidden w-[120px]",
              sortBy === "type" && "font-bold"
            )}
          >
            <span className="truncate">Kind</span>
            <span className="ml-1 flex-shrink-0">
              {sortBy === "type" && (sortDirection === "asc" ? "▲" : "▼")}
            </span>
          </button>
        </div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-auto relative">
        {sortedNodes.map((node, index) => (
          <div
            key={node.id}
            onClick={() => selectOneNode(node.id)}
            style={{
              height: `${ROW_HEIGHT}px`,
              padding: `${ROW_PADDING}px 1rem`,
            }}
            className={clsx(
              "grid grid-cols-[2.5fr_2fr_100px_120px] gap-4 cursor-pointer relative",
              "items-center justify-center",
              getBackgroundColor(index),
              selectedNodeId === node.id && "!bg-blue-500/30",
              "hover:bg-blue-500/10"
            )}
          >
            <div className="flex items-center min-w-0">
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
                "text-left truncate flex items-center min-w-0 text-sm"
              )}
            >
              {formatDate(node.dateModified)}
            </div>
            <div
              className={clsx(
                textColor,
                "text-right truncate flex items-center justify-end min-w-0 text-sm"
              )}
            >
              {formatSize(node.size)}
            </div>
            <div
              className={clsx(
                textColor,
                "text-left truncate flex items-center min-w-0 text-sm"
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
