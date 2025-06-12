import { X, Minus, Square } from "lucide-react";

interface WindowsWindowControlsProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

export const WindowsWindowControls = ({
  onClose,
  onMinimize,
  onMaximize,
}: WindowsWindowControlsProps) => {
  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("WindowsWindowControls: close clicked");
    onClose?.();
  };

  const handleMinimizeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("WindowsWindowControls: minimize clicked");
    onMinimize?.();
  };

  const handleMaximizeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("WindowsWindowControls: maximize clicked");
    onMaximize?.();
  };

  const buttonBaseStyle: React.CSSProperties = {
    padding: "2px",
    width: "46px",
    height: "30px",
    cursor: "pointer",
    // border: "1px solid #000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    color: "#000",
  };

  return (
    <div className="flex items-center">
      {/* Minimize button */}
      <button
        style={buttonBaseStyle}
        onClick={handleMinimizeClick}
        aria-label="Minimize window"
        className="hover:bg-gray-200 transition-colors"
      >
        <Minus size={14} />
      </button>

      {/* Maximize button */}
      <button
        style={buttonBaseStyle}
        onClick={handleMaximizeClick}
        aria-label="Maximize window"
        className="hover:bg-gray-200 transition-colors"
      >
        <Square size={12} />
      </button>

      {/* Close button */}
      <button
        style={buttonBaseStyle}
        onClick={handleCloseClick}
        aria-label="Close window"
        className="hover:bg-red-500 hover:text-white transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
};
