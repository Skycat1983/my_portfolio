import { useWindowHistoryNavigation } from "./useWindowHistoryNavigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import theme from "@/styles/theme";
import { useNewStore } from "@/hooks/useStore";
import { cn } from "@/lib/utils";
import { browserButtonStyles } from "@/components/applications/browser/BrowserFrame.styles";
import type { Window } from "../windowTypes";

interface NavigationProps {
  windowId: Window["windowId"];
  firstHistoryItem: unknown;
  showForwardButton?: boolean;
  showBackButton?: boolean;
  onHistoryChange?: (currentItem: unknown, currentIndex: number) => void;
}

export const WindowHistoryNavigation = ({
  windowId,
  firstHistoryItem,
  showForwardButton = true,
  showBackButton = true,
  onHistoryChange,
}: NavigationProps) => {
  const themeMode = useNewStore((state) => state.theme);
  const screenDimensions = useNewStore((s) => s.screenDimensions);
  const bgColor = theme.colors[themeMode].background.primary;
  const iconColor = theme.colors[themeMode].text.primary;
  const historyId = `${windowId}`;
  const { history, goBack, goForward, canGoBack, canGoForward } =
    useWindowHistoryNavigation({
      historyId,
      firstHistoryItem,
      onHistoryChange,
    });
  console.log("HISTORY_DEBUG WindowHistoryNavigation history", history);

  // Mobile-friendly button styles
  const mobileButtonStyles = screenDimensions.isMobile
    ? {
        ...browserButtonStyles,
        width: "44px",
        height: "44px",
        borderRadius: "8px",
      }
    : browserButtonStyles;

  return (
    <div
      className="flex items-center gap-2 h-auto"
      style={{ backgroundColor: bgColor }}
    >
      {showBackButton && (
        <button
          style={mobileButtonStyles}
          title="Back"
          onClick={goBack}
          disabled={!canGoBack}
          className={cn(
            "hover:bg-gray-200 transition-colors touch-manipulation",
            !canGoBack && "opacity-50 cursor-not-allowed"
          )}
        >
          <ChevronLeft
            size={screenDimensions.isMobile ? 20 : 14}
            color={iconColor}
          />
        </button>
      )}
      {showForwardButton && (
        <button
          style={mobileButtonStyles}
          title="Forward"
          onClick={goForward}
          disabled={!canGoForward}
          className={cn(
            "hover:bg-gray-200 transition-colors touch-manipulation",
            !canGoForward && "opacity-50 cursor-not-allowed"
          )}
        >
          <ChevronRight
            size={screenDimensions.isMobile ? 20 : 14}
            color={iconColor}
          />
        </button>
      )}
    </div>
  );
};
