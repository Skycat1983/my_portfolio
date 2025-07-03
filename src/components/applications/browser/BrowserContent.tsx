import { useState, useEffect, useRef } from "react";
import { Bookmark, Settings } from "lucide-react";
import { useNewStore } from "@/hooks/useStore";
import { StartPage } from "./fake_pages/StartPage";
import { IncompletePage } from "./fake_pages/IncompletePage";
import { QueuePage } from "./fake_pages/QueuePage";
import { BrowserNavigation } from "./BrowserNavigation";
import { OfflinePage } from "./fake_pages/OfflinePage";
import { theme } from "@/styles/theme";
import { Button } from "@/components/ui/button";
import { useBrowserHistory } from "./hooks/useBrowserHistory";

// TODO: when we click on 'search' we should focus on the search bar

export const BrowserContent = () => {
  const [bookmarked, setBookmarked] = useState(false);
  const [scrollPositions, setScrollPositions] = useState<
    Record<string, number>
  >({});
  const contentRef = useRef<HTMLDivElement>(null);

  const window = useNewStore((s) => s.getWindowByNodeId("browser"));
  const screenDimensions = useNewStore((s) => s.screenDimensions);
  const wifiEnabled = useNewStore((s) => s.wifiEnabled);

  // Use browser history to get current page URL
  const browserHistory = useBrowserHistory(window?.windowId || "");
  const currentPage = browserHistory.currentUrl || "";

  // Restore scroll position when page changes
  useEffect(() => {
    if (contentRef.current && currentPage) {
      const savedScrollPosition = scrollPositions[currentPage] || 0;
      contentRef.current.scrollTop = savedScrollPosition;
    }
  }, [currentPage, scrollPositions]);

  if (!window) {
    return null;
  }
  const { windowId } = window;

  const handleBookmarkToggle = () => {
    setBookmarked(!bookmarked);
  };

  // Track scroll position for current page
  const handleScroll = () => {
    if (contentRef.current && currentPage) {
      const scrollTop = contentRef.current.scrollTop;
      setScrollPositions((prev) => ({
        ...prev,
        [currentPage]: scrollTop,
      }));
    }
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

  // Theme-based styles for buttons
  const mobileToolbarButtonStyle = {
    padding: "8px",
    backgroundColor: theme.colors.white,
    border: `1px solid ${theme.colors.gray[300]}`,
    color: theme.colors.gray[700],
    borderRadius: "8px",
    transition: "all 0.2s ease",
    cursor: "pointer",
  };

  // Mobile: Navigation at bottom, Desktop: Navigation at top
  if (screenDimensions.isMobile) {
    return (
      <div className="h-full flex flex-col bg-white pt-10">
        {/* Page content area - takes full height minus navigation */}
        <div
          ref={contentRef}
          className="flex-1 overflow-auto p-4"
          onScroll={handleScroll}
        >
          {renderPageContent()}
        </div>

        {/* Mobile Navigation at Bottom */}
        <BrowserNavigation windowId={windowId} />

        {/* Mobile bottom toolbar - simplified */}
        <div
          className="h-12 border-t flex items-center justify-center px-4"
          style={{
            backgroundColor: theme.colors.gray[50],
            borderTopColor: theme.colors.gray[200],
          }}
        >
          <div className="flex items-center gap-4">
            <Button
              onClick={handleBookmarkToggle}
              style={mobileToolbarButtonStyle}
              className="touch-manipulation hover:bg-gray-100"
              aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              <Bookmark
                size={20}
                style={{
                  color: bookmarked
                    ? theme.colors.blue[500]
                    : theme.colors.gray[500],
                  fill: bookmarked ? theme.colors.blue[500] : "none",
                }}
              />
            </Button>
            <button
              style={mobileToolbarButtonStyle}
              className="touch-manipulation hover:bg-gray-100"
              aria-label="Settings"
            >
              <Settings size={20} style={{ color: theme.colors.gray[500] }} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop: Navigation at top (original layout)
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Browser Navigation/Address Bar */}
      <BrowserNavigation windowId={windowId} />

      {/* Page content area */}
      <div
        ref={contentRef}
        className="flex-1 overflow-auto p-6"
        onScroll={handleScroll}
      >
        {renderPageContent()}
      </div>

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
