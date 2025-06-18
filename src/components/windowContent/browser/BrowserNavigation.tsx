import { ChevronLeft, ChevronRight, RotateCcw, Shield } from "lucide-react";
import { cn } from "../../../lib/utils";
import { useBrowser } from "./useBrowser";
import { browserButtonStyles, urlInputStyle } from "./BrowserFrame.styles";

export const BrowserNavigation = () => {
  const {
    url,
    currentPage,
    handleUrlClick,
    handleUrlChange,
    handleUrlKeyDown,
    handleBackClick,
    handleForwardClick,
    handleRefreshClick,
  } = useBrowser();

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
        onClick={handleBackClick}
        disabled={currentPage === "start"}
        className={cn(
          "hover:bg-gray-200 transition-colors",
          currentPage === "start" && "opacity-50 cursor-not-allowed"
        )}
      >
        <ChevronLeft size={14} />
      </button>

      <button
        style={browserButtonStyles}
        title="Forward"
        onClick={handleForwardClick}
        className="hover:bg-gray-200 transition-colors"
      >
        <ChevronRight size={14} />
      </button>

      <button
        style={browserButtonStyles}
        title="Refresh"
        onClick={handleRefreshClick}
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
