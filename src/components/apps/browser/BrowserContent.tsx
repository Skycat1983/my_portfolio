import { useState } from "react";
import { Bookmark, Settings } from "lucide-react";
import { useNewStore } from "../../../hooks/useStore";
import { StartPage } from "./fake_pages/StartPage";
import { IncompletePage } from "./fake_pages/IncompletePage";
import { QueuePage } from "./fake_pages/QueuePage";
import { BrowserNavigation } from "./BrowserNavigation";
import { OfflinePage } from "./fake_pages/OfflinePage";

interface BrowserContentProps {
  windowId: string;
}

export const BrowserContent = ({ windowId }: BrowserContentProps) => {
  const [bookmarked, setBookmarked] = useState(false);

  const window = useNewStore((s) => s.getWindowById(windowId));
  const currentPage = window?.itemHistory[window?.currentHistoryIndex];

  // Get window-specific browser state
  // const { currentPage } = useBrowserWindowContent(windowId);
  const wifiEnabled = useNewStore((s) => s.wifiEnabled);

  const handleBookmarkToggle = () => {
    setBookmarked(!bookmarked);
  };

  // Render different pages based on currentPage state
  const renderPageContent = () => {
    if (!wifiEnabled) {
      return <OfflinePage />;
    }
    switch (currentPage) {
      case "":
        return <StartPage />;
      case "www.how-is-he-still-unemployed.com":
        return <QueuePage />;
      default:
        return <IncompletePage windowId={windowId} />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Browser Navigation/Address Bar */}
      <BrowserNavigation windowId={windowId} />

      {/* Page content area */}
      <div className="flex-1 overflow-auto p-6">{renderPageContent()}</div>

      {/* Bottom toolbar */}
      <div className="h-10 bg-gray-100 border-t border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>
            {currentPage === "start" && "Ready to browse"}
            {currentPage === "incomplete" && "URL incomplete"}
            {currentPage === "complete" && "Queue processing"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBookmarkToggle}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleBookmarkToggle();
              }
            }}
          >
            <Bookmark
              size={14}
              className={
                bookmarked ? "text-yellow-500 fill-current" : "text-gray-500"
              }
            />
          </button>
          <button
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            aria-label="Settings"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                console.log("Settings clicked");
              }
            }}
          >
            <Settings size={14} className="text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};
