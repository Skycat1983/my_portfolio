interface WindowFrameStylesProps {
  w: number;
  h: number;
  titleBarHeight: number;
  isDragging: boolean;
  hoverCursor: string;
}

export const createWindowFrameStyles = ({
  w,
  h,
  titleBarHeight,
  isDragging,
  hoverCursor,
}: WindowFrameStylesProps) => {
  const windowStyle: React.CSSProperties = {
    position: "relative", // Changed from absolute since wrapper handles positioning
    width: w,
    height: h,
    background: "#1f2937", // gray-800
    border: "1px solid #4b5563", // gray-600
    borderRadius: 8,
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    touchAction: "none",
    cursor: isDragging ? "move" : hoverCursor,
    overflow: "hidden",
  };

  const contentStyle: React.CSSProperties = {
    height: h - titleBarHeight,
    padding: "12px",
    overflow: "auto",
    color: "#f3f4f6", // gray-100
  };

  const headerStyle: React.CSSProperties = {
    height: titleBarHeight,
    background: "#374151", // gray-700
    borderBottom: "1px solid #4b5563", // gray-600
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 8px",
    cursor: "move",
  };

  return {
    windowStyle,
    contentStyle,
    headerStyle,
  };
};
