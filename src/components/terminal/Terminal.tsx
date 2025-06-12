import { useState } from "react";
import ResizeWrapper from "../window/WindowWrapper";
import { TerminalFrame } from "./TerminalFrame";
import { TerminalContent } from "./TerminalContent";
import { useNewStore } from "../../hooks/useNewStore";
interface TerminalProps {
  zIndex?: number;
}

// Main terminal component with both drag and resize functionality
export const Terminal = ({ zIndex = 1000 }: TerminalProps) => {
  const closeTerminal = useNewStore((s) => s.closeTerminal);
  const [pos, setPos] = useState({ x: 150, y: 150 });
  const [size, setSize] = useState({ w: 600, h: 400 });
  const titleBarHeight = 28;

  const handleSizeChange = (newSize: { w: number; h: number }) => {
    console.log("handleSizeChange in Terminal: new size", newSize);
    setSize(newSize);
  };

  const handlePositionChange = (newPos: { x: number; y: number }) => {
    console.log("handlePositionChange in Terminal: new position", newPos);
    setPos(newPos);
  };

  const handleClose = () => {
    console.log("handleClose in Terminal: closing terminal");
    closeTerminal();
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
        <TerminalFrame
          pos={pos}
          size={size}
          onPositionChange={handlePositionChange}
          onClose={handleClose}
        >
          <TerminalContent />
        </TerminalFrame>
      </ResizeWrapper>
    </div>
  );
};

export default Terminal;
