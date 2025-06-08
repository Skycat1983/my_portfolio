import { useState, useRef, useEffect } from "react";

type ResizeMode =
  | null
  | "resize-e"
  | "resize-s"
  | "resize-w"
  | "resize-se"
  | "resize-sw";

interface UseResizeProps {
  titleBarHeight: number;
  onSizeChange: (size: { w: number; h: number }) => void;
  onPositionChange: (pos: { x: number; y: number }) => void;
  currentPos: { x: number; y: number };
  currentSize: { w: number; h: number };
}

export const useResize = ({
  titleBarHeight,
  onSizeChange,
  onPositionChange,
  currentPos,
  currentSize,
}: UseResizeProps) => {
  const [resizeMode, setResizeMode] = useState<ResizeMode>(null);
  const [hoverCursor, setHoverCursor] = useState<string>("default");
  const startRef = useRef({ mouseX: 0, mouseY: 0, x: 0, y: 0, w: 0, h: 0 });

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      e.preventDefault();
      const dx = e.clientX - startRef.current.mouseX;
      const dy = e.clientY - startRef.current.mouseY;

      if (resizeMode?.startsWith("resize")) {
        let { x, w, h } = startRef.current;
        const { y } = startRef.current;
        let positionChanged = false;

        if (resizeMode.includes("e")) w = Math.max(100, w + dx);
        if (resizeMode.includes("s")) h = Math.max(100, h + dy);
        if (resizeMode.includes("w")) {
          // Keep east edge fixed, only move west edge
          const eastEdge = startRef.current.x + startRef.current.w; // Fixed east position
          const newW = Math.max(100, startRef.current.w - dx); // Original calculation was correct
          x = eastEdge - newW; // Adjust x to keep east edge fixed
          w = newW;
          positionChanged = true;
        }

        onSizeChange({ w, h });
        if (positionChanged) {
          onPositionChange({ x, y });
        }
      }
    }

    function onPointerUp() {
      setResizeMode(null);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    }

    if (resizeMode) {
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    }

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [resizeMode, onSizeChange, onPositionChange]);

  // Handle hover on window edges for resize cursors
  const handleWindowPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (resizeMode) return; // Don't change cursor while resizing

    const { offsetX, offsetY } = e.nativeEvent;
    const { clientWidth: w, clientHeight: h } = e.currentTarget;
    const edge = 8;

    // Don't show resize cursors in the title bar area
    if (offsetY <= titleBarHeight) {
      setHoverCursor("default");
      return;
    }

    let cursor = "default";
    // Check corners first
    if (offsetX < edge && offsetY > h - edge) {
      cursor = "sw-resize";
    } else if (offsetX > w - edge && offsetY > h - edge) {
      cursor = "se-resize";
    }
    // Then check edges (excluding corners)
    else if (
      offsetX < edge &&
      offsetY > titleBarHeight + edge &&
      offsetY <= h - edge
    ) {
      cursor = "w-resize";
    } else if (
      offsetX > w - edge &&
      offsetY > titleBarHeight + edge &&
      offsetY <= h - edge
    ) {
      cursor = "e-resize";
    } else if (offsetY > h - edge && offsetX >= edge && offsetX <= w - edge) {
      cursor = "s-resize";
    }

    setHoverCursor(cursor);
  };

  // Handle resize from window edges only (not title bar or top edge)
  const handleWindowPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const { clientWidth: w, clientHeight: h } = e.currentTarget;
    const edge = 8;

    // Completely block any resize interaction in title bar area
    if (offsetY <= titleBarHeight) {
      return;
    }

    let newMode: ResizeMode = null;

    // Check corners first
    if (offsetX < edge && offsetY > h - edge) {
      newMode = "resize-sw"; // Bottom-left corner
    } else if (offsetX > w - edge && offsetY > h - edge) {
      newMode = "resize-se"; // Bottom-right corner
    }
    // Then check edges (excluding corners)
    else if (
      offsetX < edge &&
      offsetY > titleBarHeight + edge &&
      offsetY <= h - edge
    ) {
      newMode = "resize-w"; // Left edge (excluding corners)
    } else if (
      offsetX > w - edge &&
      offsetY > titleBarHeight + edge &&
      offsetY <= h - edge
    ) {
      newMode = "resize-e"; // Right edge (excluding corners)
    } else if (offsetY > h - edge && offsetX >= edge && offsetX <= w - edge) {
      newMode = "resize-s"; // Bottom edge (excluding corners)
    }

    if (newMode) {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.setPointerCapture(e.pointerId);
      startRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        x: currentPos.x,
        y: currentPos.y,
        w: currentSize.w,
        h: currentSize.h,
      };
      setResizeMode(newMode);
    }
  };

  // Reset cursor when leaving the window during resize operations
  const handlePointerLeave = () => {
    if (!resizeMode) {
      setHoverCursor("default");
    }
  };

  const cursor = resizeMode
    ? `${resizeMode.replace("resize-", "")}-resize`
    : hoverCursor;

  return {
    cursor,
    isResizing: !!resizeMode,
    handleWindowPointerMove,
    handleWindowPointerDown,
    handlePointerLeave,
  };
};
