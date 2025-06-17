import { useCallback } from "react";
import { useNewStore } from "./useStore";

type ResizeHandle = "n" | "s" | "e" | "w" | "nw" | "ne" | "sw" | "se";

export function useResizeWindow(windowId: string) {
  // Get the window data using the proper store method
  const window = useNewStore((s) => s.getWindowById(windowId));
  const setWindowBounds = useNewStore((s) => s.setWindowBounds);

  const onResizeStart = useCallback(
    (handle: ResizeHandle) => (e: React.PointerEvent) => {
      // Early return if window doesn't exist
      if (!window) {
        console.log("useResizeWindow: window not found", windowId);
        return;
      }

      e.preventDefault();
      const { width, height, x, y } = window;
      const startX = e.clientX;
      const startY = e.clientY;
      const startW = width;
      const startH = height;
      const startLeft = x;
      const startTop = y;

      function onPointerMove(moveEvent: PointerEvent) {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        let newW = startW;
        let newH = startH;
        let newX = startLeft;
        let newY = startTop;

        // East edge (right side)
        if (handle.includes("e")) {
          newW = startW + dx;
        }
        // South edge (bottom)
        if (handle.includes("s")) {
          newH = startH + dy;
        }
        // West edge (left side)
        if (handle.includes("w")) {
          newW = startW - dx;
          newX = startLeft + dx;
        }
        // North edge (top)
        if (handle.includes("n")) {
          newH = startH - dy;
          newY = startTop + dy;
        }

        // Optional: clamp to min/max dimensions
        const minWidth = 200;
        const minHeight = 150;
        newW = Math.max(minWidth, newW);
        newH = Math.max(minHeight, newH);

        // Prevent the window from going off-screen
        newX = Math.max(0, newX);
        newY = Math.max(0, newY);

        // Update window bounds using our store method
        setWindowBounds(windowId, {
          width: newW,
          height: newH,
          x: newX,
          y: newY,
        });
      }

      function onPointerUp() {
        document.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerup", onPointerUp);

        // Optional: Mark resize as complete
        //? add a flag to indicate resizing has stopped
      }

      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    },
    [window, setWindowBounds, windowId]
  );

  return { onResizeStart };
}
