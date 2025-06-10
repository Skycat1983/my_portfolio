import { useStore } from "../../hooks/useStore";
import { useNodeDoubleClick } from "../../hooks/useNodeDoubleClick";
import { DirectoryLayout } from "../DirectoryLayout";
import type { DragHandlers } from "../../types/dragHandlers";

interface WindowContentProps {
  nodeId: string; // Original window nodeId
  dragHandlers?: DragHandlers;
}

export const WindowContent = ({ nodeId, dragHandlers }: WindowContentProps) => {
  const {
    getNode,
    getChildren,
    selectedNodeId,
    selectNode,
    getWindowByNodeId,
    getEasterEggCurrentImage,
  } = useStore();

  // Initialize shared double-click functionality for window context
  const { handleNodeDoubleClick } = useNodeDoubleClick({
    context: "window",
    windowNodeId: nodeId,
  });

  // Get the window state to see what we're currently viewing
  const windowState = getWindowByNodeId(nodeId);
  const currentNodeId = windowState?.currentNodeId || nodeId;
  const node = getNode(currentNodeId);

  if (!node) {
    return <div className="text-gray-400 text-center p-4">Node not found</div>;
  }

  // If it's a directory, show navigation and its children using DirectoryLayout
  if (node.type === "directory") {
    const children = getChildren(currentNodeId);

    return (
      <div className="h-full flex flex-col">
        {/* Directory Content - Make this area a drop target for the current folder */}
        <div
          className="flex-1 overflow-auto"
          // Make the window content area a drop target for the current folder
          onDragOver={
            dragHandlers
              ? (e) => dragHandlers.handleDragOver(e, currentNodeId)
              : undefined
          }
          onDragEnter={
            dragHandlers
              ? (e) => dragHandlers.handleDragEnter(e, currentNodeId)
              : undefined
          }
          onDragLeave={dragHandlers?.handleDragLeave}
          onDrop={
            dragHandlers
              ? (e) => dragHandlers.handleDrop(e, currentNodeId)
              : undefined
          }
        >
          {children.length === 0 ? (
            <div className="text-gray-400 text-center p-4">
              This folder is empty
            </div>
          ) : (
            <DirectoryLayout
              nodes={children}
              selectedNodeId={selectedNodeId}
              onSelectNode={selectNode}
              onDoubleClickNode={handleNodeDoubleClick}
              layout="window"
              dragHandlers={dragHandlers}
            />
          )}
        </div>
      </div>
    );
  }

  if (node.type === "easter-egg") {
    const currentImage = getEasterEggCurrentImage(nodeId);
    return (
      <div className="p-4 text-center">
        <img
          src={currentImage}
          alt={node.label}
          className="w-16 h-16 mx-auto mb-2"
        />
      </div>
    );
  }

  if (node.type === "app") {
    return (
      <div className="p-4 text-center">
        <div className="mb-4">
          <img
            src={node.image}
            alt={node.label}
            className="w-16 h-16 mx-auto mb-2"
          />
          <h2 className="text-lg font-semibold text-gray-100">{node.label}</h2>
        </div>
        <div className="text-gray-300 text-sm">
          <p>This is the {node.label} application.</p>
          <p className="mt-2 text-gray-400">
            App functionality will be implemented here.
          </p>
        </div>
      </div>
    );
  }

  if (node.type === "link") {
    return (
      <div className="p-4 text-center">
        <div className="mb-4">
          <img
            src={node.image}
            alt={node.label}
            className="w-16 h-16 mx-auto mb-2"
          />
          <h2 className="text-lg font-semibold text-gray-100">{node.label}</h2>
        </div>
        <div className="text-gray-300 text-sm">
          <p>This link opens in a new browser tab:</p>
          <a
            href={node.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline mt-2 block break-all"
          >
            {node.url}
          </a>
        </div>
      </div>
    );
  }
};
