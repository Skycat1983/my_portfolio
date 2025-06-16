import { useState } from "react";
import ResizeWrapper from "../../unused/WindowWrapper";
import { TerminalFrame } from "./TerminalFrame";
import { TerminalContent } from "./TerminalContent";
import { useNewStore } from "../../hooks/useStore";
interface TerminalProps {
  zIndex?: number;
}

// Main terminal component with both drag and resize functionality
export const Terminal = ({ zIndex }: TerminalProps) => {
  const { closeTerminal, focusTerminal, terminalZIndex } = useNewStore();
  const [pos, setPos] = useState({ x: 150, y: 150 });
  const [size, setSize] = useState({ w: 600, h: 400 });
  const titleBarHeight = 28;

  // Use z-index from store if not provided as prop
  const activeZIndex = zIndex ?? terminalZIndex;

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

  const handleFocus = () => {
    console.log("handleFocus in Terminal: focusing terminal");
    focusTerminal();
  };

  return (
    <div
      style={{ zIndex: activeZIndex }}
      onClick={handleFocus}
      className="absolute"
    >
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
