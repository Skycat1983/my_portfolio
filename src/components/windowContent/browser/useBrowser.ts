import { useNewStore } from "../../../hooks/useStore";

export const useBrowser = () => {
  const url = useNewStore((s) => s.url);
  const addressPosition = useNewStore((s) => s.addressPosition);
  const predefinedAddress = useNewStore((s) => s.predefinedAddress);
  const updateUrl = useNewStore((s) => s.updateUrl);
  const navigateToUrl = useNewStore((s) => s.navigateToUrl);
  const prevUrl = useNewStore((s) => s.prevUrl);
  const nextUrl = useNewStore((s) => s.nextUrl);
  const currentPage = useNewStore((s) => s.currentPage);
  const browserHistory = useNewStore((s) => s.browserHistory);
  const browserHistoryIndex = useNewStore((s) => s.browserHistoryIndex);

  const handleUrlClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    console.log("handleUrlClick in useBrowser: input clicked, focusing");
    e.currentTarget.focus();
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const typedCharCount = inputValue.length;
    updateUrl(typedCharCount);
  };

  const handleUrlKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      navigateToUrl();
      e.preventDefault();
      return;
    }

    if (e.key.length === 1 && addressPosition >= predefinedAddress.length) {
      e.preventDefault();
    }
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("handleBackClick in useBrowser: back button clicked");
    prevUrl();
  };

  const handleForwardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("handleForwardClick in useBrowser: forward button clicked");
    nextUrl();
  };

  const handleRefreshClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("handleRefreshClick in useBrowser: refresh button clicked");
    // Add refresh functionality later if needed
  };

  // Determine if navigation buttons should be enabled
  const canGoBack =
    currentPage !== "start" ||
    (browserHistory.length > 0 && browserHistoryIndex > 0);

  const canGoForward =
    browserHistory.length > 0 &&
    browserHistoryIndex < browserHistory.length - 1;

  // Get current URL from history if available
  const getCurrentHistoryUrl = () => {
    if (
      browserHistory.length > 0 &&
      browserHistoryIndex >= 0 &&
      browserHistoryIndex < browserHistory.length
    ) {
      return browserHistory[browserHistoryIndex];
    }
    return "";
  };

  return {
    // State
    url,
    addressPosition,
    predefinedAddress,
    currentPage,
    browserHistory,
    browserHistoryIndex,
    canGoBack,
    canGoForward,

    // Event handlers
    handleUrlClick,
    handleUrlChange,
    handleUrlKeyDown,
    handleBackClick,
    handleForwardClick,
    handleRefreshClick,

    // Utilities
    getCurrentHistoryUrl,
  };
};
