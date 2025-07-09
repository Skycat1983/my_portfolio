import { useEffect, useRef, useState } from "react";

import { StartPage } from "./fake_pages/StartPage";
import { IncompletePage } from "./fake_pages/IncompletePage";
import { QueuePage } from "./fake_pages/QueuePage";
import type { WindowType } from "@/types/storeTypes";
import { useNewStore } from "@/hooks/useStore";
import { WindowHistoryNavigation } from "@/components/window/windowNavigation/WindowHistoryNavigation";
import { BrowserAddressBar } from "./BrowserAddressBar";
import { BrowserBookmarks } from "./BrowserBookmarks";
import { BrowserDownload } from "./BrowserDownload";
import { PREDEFINED_ADDRESS } from "@/constants/urls";

// TODO: when we click on 'search' we should focus on the search bar

const WEB_PAGE_REGISTRY: Record<string, React.ComponentType> = {
  "www.how-is-he-still-unemployed.com": QueuePage,
};

const renderContent = (addressBarUrl: string) => {
  console.log("BROWSER_DEBUG renderContent", addressBarUrl);
  if (addressBarUrl === "" || addressBarUrl === undefined) {
    return <StartPage />;
  }

  const page = WEB_PAGE_REGISTRY[addressBarUrl];
  if (page) {
    const PageComponent = page;
    return <PageComponent />;
  }

  return <IncompletePage url={addressBarUrl} />;
};

interface BrowserContentProps {
  windowId: WindowType["windowId"];
}

export const BrowserContent = ({ windowId }: BrowserContentProps) => {
  const predefinedAddress = PREDEFINED_ADDRESS;
  const initialUrl = "";
  const [addressBarUrl, setAddressBarUrl] = useState(initialUrl);
  const [addressViewed, setAddressViewed] = useState(initialUrl);
  const precicate = (window: WindowType) => window.windowId === windowId;
  const window = useNewStore((state) => state.findOneWindow(precicate))!;
  console.log("BROWSER_DEBUG window", window);
  const addToHistory = useNewStore((state) => state.addToHistory);

  const contentRef = useRef<HTMLDivElement>(null);

  // Simple scroll to top when page changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [addressViewed]);

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
      console.log("BROWSER_DEBUG handleKeyDown", e.currentTarget.value);
      setAddressViewed(e.currentTarget.value);
      addToHistory(windowId, e.currentTarget.value);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    console.log("BROWSER_DEBUG handleClick", e.currentTarget.value);
  };

  const handleHistoryChange = (currentItem: unknown, currentIndex: number) => {
    console.log("BROWSER_DEBUG handleHistoryChange", currentItem, currentIndex);
    if (typeof currentItem === "string") {
      setAddressViewed(currentItem);
      setAddressBarUrl(currentItem);
    }
  };

  // Desktop: Navigation at top (original layout)
  return (
    <div className="h-full flex flex-col">
      <div className="flex-none sticky top-0 bg-neutral-300 z-10 flex items-center gap-4 p-4">
        {/* <h1 className="text-2xl font-bold text-black">TEMP</h1> */}
        <WindowHistoryNavigation
          windowId={windowId}
          firstHistoryItem={initialUrl}
          showForwardButton={true}
          showBackButton={true}
          onHistoryChange={handleHistoryChange}
        />
        <BrowserAddressBar
          value={addressBarUrl}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
        />
        <BrowserBookmarks />
        <BrowserDownload />
      </div>

      <div ref={contentRef} className="flex-1 overflow-auto">
        {renderContent(addressViewed)}
      </div>
    </div>
  );
};
