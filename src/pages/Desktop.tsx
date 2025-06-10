import { MenubarLayout } from "../components/menubar/MenubarLayout";
import { DirectoryLayout } from "../components/DirectoryLayout";
import { useStore } from "../hooks/useStore";
import { useNodeDrag } from "../hooks/useNodeDrag";
import Window from "../components/window/Window";

export const Desktop = () => {
  const {
    rootId,
    getChildren,
    selectedNodeId,
    selectNode,
    openWindow,
    openWindows,
    isDirectChildOfRoot,
    getNode,
  } = useStore();

  // Initialize drag and drop functionality
  const dragHandlers = useNodeDrag();

  const desktopChildren = getChildren(rootId);

  const handleNodeDoubleClick = (nodeId: string) => {
    console.log(
      "handleNodeDoubleClick in Desktop: Double-clicked nodeId",
      nodeId
    );

    const node = getNode(nodeId);
    if (!node) return;

    // Handle links - open URL in new tab
    if (node.type === "link") {
      console.log("handleNodeDoubleClick in Desktop: Opening link", node.url);
      window.open(node.url, "_blank");
      return;
    }

    // Always open apps in new windows
    if (node.type === "app") {
      openWindow(nodeId);
      return;
    }

    // For directories: only open new window if it's a direct child of root (desktop)
    if (node.type === "directory" && isDirectChildOfRoot(nodeId)) {
      openWindow(nodeId);
    }

    // Note: We don't handle non-root directories here since they're not on desktop
  };

  return (
    <div className="w-screen h-screen bg-gray-900 relative overflow-hidden background-image">
      <MenubarLayout />
      <div className="p-10 h-full">
        {/* Render all open windows */}
        {openWindows.map((windowState) => (
          <Window
            key={windowState.id}
            nodeId={windowState.id}
            zIndex={windowState.zIndex}
            isMinimized={windowState.isMinimized}
          />
        ))}

        <DirectoryLayout
          nodes={desktopChildren}
          selectedNodeId={selectedNodeId}
          onSelectNode={selectNode}
          onDoubleClickNode={handleNodeDoubleClick}
          layout="desktop"
          dragHandlers={dragHandlers}
        />
      </div>
    </div>
  );
};
