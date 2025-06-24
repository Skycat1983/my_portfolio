import { useNewStore } from "../../../hooks/useStore";
import type { BrowserWindow } from "../../../types/storeTypes";

// Local constant - no need for this to be in global state
const PREDEFINED_ADDRESS = "www.how-is-he-still-unemployed.com";

/**
 * Enhanced browser hook that combines window-specific state with browser functionality
 * @param windowId - The ID of the browser window
 */
export const useBrowserWindowContent = (
  windowId: BrowserWindow["windowId"]
) => {
  // Get window-specific state and operations
  const browserWindow = useNewStore((s) => s.getWindowById(windowId))!;
  const updateWindowById = useNewStore((s) => s.updateWindowById);

  // Use local constant instead of global state
  const predefinedAddress = PREDEFINED_ADDRESS;

  // Derive browser-specific state
  const url = browserWindow.url;
  const urlHistory = browserWindow.itemHistory;
  const urlHistoryIndex = browserWindow.currentHistoryIndex;
  const canGoBack = urlHistoryIndex > 0;
  const canGoForward = urlHistoryIndex < urlHistory.length - 1;

  // Calculate address position based on current URL and predefined address
  const addressPosition = url?.length ?? 0;

  // Get current URL from history if available (defined before usage)
  const getCurrentHistoryUrl = () => {
    if (
      urlHistory.length > 0 &&
      urlHistoryIndex >= 0 &&
      urlHistoryIndex < urlHistory.length
    ) {
      return urlHistory[urlHistoryIndex];
    }
    return "";
  };

  // Determine current page state based on URL
  const getCurrentPage = (): "start" | "incomplete" | "complete" => {
    // Use the navigated URL from history, not the current typing state
    const navigatedUrl = getCurrentHistoryUrl();

    if (!navigatedUrl || navigatedUrl.length === 0) {
      return "start";
    }
    if (navigatedUrl.length >= predefinedAddress.length) {
      return "complete";
    }
    return "incomplete";
  };

  const currentPage = getCurrentPage();

  // Browser-specific event handlers
  const handleUrlClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    console.log("handleUrlClick in useBrowserWindow: input clicked, focusing");
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

  const handleNavigateToUrl = () => {
    console.log("handleNavigateToUrl: navigating based on URL completeness");

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

  const handleBackClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("handleBackClick in useBrowserWindow: back button clicked");
    updateWindowById(windowId, {
      currentHistoryIndex: urlHistoryIndex - 1,
    });
  };

  const handleForwardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(
      "handleForwardClick in useBrowserWindow: forward button clicked"
    );
    updateWindowById(windowId, {
      currentHistoryIndex: urlHistoryIndex + 1,
    });
  };

  const handleRefreshClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(
      "handleRefreshClick in useBrowserWindow: refresh button clicked"
    );
    // Add refresh functionality later if needed
  };

  return {
    // Window state
    // window: browserWindow.window,
    windowId,

    // Browser state
    url,
    addressPosition,
    predefinedAddress,
    currentPage,
    urlHistory,
    urlHistoryIndex,
    canGoBack,
    canGoForward,

    // Event handlers
    handleUrlClick,
    handleUrlChange,
    handleUrlKeyDown,
    handleBackClick,
    handleForwardClick,
    handleRefreshClick,
    handleNavigateToUrl,

    // Utilities
    getCurrentHistoryUrl,

    // Direct operations
    // setUrl: browserWindow.setUrl,
    // navigateToUrl: browserWindow.navigateToUrl,
    // goBack: browserWindow.goBackToUrl,
    // goForward: browserWindow.goForwardToUrl,
    // clearHistory: browserWindow.clearHistory,
  };
};
