import { useState } from "react";
import ResizeWrapper from "../window/WindowWrapper";
import { BrowserFrame } from "./BrowserFrame";
import { BrowserContent } from "./BrowserContent";
import { useNewStore } from "../../hooks/useNewStore";

interface BrowserProps {
  // onClose?: () => void;
  zIndex?: number;
}

// Main browser component with both drag and resize functionality
export const Browser = ({ zIndex = 1000 }: BrowserProps) => {
  const closeBrowser = useNewStore((s) => s.closeBrowser);
  const [pos, setPos] = useState({ x: 150, y: 150 });
  const [size, setSize] = useState({ w: 800, h: 600 });
  const titleBarHeight = 70; // Browser has a taller header

  const handleSizeChange = (newSize: { w: number; h: number }) => {
    console.log("handleSizeChange in Browser: new size", newSize);
    setSize(newSize);
  };

  const handlePositionChange = (newPos: { x: number; y: number }) => {
    console.log("handlePositionChange in Browser: new position", newPos);
    setPos(newPos);
  };

  const handleClose = () => {
    console.log("handleClose in Browser: closing browser");
    closeBrowser();
  };

  return (
    <div style={{ zIndex }} className="absolute">
      <ResizeWrapper
        pos={pos}
        size={size}
        titleBarHeight={titleBarHeight}
        onSizeChange={handleSizeChange}
        onPositionChange={handlePositionChange}
      >
        <BrowserFrame
          pos={pos}
          size={size}
          onPositionChange={handlePositionChange}
          onClose={handleClose}
        >
          <BrowserContent />
        </BrowserFrame>
      </ResizeWrapper>
    </div>
  );
};

export default Browser;
