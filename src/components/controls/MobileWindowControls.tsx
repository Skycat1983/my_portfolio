import { X } from "lucide-react";
import { createButtonStyle } from "@/styles/theme";

interface MobileWindowControlsProps {
  onClose?: () => void;
}

export const MobileWindowControls = ({
  onClose,
}: MobileWindowControlsProps) => {
  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose?.();
  };

  return (
    <div className="flex items-center">
      <button
        onClick={handleCloseClick}
        aria-label="Close window"
        style={createButtonStyle("mobile")}
        className="
          touch-manipulation
          active:scale-95
          shadow-sm hover:shadow-md
          hover:bg-red-500 hover:border-red-500 hover:text-white
          transition-all duration-200
        "
      >
        <X size={18} className="stroke-2" />
      </button>
    </div>
  );
};
