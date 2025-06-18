import { useNewStore } from "../../../hooks/useStore";

export const useBrowser = () => {
  // Get browser state and actions from store
  const {
    url,
    addressPosition,
    predefinedAddress,
    updateUrl,
    navigateToUrl,
    prevUrl,
    currentPage,
  } = useNewStore();

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
    // Add forward functionality later if needed
  };

  const handleRefreshClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("handleRefreshClick in useBrowser: refresh button clicked");
    // Add refresh functionality later if needed
  };

  return {
    // State
    url,
    addressPosition,
    predefinedAddress,
    currentPage,

    // Event handlers
    handleUrlClick,
    handleUrlChange,
    handleUrlKeyDown,
    handleBackClick,
    handleForwardClick,
    handleRefreshClick,
  };
};
