import { useState, useRef, useEffect } from "react";

interface UseWindowPositionProps {
  initialPos: { x: number; y: number };
  initialSize: { w: number; h: number };
  onPositionChange?: (pos: { x: number; y: number }) => void;
  currentPos?: { x: number; y: number };
  currentSize?: { w: number; h: number };
}

export const useWindowPosition = ({
  initialPos,
  initialSize,
  onPositionChange,
  currentPos,
  currentSize,
}: UseWindowPositionProps) => {
  const [pos, setPos] = useState(initialPos);
  const [size, setSize] = useState(initialSize);

  // Use current props if provided, otherwise use internal state
  const activePos = currentPos || pos;
  const activeSize = currentSize || size;
  const [isDragging, setIsDragging] = useState(false);
  const startRef = useRef({ mouseX: 0, mouseY: 0, x: 0, y: 0, w: 0, h: 0 });

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      e.preventDefault();
      const dx = e.clientX - startRef.current.mouseX;
      const dy = e.clientY - startRef.current.mouseY;

      if (isDragging) {
        const newPos = {
          x: startRef.current.x + dx,
          y: startRef.current.y + dy,
        };
        setPos(newPos);
        if (onPositionChange) {
          onPositionChange(newPos);
        }
      }
    }

    function onPointerUp() {
      setIsDragging(false);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    }

    if (isDragging) {
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    }

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [isDragging, onPositionChange]);

  // Handle drag from title bar only
  const handleTitleBarPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    startRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      x: activePos.x,
      y: activePos.y,
      w: activeSize.w,
      h: activeSize.h,
    };
    setIsDragging(true);

    // Capture pointer on the window, not just title bar
    const windowElement = e.currentTarget.parentElement;
    if (windowElement) {
      windowElement.setPointerCapture(e.pointerId);
    }
  };

  const updateSize = (newSize: { w: number; h: number }) => {
    setSize(newSize);
  };

  const updatePosition = (newPos: { x: number; y: number }) => {
    setPos(newPos);
  };

  return {
    pos: activePos,
    size: activeSize,
    isDragging,
    cursor: isDragging ? "move" : "default",
    handleTitleBarPointerDown,
    updateSize,
    updatePosition,
  };
};
