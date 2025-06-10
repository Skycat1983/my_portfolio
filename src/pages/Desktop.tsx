import { MenubarLayout } from "../components/menubar/MenubarLayout";
import { DirectoryLayout } from "../components/DirectoryLayout";
import { useStore } from "../hooks/useStore";
import { useNodeDrag } from "../hooks/useNodeDrag";
import { useNodeDoubleClick } from "../hooks/useNodeDoubleClick";
import Window from "../components/window/Window";

export const Desktop = () => {
  const { rootId, getChildren, selectedNodeId, selectNode, openWindows } =
    useStore();

  // Initialize drag and drop functionality
  const dragHandlers = useNodeDrag();

  // Initialize shared double-click functionality
  const { handleNodeDoubleClick } = useNodeDoubleClick({ context: "desktop" });

  const desktopChildren = getChildren(rootId);

  return (
    <div className="w-screen h-screen bg-gray-900 relative overflow-hidden background-image">
      <MenubarLayout />
      <div
        className="p-10 h-full"
        // Make desktop a drop target for moving items back to desktop
        onDragOver={
          dragHandlers
            ? (e) => dragHandlers.handleDragOver(e, rootId)
            : undefined
        }
        onDragEnter={
          dragHandlers
            ? (e) => dragHandlers.handleDragEnter(e, rootId)
            : undefined
        }
        onDragLeave={dragHandlers?.handleDragLeave}
        onDrop={
          dragHandlers ? (e) => dragHandlers.handleDrop(e, rootId) : undefined
        }
      >
        {/* Render all open windows */}
        {openWindows.map((windowState) => (
          <Window
            key={windowState.id}
            nodeId={windowState.id}
            zIndex={windowState.zIndex}
            dragHandlers={dragHandlers}
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
