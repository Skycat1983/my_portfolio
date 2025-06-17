import { useCallback } from "react";
import { useNewStore } from "../../../store/useStore";

export function useWindowDrag(windowId: string) {
  // Get the window data using the proper store method
  const windowData = useNewStore((s) => s.getWindowById(windowId));
  const moveWindow = useNewStore((s) => s.moveWindow);

  const onDragStart = useCallback(
    (e: React.PointerEvent) => {
      // Early return if window doesn't exist
      if (!windowData) {
        console.log("useDragWindow: window not found", windowId);
        return;
      }

      e.preventDefault();
      const { x, y } = windowData;
      const startX = e.clientX;
      const startY = e.clientY;
      const startLeft = x;
      const startTop = y;

      function onPointerMove(moveEvent: PointerEvent) {
        // Double check windowData still exists
        if (!windowData) return;

        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        let newX = startLeft + dx;
        let newY = startTop + dy;

        // Optional: Prevent the window from going off-screen
        // Get viewport dimensions
        const viewportWidth = globalThis.window?.innerWidth || 1920;
        const viewportHeight = globalThis.window?.innerHeight || 1080;
        const windowWidth = windowData.width;

        // Constrain to viewport bounds (with some tolerance for dragging off-screen)
        const minX = -windowWidth + 100; // Allow some off-screen dragging
        const maxX = viewportWidth - 100;
        const minY = 0; // Don't allow dragging above viewport
        const maxY = viewportHeight - 50; // Keep title bar visible

        newX = Math.max(minX, Math.min(maxX, newX));
        newY = Math.max(minY, Math.min(maxY, newY));

        // Update window position using our store method
        moveWindow(windowId, newX, newY);
      }

      function onPointerUp() {
        document.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerup", onPointerUp);

        // Optional: Could add snapping logic here
        // e.g., snap to screen edges, other windows, etc.
      }

      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    },
    [windowData, moveWindow, windowId]
  );

  return { onDragStart };
}
