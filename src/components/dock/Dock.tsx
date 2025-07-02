import React from "react";
import { useNewStore } from "../../hooks/useStore";
import type { LinkEntry } from "../../types/nodeTypes";
import type { WindowedNode } from "../../store/windowState/windowOperationsSlice";
import { SAFARI, EDGE } from "../../constants/images";
import { Mail, Phone } from "lucide-react";
import { dockRootId } from "../../constants/nodes";
import { NodeSwitch } from "../nodes/NodeSwitch";
import { DockItem } from "./DockItem";

export interface DockItemData {
  id: string;
  label: string;
  image?: string;
  icon?: React.ReactNode;
  nodeId?: string; // For nodes that exist in the node map
  onClick?: () => void; // For custom actions like email
}

const Dock: React.FC = () => {
  const openWindow = useNewStore((state) => state.openWindow);
  const getNodeByID = useNewStore((state) => state.getNodeByID);
  const getWindowByNodeId = useNewStore((state) => state.getWindowByNodeId);
  const focusWindow = useNewStore((state) => state.focusWindow);
  const operatingSystem = useNewStore((state) => state.operatingSystem);

  // Achievement-specific state for proper handling
  const unseenAchievements = useNewStore((state) => state.unseenAchievements);
  const markAchievementsAsSeen = useNewStore(
    (state) => state.markAchievementsAsSeen
  );
  const unlockAccessAchievements = useNewStore(
    (state) => state.unlockAccessAchievements
  );

  const getChildrenByParentID = useNewStore(
    (state) => state.getChildrenByParentID
  );

  if (operatingSystem === "windows") {
    return null;
  }

  const dockNodes = getChildrenByParentID(dockRootId);

  const mobileDockItems: DockItemData[] = [
    {
      id: "phone",
      label: "Phone",
      icon: <Phone size={32} className="text-green-400" />,
      nodeId: "phone",
    },
    {
      id: "browser",
      label: "Browser",
      image: operatingSystem === "mac" ? SAFARI : EDGE,
      nodeId: "browser",
    },
    {
      id: "email",
      label: "Email",
      icon: <Mail size={32} className="text-blue-400" />,
      onClick: () => {
        const email = "hlaoutaris@gmail.com";
        const subject = "When can you start?";
        const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
          subject
        )}`;

        window.location.href = mailtoLink;
      },
    },
  ];

  const handleItemClick = (item: DockItemData) => {
    console.log("handleItemClick in Dock: clicking item", item.id);

    // Handle custom actions (like email)
    if (item.onClick) {
      item.onClick();
      return;
    }

    // Handle node-based items
    if (item.nodeId) {
      const node = getNodeByID(item.nodeId);
      if (!node) {
        console.warn("Node not found:", item.nodeId);
        return;
      }

      // Check if window already exists for this node
      const existingWindow = getWindowByNodeId(item.nodeId);
      if (existingWindow) {
        focusWindow(existingWindow.windowId);
        return;
      }

      // Handle different node types
      if (node.type === "link") {
        // Open external links in new tab
        const linkNode = node as LinkEntry;
        window.open(linkNode.url, "_blank", "noopener,noreferrer");
        return;
      }

      // Handle specific node types with their proper starting values
      if (node.type === "application" && node.componentKey === "browser") {
        const startPageUrl = "";
        openWindow(node as WindowedNode, startPageUrl);
      } else if (
        node.type === "application" &&
        node.componentKey === "terminal"
      ) {
        openWindow(node as WindowedNode, node.id);
      } else if (
        node.type === "application" &&
        node.componentKey === "achievements"
      ) {
        // Reset the notification counter when achievement is opened
        if (unseenAchievements > 0) {
          markAchievementsAsSeen();
        }
        unlockAccessAchievements();
        openWindow(node as WindowedNode, node.id);
      } else if (node.type === "application") {
        openWindow(node as WindowedNode, node.label);
      } else if (node.type === "directory") {
        openWindow(node as WindowedNode, node.label);
      }
    }
  };

  const nodeDiameter = 16;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      {/* Dock Background */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-3">
        <div className="hidden sm:flex items-center space-x-2">
          {dockNodes.map((item) => (
            <div
              key={item.id}
              className={`w-${nodeDiameter} h-${nodeDiameter}`}
            >
              <NodeSwitch node={item} />
              {/* <DockItem key={item.id} item={item} onItemClick={handleItemClick} /> */}
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2 sm:hidden">
          {mobileDockItems.map((item) => (
            <DockItem key={item.id} item={item} onItemClick={handleItemClick} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dock;
