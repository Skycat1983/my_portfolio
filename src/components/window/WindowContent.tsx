import { useStore } from "../../hooks/useStore";
import { DirectoryLayout } from "../DirectoryLayout";

interface WindowContentProps {
  nodeId: string; // Original window nodeId
}

export const WindowContent = ({ nodeId }: WindowContentProps) => {
  const {
    getNode,
    getChildren,
    selectedNodeId,
    selectNode,
    openWindow,
    getWindowByNodeId,
    navigateInWindow,
    canGoBack,
    goBack,
    getParent,
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

  const handleBackClick = () => {
    console.log(
      "handleBackClick in WindowContent: going back in window",
      nodeId
    );
    goBack(nodeId);
  };

  // Check if back button should be enabled (parent is not root)
  const parent = getParent(currentNodeId);
  const { rootId } = useStore.getState();
  const canShowBack = canGoBack(nodeId) && parent && parent.id !== rootId;

  // If it's a directory, show navigation and its children using DirectoryLayout
  if (node.type === "directory") {
    const children = getChildren(currentNodeId);

    return (
      <div className="h-full flex flex-col">
        {/* Simple Navigation Bar */}
        <div className="flex items-center gap-2 p-2 border-b border-gray-600 bg-gray-800">
          {/* Back button */}
          <button
            onClick={handleBackClick}
            disabled={!canShowBack}
            className={`px-3 py-1 text-sm rounded ${
              canShowBack
                ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
          >
            ← Back
          </button>

          {/* Current folder name */}
          <span className="text-gray-300 ml-2 font-medium">{node.label}</span>
        </div>

        {/* Directory Content */}
        <div className="flex-1 overflow-auto">
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
