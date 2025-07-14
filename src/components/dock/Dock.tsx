import React from "react";
import { useNewStore } from "@/hooks/useStore";

// Context-aware dock root ID is now obtained from store methods
import { NodeSwitch } from "../nodes/NodeSwitch";

export interface DockItemData {
  id: string;
  label: string;
  image?: string;
  icon?: React.ReactNode;
  nodeId?: string; // For nodes that exist in the node map
  onClick?: () => void; // For custom actions like email
}

const Dock: React.FC = () => {
  const operatingSystem = useNewStore((state) => state.operatingSystem);
  const getChildrenByParentID = useNewStore(
    (state) => state.getChildrenByParentID
  );
  const getCurrentRootId = useNewStore((state) => state.getCurrentRootId);

  if (operatingSystem === "windows") {
    return null;
  }

  const currentDockRootId = getCurrentRootId("dock");
  const dockNodes = getChildrenByParentID(currentDockRootId);

  console.log("dockNodes", dockNodes);

  const nodeDiameter = 16;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      {/* Dock Background */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-3">
        <div className="flex items-center space-x-2">
          {dockNodes.map((item) => (
            <div
              key={item.id}
              className={`w-${nodeDiameter} h-${nodeDiameter}`}
            >
              <NodeSwitch
                node={item}
                windowId={currentDockRootId}
                view="icons"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dock;
