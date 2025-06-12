import { useState } from "react";
import { useWindowPosition } from "../../hooks/useWindowPosition";
import { useNewStore } from "../../hooks/useNewStore";
import { ChevronLeft, ChevronRight, RotateCcw, Shield } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  createBrowserFrameStyles,
  browserButtonStyles,
  urlInputStyle,
} from "./BrowserFrame.styles";
import { MacWindowControls } from "../controls/MacWindowControls";
import { WindowsWindowControls } from "../controls/WindowsWindowControls";

interface BrowserFrameProps {
  pos?: { x: number; y: number };
  size?: { w: number; h: number };
  onPositionChange?: (pos: { x: number; y: number }) => void;
  children?: React.ReactNode;
  onClose?: () => void;
}

export const BrowserFrame = ({
  pos,
  size,
  onPositionChange,
  children,
  onClose,
}: BrowserFrameProps) => {
  const titleBarHeight = 70; // Taller for browser-like header
  const [hoverCursor, setHoverCursor] = useState<string>("default");

  // Use browser slice from store
  const {
    os,
    url,
    addressPosition,
    predefinedAddress,
    updateUrl,
    navigateToUrl,
    prevUrl,
    currentPage,
  } = useNewStore();

  const {
    size: hookSize,
    isDragging,
    handleTitleBarPointerDown,
  } = useWindowPosition({
    initialPos: pos || { x: 150, y: 150 },
    initialSize: size || { w: 800, h: 600 },
    onPositionChange,
    currentPos: pos,
    currentSize: size,
  });

  const handleWindowPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) return;

    const { offsetY } = e.nativeEvent;

    if (offsetY <= titleBarHeight) {
      setHoverCursor("move");
    } else {
      setHoverCursor("default");
    }
  };

  const handlePointerLeave = () => {
    if (!isDragging) {
      setHoverCursor("default");
    }
  };

  const windowSize = size || hookSize;
  const styles = createBrowserFrameStyles(
    windowSize,
    titleBarHeight,
    isDragging,
    hoverCursor
  );

  const handleUrlClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    console.log("handleUrlClick in BrowserFrame: input clicked, focusing");
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
    console.log("handleBackClick in BrowserFrame: back button clicked");
    prevUrl();
  };

  const renderWindowControls = () => {
    if (os === "mac") {
      return (
        <MacWindowControls
          onClose={onClose}
          onMinimize={() => console.log("Minimize clicked")}
          onMaximize={() => console.log("Maximize clicked")}
        />
      );
    } else {
      return (
        <WindowsWindowControls
          onClose={onClose}
          onMinimize={() => console.log("Minimize clicked")}
          onMaximize={() => console.log("Maximize clicked")}
        />
      );
    }
  };

  const renderTopBarContent = () => {
    if (os === "mac") {
      // Mac: Controls on left, title in center
      return (
        <>
          <div className="flex items-center gap-2">
            {renderWindowControls()}
          </div>
          {/* <span className="text-xs text-gray-600 font-medium">Browser</span> */}
          <div className="flex items-center gap-1">
            {/* <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div> */}
          </div>
        </>
      );
    } else {
      // Windows: Title on left, controls on right
      return (
        <>
          <div className="flex items-center gap-2">
            {/* <span className="text-xs text-gray-600 font-medium">Browser</span> */}
            {/* <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div> */}
          </div>
          {renderWindowControls()}
        </>
      );
    }
  };

  return (
    <div
      style={styles.windowStyle}
      onPointerMove={handleWindowPointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div style={styles.headerStyle} onPointerDown={handleTitleBarPointerDown}>
        {/* Top bar with OS-specific window controls */}
        <div style={styles.topBarStyle}>{renderTopBarContent()}</div>

        {/* Address bar */}
        <div style={styles.addressBarStyle}>
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
            className="hover:bg-gray-200 transition-colors"
          >
            <ChevronRight size={14} />
          </button>

          <button
            style={browserButtonStyles}
            title="Refresh"
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
      </div>

      <div style={styles.contentStyle}>{children}</div>
    </div>
  );
};
