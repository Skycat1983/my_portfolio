import { ChevronLeft, ChevronRight, RotateCcw, Shield } from "lucide-react";
import { cn } from "../../../lib/utils";
import { browserButtonStyles, urlInputStyle } from "./BrowserFrame.styles";
import { useWindowHistory } from "../../window/hooks/useWindowHistory";
import { useNewStore } from "../../../hooks/useStore";
import { PREDEFINED_ADDRESS } from "../../../constants/urls";

interface BrowserNavigationProps {
  windowId: string;
}

export const BrowserNavigation = ({ windowId }: BrowserNavigationProps) => {
  const predefinedAddress = PREDEFINED_ADDRESS;

  // Use new generic history system
  const browserWindow = useNewStore((s) => s.getWindowById(windowId))!;
  const updateWindowById = useNewStore((s) => s.updateWindowById);
  const urlHistory = browserWindow.itemHistory;
  const i = browserWindow.currentHistoryIndex;

  // const urlHistoryIndex = browserWindow.currentHistoryIndex;

  // Get URL from store instead of local state
  const url = browserWindow.url || "";
  const addressPosition = url?.length ?? 0;

  const {
    canGoBackInWindowHistory,
    canGoForwardInWindowHistory,
    handleGoBackInWindowHistory,
    handleGoForwardInWindowHistory,
  } = useWindowHistory(windowId);

  const handleBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (canGoBackInWindowHistory(windowId)) {
      handleGoBackInWindowHistory();

      if (urlHistory[i]) {
        updateWindowById(windowId, { url: urlHistory[i - 1] });
      }
    }
  };

  const handleForward = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (canGoForwardInWindowHistory(windowId)) {
      handleGoForwardInWindowHistory();
      // Get the URL from the current history position after navigation
      const getLocationInHistory = useNewStore.getState().getLocationInHistory;
      const urlAtCurrentPosition = getLocationInHistory(windowId);
      if (urlAtCurrentPosition) {
        updateWindowById(windowId, { url: urlAtCurrentPosition });
      }
    }
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
      updateWindowById(windowId, { url: newUrl });
    }
  };

  const handleNavigateToUrl = () => {
    // If URL is empty, don't add to history
    if (addressPosition === 0 || url === "") {
      return;
    }

    // Add current URL to history and navigate to it
    updateWindowById(windowId, {
      itemHistory: [...urlHistory, url],
      currentHistoryIndex: urlHistory.length,
    });
  };

  const handleUrlKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleNavigateToUrl();
      e.preventDefault();
      return;
    }

    // Prevent typing beyond predefined address length
    if (e.key.length === 1 && addressPosition >= predefinedAddress.length) {
      e.preventDefault();
    }
  };

  const addressBarStyle: React.CSSProperties = {
    height: "50px",
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    gap: "8px",
    background: "linear-gradient(to bottom, #f9fafb, #f3f4f6)",
    borderBottom: "1px solid #e5e7eb",
  };

  return (
    <div style={addressBarStyle}>
      <button
        style={browserButtonStyles}
        title="Back"
        onClick={handleBack}
        disabled={!canGoBackInWindowHistory(windowId)}
        className={cn(
          "hover:bg-gray-200 transition-colors",
          !canGoBackInWindowHistory(windowId) && "opacity-50 cursor-not-allowed"
        )}
      >
        <ChevronLeft size={14} />
      </button>

      <button
        style={browserButtonStyles}
        title="Forward"
        onClick={handleForward}
        disabled={!canGoForwardInWindowHistory(windowId)}
        className={cn(
          "hover:bg-gray-200 transition-colors",
          !canGoForwardInWindowHistory(windowId) &&
            "opacity-50 cursor-not-allowed"
        )}
      >
        <ChevronRight size={14} />
      </button>

      <button
        style={browserButtonStyles}
        title="Refresh"
        //  onClick={handleRefreshClick}
        className="hover:bg-gray-200 transition-colors"
      >
        <RotateCcw size={14} />
      </button>

      <div className="flex items-center flex-1 relative">
        <Shield size={14} className="absolute left-3 text-green-500" />
        <input
          type="text"
          value={url}
          onChange={handleUrlChange}
          onKeyDown={handleUrlKeyDown}
          onClick={handleUrlClick}
          onPointerDown={(e) => e.stopPropagation()}
          style={urlInputStyle}
          className="pl-8"
          placeholder="Start typing to visit the site…"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
};
