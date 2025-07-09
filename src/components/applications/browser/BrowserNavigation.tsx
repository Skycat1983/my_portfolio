import { ChevronLeft, ChevronRight, RotateCcw, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { browserButtonStyles, urlInputStyle } from "./BrowserFrame.styles";
import { useBrowserHistory } from "./hooks/useBrowserHistory";
import { useNewStore } from "@/hooks/useStore";
import { PREDEFINED_ADDRESS } from "@/constants/urls";
import type { WindowType } from "@/types/storeTypes";

interface BrowserNavigationProps {
  windowId: WindowType["windowId"];
  addressBarUrl: string;
  setAddressBarUrl: (url: string) => void;
}

export const BrowserNavigation = ({
  windowId,
  addressBarUrl,
  setAddressBarUrl,
}: BrowserNavigationProps) => {
  const predefinedAddress = PREDEFINED_ADDRESS;

  const screenDimensions = useNewStore((s) => s.screenDimensions);
  const browserHistory = useBrowserHistory(windowId, addressBarUrl);

  console.log("BrowserNavigation: browserHistory", browserHistory);

  const handleBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    browserHistory.goBack();
  };

  const handleForward = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    browserHistory.goForward();
  };

  const handleUrlClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.currentTarget.focus();
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const typedCharCount = inputValue.length;

    // Update URL based on typed character count
    if (typedCharCount <= predefinedAddress.length) {
      const newUrl = predefinedAddress.substring(0, typedCharCount);
      setAddressBarUrl(newUrl);
      // updateWindowById(windowId, { url: newUrl });
    }
  };

  const handleNavigateToUrl = () => {
    // If URL is empty, don't add to history
    if (browserHistory.currentIndex === 0 || addressBarUrl === "") {
      return;
    }

    // Add current URL to history using new browser history
    browserHistory.navigateToUrl(addressBarUrl);
  };

  const handleUrlKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleNavigateToUrl();
      e.preventDefault();
      return;
    }

    // Prevent typing beyond predefined address length
    if (
      e.key.length === 1 &&
      browserHistory.currentIndex >= predefinedAddress.length
    ) {
      e.preventDefault();
    }
  };

  // Mobile-specific styles
  const addressBarStyle: React.CSSProperties = {
    height: screenDimensions.isMobile ? "60px" : "50px",
    display: "flex",
    alignItems: "center",
    padding: screenDimensions.isMobile ? "0 16px" : "0 12px",
    gap: screenDimensions.isMobile ? "12px" : "8px",
    background: "linear-gradient(to bottom, #f9fafb, #f3f4f6)",
    borderBottom: "1px solid #e5e7eb",
  };

  // Mobile-friendly button styles
  const mobileButtonStyles = screenDimensions.isMobile
    ? {
        ...browserButtonStyles,
        width: "44px",
        height: "44px",
        borderRadius: "8px",
      }
    : browserButtonStyles;

  // Mobile-friendly input styles
  const mobileInputStyle = screenDimensions.isMobile
    ? {
        ...urlInputStyle,
        height: "44px",
        fontSize: "16px", // Prevents zoom on iOS
        borderRadius: "8px",
      }
    : urlInputStyle;

  return (
    <div style={addressBarStyle}>
      <button
        style={mobileButtonStyles}
        title="Back"
        onClick={handleBack}
        disabled={!browserHistory.canGoBack}
        className={cn(
          "hover:bg-gray-200 transition-colors touch-manipulation",
          !browserHistory.canGoBack && "opacity-50 cursor-not-allowed"
        )}
      >
        <ChevronLeft size={screenDimensions.isMobile ? 20 : 14} />
      </button>

      <button
        style={mobileButtonStyles}
        title="Forward"
        onClick={handleForward}
        disabled={!browserHistory.canGoForward}
        className={cn(
          "hover:bg-gray-200 transition-colors touch-manipulation",
          !browserHistory.canGoForward && "opacity-50 cursor-not-allowed"
        )}
      >
        <ChevronRight size={screenDimensions.isMobile ? 20 : 14} />
      </button>

      {/* Hide refresh button on mobile to save space */}
      {!screenDimensions.isMobile && (
        <button
          style={mobileButtonStyles}
          title="Refresh"
          //  onClick={handleRefreshClick}
          className="hover:bg-gray-200 transition-colors touch-manipulation"
        >
          <RotateCcw size={screenDimensions.isMobile ? 20 : 14} />
        </button>
      )}

      <div className="flex items-center flex-1 relative">
        <Shield
          size={screenDimensions.isMobile ? 18 : 14}
          className="absolute left-3 text-green-500"
        />
        <input
          type="text"
          value={addressBarUrl}
          onChange={handleUrlChange}
          onKeyDown={handleUrlKeyDown}
          onClick={handleUrlClick}
          onPointerDown={(e) => e.stopPropagation()}
          style={mobileInputStyle}
          className={cn(
            screenDimensions.isMobile ? "pl-10" : "pl-8",
            "w-full touch-manipulation"
          )}
          placeholder="Start typing to visit the site…"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
};
