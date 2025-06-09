import { ChevronLeft, ChevronRight, X } from "lucide-react";

export const WindowHeader = ({
  title,
  isDragging,
  onPointerDown,
  onClose,
}: {
  title?: string;
  isDragging: boolean;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onClose?: () => void;
}) => {
  const titleBarHeight = 42;

  const titleBarStyle: React.CSSProperties = {
    height: titleBarHeight,
    background: "linear-gradient(to bottom, #374151, #1f2937)", // gray-700 to gray-800
    borderBottom: "1px solid #4b5563", // gray-600
    cursor: isDragging ? "move" : "default",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: "system-ui, -apple-system, sans-serif",
    fontSize: "13px",
    fontWeight: "500",
    color: "#f3f4f6", // gray-100
    userSelect: "none",
    padding: "0 8px",
  };

  const closeButtonStyle: React.CSSProperties = {
    height: "16px",
    width: "16px",
    marginRight: "16px",
    marginLeft: "10px",
    borderRadius: "50%",
    padding: "2px",
    background: "#ef4444", // red-500
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering drag
    onClose?.();
  };

  return (
    <div style={titleBarStyle} onPointerDown={onPointerDown}>
      {onClose && (
        <X
          style={closeButtonStyle}
          onClick={handleCloseClick}
          aria-label="Close window"
        />
      )}

      {/* Left spacer */}
      <div className="font-bold">{title || "Window"}</div>
      <div className="flex items-center">
        <ChevronLeft />
        <ChevronRight />
      </div>
    </div>
  );
};
