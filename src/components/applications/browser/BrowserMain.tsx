import { useEffect, useRef, useState } from "react";

import { StartPage } from "./fake_pages/StartPage";
import { IncompletePage } from "./fake_pages/IncompletePage";
import { useNewStore } from "@/hooks/useStore";
import { WindowHistoryNavigation } from "@/components/window/windowNavigation/WindowHistoryNavigation";
import { BrowserAddressBar } from "./BrowserAddressBar";
import { BrowserBookmarks, type BrowserBookmarksRef } from "./BrowserBookmarks";
import { BrowserDownload } from "./BrowserDownload";
import {
  PREDEFINED_ADDRESS,
  WEB_PAGE_REGISTRY,
  type BookmarkItem,
} from "./browserConstants";
import { useScreenMonitor } from "@/hooks/useScreenSize";
import type { WindowId } from "@/constants/applicationRegistry";
import type { WindowContentProps } from "@/types/storeTypes";
import { theme } from "@/styles/theme";

// TODO: when we click on 'search' we should focus on the search bar

interface BrowserCallbacks {
  focusAddressBar: () => void;
  openBookmarks: () => void;
}

const renderContent = (addressBarUrl: string, callbacks?: BrowserCallbacks) => {
  if (addressBarUrl === "" || addressBarUrl === undefined) {
    return (
      <StartPage
        onFocusAddressBar={callbacks?.focusAddressBar}
        onOpenBookmarks={callbacks?.openBookmarks}
      />
    );
  }

  const page = WEB_PAGE_REGISTRY[addressBarUrl];
  if (page) {
    const PageComponent = page;
    return <PageComponent />;
  }

  return <IncompletePage url={addressBarUrl} />;
};

export const BrowserContent = ({ windowId }: WindowContentProps) => {
  const themeMode = useNewStore((s) => s.theme);
  const textColor = theme.colors[themeMode].text.primary;
  const bgColor = theme.colors[themeMode].background.secondary;
  // Type-safe cast for internal use - we know this is a browser window
  const typedWindowId = windowId as WindowId<"browser">;

  const screenSize = useScreenMonitor();
  const predefinedAddress = PREDEFINED_ADDRESS;
  const initialUrl = "";
  const [addressBarUrl, setAddressBarUrl] = useState(initialUrl);
  // const [addressViewed, setAddressViewed] = useState("www.banking.com");
  const [addressViewed, setAddressViewed] = useState(initialUrl);

  // Refs for browser components
  const addressBarRef = useRef<HTMLInputElement>(null);
  const bookmarksRef = useRef<BrowserBookmarksRef>(null);

  // const precicate = (window: WindowType) => window.windowId === windowId;
  // const window = useNewStore((state) => state.findOneWindow(precicate))!;
  const addToHistory = useNewStore((state) => state.addToHistory);
  const websitesVisited = useNewStore((state) => state.websitesVisited);
  const addToWebsitesVisited = useNewStore(
    (state) => state.addToWebsitesVisited
  );

  const handleWebsiteViewedAchievement = (addressViewed: string) => {
    if (
      !websitesVisited.includes(
        addressViewed as keyof typeof WEB_PAGE_REGISTRY
      ) &&
      WEB_PAGE_REGISTRY[addressViewed as keyof typeof WEB_PAGE_REGISTRY]
    ) {
      addToWebsitesVisited(addressViewed as keyof typeof WEB_PAGE_REGISTRY);
    }
  };

  const contentRef = useRef<HTMLDivElement>(null);

  // Simple scroll to top when page changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [addressViewed]);

  // Callback functions for StartPage
  const handleFocusAddressBar = () => {
    if (addressBarRef.current) {
      addressBarRef.current.focus();
    }
  };

  const handleOpenBookmarks = () => {
    if (bookmarksRef.current) {
      bookmarksRef.current.openDropdown();
    }
  };

  const browserCallbacks: BrowserCallbacks = {
    focusAddressBar: handleFocusAddressBar,
    openBookmarks: handleOpenBookmarks,
  };

  // Mobile: Navigation at bottom, Desktop: Navigation at top

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const typedCharCount = inputValue.length;

    // Update URL based on typed character count
    if (typedCharCount <= predefinedAddress.length) {
      const newUrl = predefinedAddress.substring(0, typedCharCount);
      setAddressBarUrl(newUrl);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const newAddress = e.currentTarget.value;
      setAddressViewed(newAddress);
      addToHistory(typedWindowId, newAddress);
      handleWebsiteViewedAchievement(newAddress);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    console.log("BROWSER_DEBUG handleClick", e.currentTarget.value);
  };

  const handleHistoryChange = (currentItem: unknown) => {
    if (typeof currentItem === "string") {
      handleWebsiteViewedAchievement(currentItem);
      setAddressViewed(currentItem);
      setAddressBarUrl(currentItem);
    }
  };

  const handleBookmarkSelect = (bookmark: BookmarkItem) => {
    setAddressBarUrl(bookmark.url);
    setAddressViewed(bookmark.url);
    addToHistory(typedWindowId, bookmark.url);
    handleWebsiteViewedAchievement(bookmark.url);
  };

  const isMobile = screenSize.isXs || screenSize.isSm;

  // Desktop: Navigation at top (original layout)
  return (
    <div
      className={`h-full flex flex-col ${
        isMobile ? "flex-col-reverse" : "flex-col"
      }`}
      style={{
        color: textColor,
        backgroundColor: bgColor,
      }}
    >
      <div className="flex-none sticky top-0 bg-neutral-300 z-10 flex items-center gap-4 py-4 px-2">
        {/* <h1 className="text-2xl font-bold text-black">TEMP</h1> */}
        <WindowHistoryNavigation
          windowId={typedWindowId}
          firstHistoryItem={initialUrl}
          showForwardButton={!isMobile}
          showBackButton={true}
          onHistoryChange={handleHistoryChange}
        />
        <BrowserAddressBar
          ref={addressBarRef}
          value={addressBarUrl}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
        />
        <BrowserBookmarks
          ref={bookmarksRef}
          onBookmarkSelect={handleBookmarkSelect}
          windowId={typedWindowId}
          isMobile={isMobile}
        />
        {!isMobile && <BrowserDownload />}
      </div>

      <div
        ref={contentRef}
        className="flex-1 overflow-auto flex flex-col items-start justify-start"
      >
        {renderContent(addressViewed, browserCallbacks)}
      </div>
    </div>
  );
};
