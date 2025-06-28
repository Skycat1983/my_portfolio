import React from "react";
import { useNewStore } from "../../hooks/useStore";
import type { LinkEntry } from "../../types/nodeTypes";
import type { WindowedNode } from "../../store/windowState/windowOperationsSlice";
import {
  SAFARI,
  EDGE,
  TERMINAL,
  TROPHY1,
  GTA6_LOGO,
  PLANET,
  BIN_EMPTY,
} from "../../constants/images";
import { Mail, Phone } from "lucide-react";

interface DockItemData {
  id: string;
  label: string;
  image?: string;
  icon?: React.ReactNode;
  nodeId?: string; // For nodes that exist in the node map
  onClick?: () => void; // For custom actions like email
}

interface DockItemProps {
  item: DockItemData;
  onItemClick: (item: DockItemData) => void;
}

const DockItem: React.FC<DockItemProps> = ({ item, onItemClick }) => {
  const handleClick = () => {
    console.log("DockItem click in Dock: clicking dock item", item.id);
    onItemClick(item);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className="dock-item group relative flex items-center justify-center cursor-pointer transition-all duration-200 ease-out hover:scale-110 hover:-translate-y-2"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Open ${item.label}`}
    >
      {/* Dock Item Background */}
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/10 shadow-lg flex items-center justify-center overflow-hidden group-hover:shadow-xl group-hover:border-white/20 transition-all duration-200">
        {item.image ? (
          <img
            src={item.image}
            alt={item.label}
            className="w-10 h-10 object-contain"
            draggable={false}
          />
        ) : item.icon ? (
          <div className="w-10 h-10 flex items-center justify-center text-white">
            {item.icon}
          </div>
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
            {item.label.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Tooltip */}
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900/90 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none backdrop-blur-sm">
        {item.label}
      </div>

      {/* Hover indicator dot */}
      <div className="absolute -bottom-2 w-1 h-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
    </div>
  );
};

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

  // Hardcoded dock items with proper images
  const dockItems: DockItemData[] = [
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
      onClick: () => window.open("mailto:", "_blank"),
    },
    {
      id: "terminal",
      label: "Terminal",
      image: TERMINAL,
      nodeId: "terminal",
    },
    {
      id: "achievements",
      label: "Achievements",
      image: TROPHY1,
      nodeId: "achievements",
    },
    {
      id: "gtavi",
      label: "GTAVI",
      image: GTA6_LOGO,
      nodeId: "gtaiv",
    },
    {
      id: "geo-game",
      label: "Flag Quest",
      image: PLANET,
      nodeId: "geo",
    },
    {
      id: "trash",
      label: "Trash",
      image: BIN_EMPTY, // Could dynamically switch to BIN_FULL if trash has items
      nodeId: "trash",
    },
  ];

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
      onClick: () => window.open("mailto:", "_blank"),
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
      if (node.type === "browser") {
        const startPageUrl = "";
        openWindow(node as WindowedNode, startPageUrl);
      } else if (node.type === "terminal") {
        openWindow(node as WindowedNode, node.id);
      } else if (node.type === "achievement") {
        // Reset the notification counter when achievement is opened
        if (unseenAchievements > 0) {
          markAchievementsAsSeen();
        }
        unlockAccessAchievements();
        openWindow(node as WindowedNode, node.id);
      } else if (node.type === "game") {
        openWindow(node as WindowedNode, node.label);
      } else if (node.type === "directory") {
        openWindow(node as WindowedNode, node.label);
      } else if (node.type !== "icon") {
        // For any other windowed nodes
        const windowedNode = node as WindowedNode;
        openWindow(windowedNode, node.label);
      }
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      {/* Dock Background */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-3">
        <div className="hidden sm:flex items-center space-x-2">
          {dockItems.map((item) => (
            <DockItem key={item.id} item={item} onItemClick={handleItemClick} />
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
