import { ChevronLeft, ChevronRight, X } from "lucide-react";

export const WindowHeader = ({
  title,
  isDragging,
  onPointerDown,
  onClose,
  onBack,
  onForward,
  canGoBack,
  canGoForward,
}: {
  title?: string;
  isDragging: boolean;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onClose?: () => void;
  onBack?: () => void;
  onForward?: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
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

  const navButtonStyle = (enabled: boolean): React.CSSProperties => ({
    height: "20px",
    width: "20px",
    padding: "2px",
    borderRadius: "4px",
    background: enabled ? "#4b5563" : "transparent",
    border: "none",
    cursor: enabled ? "pointer" : "default",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: enabled ? "#f3f4f6" : "#6b7280",
    marginLeft: "4px",
  });

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering drag
    onClose?.();
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering drag
    if (canGoBack) onBack?.();
  };

  const handleForwardClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering drag
    if (canGoForward) onForward?.();
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

      {/* Title */}
      <div className="font-bold">{title || "Window"}</div>

      {/* Navigation buttons */}
      <div className="flex items-center">
        <ChevronLeft
          style={navButtonStyle(canGoBack || false)}
          onClick={handleBackClick}
        />
        <ChevronRight
          style={navButtonStyle(canGoForward || false)}
          onClick={handleForwardClick}
        />
      </div>
    </div>
  );
};
