interface TerminalFrameStylesProps {
  w: number;
  h: number;
  titleBarHeight: number;
  isDragging: boolean;
  hoverCursor: string;
}

export const createTerminalFrameStyles = ({
  w,
  h,
  titleBarHeight,
  isDragging,
  hoverCursor,
}: TerminalFrameStylesProps) => {
  const terminalStyle: React.CSSProperties = {
    position: "relative",
    width: w,
    height: h,
    background: "#1a1a1a",
    border: "1px solid #333333",
    borderRadius: 8,
    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
    touchAction: "none",
    cursor: isDragging ? "move" : hoverCursor,
    overflow: "hidden",
    fontFamily:
      "SF Mono, Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
  };

  const contentStyle: React.CSSProperties = {
    height: h - titleBarHeight,
    padding: "12px",
    overflow: "auto",
    color: "#00ff00",
    background: "#000000",
    fontSize: "13px",
    lineHeight: "1.4",
  };

  const headerStyle: React.CSSProperties = {
    height: titleBarHeight,
    background: "#2d2d2d",
    borderBottom: "1px solid #333333",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 8px",
    cursor: "move",
  };

  return {
    terminalStyle,
    contentStyle,
    headerStyle,
  };
};
