import React from "react";
import { useWindowResize } from "./hooks/useWindowResize";
import { WindowHeader } from "./WindowHeader";
import { useNewStore } from "@/hooks/useStore";
import theme from "@/styles/theme";
import { AnimatePresence, motion } from "framer-motion";
import type { Window } from "./windowTypes";
import { getWindowComponent } from "@/constants/applicationRegistry";

interface ResizableWindowProps {
  window: Window;
  isMobile: boolean;
  // children?: React.ReactNode;
}

export const ResizableWindow: React.FC<ResizableWindowProps> = ({
  window,
  isMobile,
  // children,
}) => {
  const {
    windowId,
    nodeId,
    applicationRegistryId,
    title,
    width,
    height,
    x,
    y,
    zIndex,
    // isMinimized,
    isMaximized,
    fixed,
  } = window;
  const { onResizeStart } = useWindowResize(window.windowId);
  const focusWindow = useNewStore((s) => s.focusWindow);
  const currentTheme = useNewStore((s) => s.theme);

  const RegistryComponent = getWindowComponent(applicationRegistryId);

  const windowStyle =
    isMaximized || isMobile
      ? {
          left: 0,
          top: 0,
          width: "100vw",
          height: "100vh",
          zIndex: zIndex + 1000, // Ensure fullscreen windows are above everything
        }
      : {
          left: x,
          top: y,
          width,
          height,
          zIndex,
        };

  // Get theme-specific colors
  const bgColor = theme.colors[currentTheme].background.primary;
  const borderColor = theme.colors[currentTheme].border.primary;
  const contentBgColor = theme.colors[currentTheme].background.secondary;

  // Conditional classes for different window states
  const windowClasses = isMaximized
    ? "fixed inset-0 shadow-none rounded-none border-none"
    : "absolute border shadow-lg rounded-lg overflow-hidden";

  return (
    <>
      <AnimatePresence initial={true}>
        <motion.div
          v-if="isVisible"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          // style={box}
          key="box"
          // class="box"
          // key="box"
          className={windowClasses}
          style={{
            ...windowStyle,
            backgroundColor: bgColor,
            borderColor: borderColor,
          }}
          onClick={() => {
            focusWindow(windowId);
          }}
        >
          {/* Window Header with drag functionality */}
          <WindowHeader windowId={windowId} title={title} />

          {/* Window Content */}
          <div
            className="pt-9 h-full overflow-auto p-0 md:pt-10"
            style={{ backgroundColor: contentBgColor }}
          >
            {RegistryComponent ? (
              <RegistryComponent windowId={windowId} nodeId={nodeId} />
            ) : (
              <div>No component found</div>
            )}
          </div>

          {/* Resize Handles - only show when not maximized */}
          {!isMaximized && !fixed && (
            <>
              {/* North handle */}
              <div
                className="absolute top-0 left-2 right-2 h-2 cursor-n-resize"
                onPointerDown={onResizeStart("n")}
              />

              {/* South handle */}
              <div
                className="absolute bottom-0 left-2 right-2 h-2 cursor-s-resize"
                onPointerDown={onResizeStart("s")}
              />

              {/* East handle */}
              <div
                className="absolute top-2 bottom-2 right-0 w-2 cursor-e-resize"
                onPointerDown={onResizeStart("e")}
              />

              {/* West handle */}
              <div
                className="absolute top-2 bottom-2 left-0 w-2 cursor-w-resize"
                onPointerDown={onResizeStart("w")}
              />

              {/* Corner handles */}
              {/* Northwest */}
              <div
                className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize"
                onPointerDown={onResizeStart("nw")}
              />

              {/* Northeast */}
              <div
                className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize"
                onPointerDown={onResizeStart("ne")}
              />

              {/* Southwest */}
              <div
                className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize"
                onPointerDown={onResizeStart("sw")}
              />

              {/* Southeast */}
              <div
                className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize"
                onPointerDown={onResizeStart("se")}
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
};
