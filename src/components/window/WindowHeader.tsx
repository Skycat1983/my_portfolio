export const WindowHeader = ({
  title,
  isDragging,
  onPointerDown,
}: {
  title?: string;
  isDragging: boolean;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
}) => {
  const titleBarHeight = 28;

  const titleBarStyle: React.CSSProperties = {
    height: titleBarHeight,
    background: "linear-gradient(to bottom, #374151, #1f2937)", // gray-700 to gray-800
    borderBottom: "1px solid #4b5563", // gray-600
    cursor: isDragging ? "move" : "default",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "system-ui, -apple-system, sans-serif",
    fontSize: "13px",
    fontWeight: "500",
    color: "#f3f4f6", // gray-100
    userSelect: "none",
  };

  return (
    <div style={titleBarStyle} onPointerDown={onPointerDown}>
      {title || "Window"}
    </div>
  );
};
