import { useStore } from "../../hooks/useStore";
import { DirectoryLayout } from "../DirectoryLayout";

// Define the drag handlers type (same as in other components)
interface DragHandlers {
  handleDragStart: (e: React.DragEvent, nodeId: string) => void;
  handleDragEnd: () => void;
  handleDragOver: (e: React.DragEvent, targetNodeId?: string) => void;
  handleDragEnter: (e: React.DragEvent, targetNodeId: string) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, targetNodeId: string) => void;
  currentDropTarget: string | null;
  isValidDropTarget: () => boolean;
  isDropTarget: (nodeId: string) => boolean;
}

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
    openWindow,
    getWindowByNodeId,
    navigateInWindow,
  } = useStore();

  // Get the window state to see what we're currently viewing
  const windowState = getWindowByNodeId(nodeId);
  const currentNodeId = windowState?.currentNodeId || nodeId;
  const node = getNode(currentNodeId);

  if (!node) {
    return <div className="text-gray-400 text-center p-4">Node not found</div>;
  }

  const handleNodeDoubleClick = (targetNodeId: string) => {
    console.log(
      "handleNodeDoubleClick in WindowContent: Double-clicked targetNodeId",
      targetNodeId
    );

    const targetNode = getNode(targetNodeId);
    if (!targetNode) return;

    // Handle links - open URL in new tab
    if (targetNode.type === "link") {
      console.log(
        "handleNodeDoubleClick in WindowContent: Opening link",
        targetNode.url
      );
      window.open(targetNode.url, "_blank");
      return;
    }

    // Always open apps in new windows
    if (targetNode.type === "app") {
      openWindow(targetNodeId);
      return;
    }

    // For directories: always navigate within current window
    if (targetNode.type === "directory") {
      navigateInWindow(nodeId, targetNodeId);
    }
  };

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

  // If it's an app, show app-specific content
  if (node.type === "app") {
    return (
      <div className="p-4">
        <div className="text-center mb-4">
          <img
            src={node.image}
            alt={node.label}
            className="w-16 h-16 mx-auto mb-2"
          />
          <h2 className="text-lg font-semibold text-gray-100">{node.label}</h2>
        </div>
        <div className="text-gray-300 text-sm">
          {/* App-specific content would go here */}
          <p>This is the {node.label} application.</p>
          <p className="mt-2 text-gray-400">
            App functionality will be implemented here.
          </p>
        </div>
      </div>
    );
  }

  // If it's a link, show link-specific content
  if (node.type === "link") {
    return (
      <div className="p-4">
        <div className="text-center mb-4">
          <img
            src={node.image}
            alt={node.label}
            className="w-16 h-16 mx-auto mb-2"
          />
          <h2 className="text-lg font-semibold text-gray-100">{node.label}</h2>
        </div>
        <div className="text-gray-300 text-sm">
          <p>This is a link to:</p>
          <a
            href={node.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline mt-2 block break-all"
          >
            {node.url}
          </a>
          <button
            onClick={() => window.open(node.url, "_blank")}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
          >
            Open Link
          </button>
        </div>
      </div>
    );
  }

  return <div className="text-gray-400 text-center p-4">Unknown node type</div>;
};
