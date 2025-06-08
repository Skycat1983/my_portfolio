import { useState } from "react";
import ResizeWrapper from "./WindowWrapper";
import { WindowFrame } from "./WindowFrame";
import { WindowContent } from "./WindowContent";

// Main window component with both drag and resize functionality
export const Window = () => {
  const [pos, setPos] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ w: 400, h: 300 });
  const titleBarHeight = 28;

  const handleSizeChange = (newSize: { w: number; h: number }) => {
    setSize(newSize);
  };

  const handlePositionChange = (newPos: { x: number; y: number }) => {
    setPos(newPos);
  };

  return (
    <ResizeWrapper
      pos={pos}
      size={size}
      titleBarHeight={titleBarHeight}
      onSizeChange={handleSizeChange}
      onPositionChange={handlePositionChange}
    >
      <WindowFrame
        pos={pos}
        size={size}
        title="Window"
        onPositionChange={handlePositionChange}
      >
        <WindowContent />
      </WindowFrame>
    </ResizeWrapper>
  );
};

export default Window;
