import { X, Minus, Square } from "lucide-react";

export const TerminalHeader = ({
  isDragging,
  onPointerDown,
  onClose,
}: {
  isDragging: boolean;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onClose?: () => void;
}) => {
  const titleBarHeight = 28;

  // Mac terminal title bar styling
  const titleBarStyle: React.CSSProperties = {
    height: titleBarHeight,
    background: "linear-gradient(to bottom, #3a3a3a, #2a2a2a)", // Dark gradient like Mac terminal
    borderBottom: "1px solid #1a1a1a",
    cursor: isDragging ? "move" : "default",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily:
      "SF Mono, Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
    fontSize: "12px",
    fontWeight: "500",
    color: "#cccccc", // Light gray text
    userSelect: "none",
    padding: "0 12px",
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
  };

  // Mac traffic light button styles
  const buttonContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const trafficLightStyle = (color: string): React.CSSProperties => ({
    height: "12px",
    width: "12px",
    borderRadius: "50%",
    background: color,
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "8px",
    color: "rgba(0,0,0,0.6)",
    transition: "all 0.15s ease",
  });

  const closeButtonStyle = trafficLightStyle("#ff5f57");
  const minimizeButtonStyle = trafficLightStyle("#ffbd2e");
  const maximizeButtonStyle = trafficLightStyle("#28ca42");

  const titleStyle: React.CSSProperties = {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    fontWeight: "600",
    fontSize: "13px",
    color: "#ffffff",
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering drag
    onClose?.();
  };

  const handleMinimizeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering drag
    // Could implement minimize functionality here
    console.log("handleMinimizeClick in TerminalHeader: minimize clicked");
  };

  const handleMaximizeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering drag
    // Could implement maximize functionality here
    console.log("handleMaximizeClick in TerminalHeader: maximize clicked");
  };

  return (
    <div style={titleBarStyle} onPointerDown={onPointerDown}>
      {/* Traffic light buttons (close, minimize, maximize) */}
      <div style={buttonContainerStyle}>
        <button
          style={closeButtonStyle}
          onClick={handleCloseClick}
          aria-label="Close terminal"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#ff3b30";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ff5f57";
          }}
        >
          <X size={8} strokeWidth={2} />
        </button>
        <button
          style={minimizeButtonStyle}
          onClick={handleMinimizeClick}
          aria-label="Minimize terminal"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#ff9500";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ffbd2e";
          }}
        >
          <Minus size={8} strokeWidth={2} />
        </button>
        <button
          style={maximizeButtonStyle}
          onClick={handleMaximizeClick}
          aria-label="Maximize terminal"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#30d158";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#28ca42";
          }}
        >
          <Square size={6} strokeWidth={2} />
        </button>
      </div>

      {/* Title */}
      <div style={titleStyle}>Terminal</div>

      {/* Empty div for spacing (to balance the traffic lights on the left) */}
      <div style={{ width: "60px" }}></div>
    </div>
  );
};
