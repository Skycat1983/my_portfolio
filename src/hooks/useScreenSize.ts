import { ResizeObserver } from "@juggle/resize-observer";
import { useEffect, useState } from "react";
import { useNewStore } from "./useStore";

// Unified hook that provides all screen information
const useScreenMonitor = () => {
  const [localDimensions, setLocalDimensions] = useState({
    width: 0,
    height: 0,
  });
  const setScreenDimensions = useNewStore((state) => state.setScreenDimensions);
  const screenDimensions = useNewStore((state) => state.screenDimensions);

  useEffect(() => {
    const element = document.body;
    if (element === null) return;

    // Get initial dimensions immediately on mount
    const initialWidth = element.clientWidth;
    const initialHeight = element.clientHeight;

    if (initialWidth > 0 && initialHeight > 0) {
      setLocalDimensions({ width: initialWidth, height: initialHeight });
      setScreenDimensions(initialWidth, initialHeight);
    }

    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries)) return;
      if (!entries.length) return;

      const entry = entries[0];
      const newWidth = entry.contentRect.width;
      const newHeight = entry.contentRect.height;

      // Only update if dimensions actually changed
      if (
        localDimensions.width !== newWidth ||
        localDimensions.height !== newHeight
      ) {
        setLocalDimensions({ width: newWidth, height: newHeight });
        setScreenDimensions(newWidth, newHeight);
      }
    });

    resizeObserver.observe(element);

    return () => resizeObserver.unobserve(element);
  }, [localDimensions.width, localDimensions.height, setScreenDimensions]);

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
