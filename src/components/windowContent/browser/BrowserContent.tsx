import { useState } from "react";
import { Bookmark, Settings } from "lucide-react";
import { useNewStore } from "../../../hooks/useStore";
import { StartPage } from "./fake_pages/StartPage";
import { IncompletePage } from "./fake_pages/IncompletePage";
import { QueuePage } from "./fake_pages/QueuePage";
import { BrowserNavigation } from "./BrowserNavigation";
import { OfflinePage } from "./fake_pages/offlinePage";

export const BrowserContent = () => {
  console.log("BrowserContent");
  const [bookmarked, setBookmarked] = useState(false);

  // Get current page state from browser slice
  // const { currentPage } = useNewStore();
  const currentPage = useNewStore((s) => s.currentPage);
  const wifiEnabled = useNewStore((s) => s.wifiEnabled);

  const handleBookmarkToggle = () => {
    console.log("handleBookmarkToggle in BrowserContent: toggling bookmark");
    setBookmarked(!bookmarked);
  };

  // Render different pages based on currentPage state
  const renderPageContent = () => {
    if (!wifiEnabled) {
      return <OfflinePage />;
    }
    switch (currentPage) {
      case "incomplete":
        return <IncompletePage />;
      case "complete":
        return <QueuePage />;
      default:
        return <StartPage />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Browser Navigation/Address Bar */}
      <BrowserNavigation />

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
