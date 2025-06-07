import { MenubarLayout } from "../components/menubar/MenubarLayout";
import { DirectoryLayout } from "../components/DirectoryLayout";
import { useStore } from "../hooks/useStore";

export const Desktop = () => {
  // Get what we need from the store
  const {
    rootId,
    getChildren,
    selectedNodeId,
    selectNode,
    debugGetObjectTree,
  } = useStore();

  const desktopChildren = getChildren(rootId);
  console.log("Desktop children (actual nodes):", desktopChildren);

  // Test reverse conversion
  console.log("Testing reverse conversion (map → object):");
  debugGetObjectTree();

  const handleNodeDoubleClick = (nodeId: string) => {
    console.log("Desktop: Double-clicked node", nodeId);
    // TODO: Open window for directories, launch apps
  };

  return (
    <div className="w-screen h-screen bg-gray-900 relative overflow-hidden">
      <MenubarLayout />
      <div className="p-10 h-full">
        <DirectoryLayout
          nodes={desktopChildren}
          selectedNodeId={selectedNodeId}
          onSelectNode={selectNode}
          onDoubleClickNode={handleNodeDoubleClick}
          layout="desktop"
        />
      </div>
    </div>
  );
};
