import { X, Minus, Square } from "lucide-react";

interface MacWindowControlsProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

export const MacWindowControls = ({
  onClose,
  onMinimize,
  onMaximize,
}: MacWindowControlsProps) => {
  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("MacWindowControls: close clicked");
    onClose?.();
  };

  const handleMinimizeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("MacWindowControls: minimize clicked");
    onMinimize?.();
  };

  const handleMaximizeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("MacWindowControls: maximize clicked");
    onMaximize?.();
  };

  const buttonBaseStyle: React.CSSProperties = {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "3px",
    position: "relative",
  };

  return (
    <div className="flex items-center gap-2">
      {/* Close button - Red */}
      <button
        style={{
          ...buttonBaseStyle,
          background: "#ff5f57",
          border: "1px solid #e0443e",
        }}
        onClick={handleCloseClick}
        aria-label="Close window"
        className="group hover:bg-red-600 transition-colors"
      >
        <X
          size={8}
          className="text-red-900 opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </button>

      {/* Minimize button - Yellow */}
      <button
        style={{
          ...buttonBaseStyle,
          background: "#ffbd2e",
          border: "1px solid #dea123",
        }}
        onClick={handleMinimizeClick}
        aria-label="Minimize window"
        className="group hover:bg-yellow-600 transition-colors"
      >
        <Minus
          size={8}
          className="text-yellow-900 opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </button>

      {/* Maximize button - Green */}
      <button
        style={{
          ...buttonBaseStyle,
          background: "#28ca42",
          border: "1px solid #1aab29",
        }}
        onClick={handleMaximizeClick}
        aria-label="Maximize window"
        className="group hover:bg-green-600 transition-colors"
      >
        <Square
          size={6}
          className="text-green-900 opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </button>
    </div>
  );
};
