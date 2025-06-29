import { ResizeObserver } from "@juggle/resize-observer";
import { useEffect } from "react";
import { useNewStore } from "./useStore";

// Unified hook that provides all screen information
const useScreenMonitor = () => {
  const setScreenDimensions = useNewStore((state) => state.setScreenDimensions);
  const screenDimensions = useNewStore((state) => state.screenDimensions);

  useEffect(() => {
    const element = document.body;
    if (element === null) return;

    // Get initial dimensions immediately on mount
    const initialWidth = element.clientWidth;
    const initialHeight = element.clientHeight;

    if (initialWidth > 0 && initialHeight > 0) {
      setScreenDimensions(initialWidth, initialHeight);
    }

    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries)) return;
      if (!entries.length) return;

      const entry = entries[0];
      const newWidth = entry.contentRect.width;
      const newHeight = entry.contentRect.height;

      // Update store with new dimensions
      setScreenDimensions(newWidth, newHeight);
    });

    resizeObserver.observe(element);

    return () => resizeObserver.unobserve(element);
  }, [setScreenDimensions]);

  return {
    ...screenDimensions,
    // Provide breakpoint helpers
    isXs: screenDimensions.breakpoint === "xs",
    isSm: screenDimensions.breakpoint === "sm",
    isMd: screenDimensions.breakpoint === "md",
    isLg: screenDimensions.breakpoint === "lg",
    isXl: screenDimensions.breakpoint === "xl",
  };
};

export { useScreenMonitor };
export default useScreenMonitor;
