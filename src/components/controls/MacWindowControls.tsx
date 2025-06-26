import { X, Minus, Square } from "lucide-react";
import { DEMAXIMIZE_MAC, MAXIMIZE_MAC } from "../../constants/images";

interface MacWindowControlsProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  isMaximized?: boolean;
}

export const MacWindowControls = ({
  onClose,
  onMinimize,
  onMaximize,
  isMaximized,
}: MacWindowControlsProps) => {
  const maximizeIcon = isMaximized ? DEMAXIMIZE_MAC : MAXIMIZE_MAC;
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
    // cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "3px",
    position: "relative",
  };

  return (
    <div className="flex items-center gap-2">
      {/* Close button - Red */}
      <div
        style={{
          ...buttonBaseStyle,
          background: "#ff5f57",
          border: "1px solid #e0443e",
        }}
        onClick={handleCloseClick}
        aria-label="Close window"
        className="group hover:bg-red-600 transition-colors cursor-pointer"
      >
        <X
          size={8}
          className="text-red-900 opacity-0 group-hover:opacity-100 transition-opacity w-3 h-3 object-contain"
        />
      </div>

      {/* Minimize button - Yellow */}
      <div
        style={{
          ...buttonBaseStyle,
          background: "#ffbd2e",
          border: "1px solid #dea123",
        }}
        onClick={handleMinimizeClick}
        aria-label="Minimize window"
        className="group hover:bg-yellow-600 transition-colors cursor-not-allowed"
      >
        <Minus
          size={8}
          className="text-yellow-900 opacity-0 group-hover:opacity-100 transition-opacity "
        />
      </div>

      {/* Maximize button - Green */}
      <div
        style={{
          ...buttonBaseStyle,
          background: "#28ca42",
          border: "1px solid #1aab29",
        }}
        onClick={handleMaximizeClick}
        aria-label="Maximize window"
        className="group hover:bg-green-600 transition-colors cursor-pointer"
      >
        <img
          src={maximizeIcon}
          alt="Maximize"
          className="w-3 h-3 object-contain"
        />
        {/* <Square
          size={6}
          className="text-green-900 opacity-0 group-hover:opacity-100 transition-opacity"
        /> */}
      </div>
    </div>
  );
};
