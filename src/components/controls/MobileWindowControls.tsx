import { X } from "lucide-react";
import theme from "@/styles/theme";
import { Button } from "../ui/button";
import { useNewStore } from "@/hooks/useStore";

interface MobileWindowControlsProps {
  onClose?: () => void;
}

export const MobileWindowControls = ({
  onClose,
}: MobileWindowControlsProps) => {
  const themeMode = useNewStore((state) => state.theme);
  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose?.();
  };

  return (
    <div className="flex items-center">
      <Button
        onClick={handleCloseClick}
        aria-label="Close window"
        style={{
          backgroundColor: theme.colors[themeMode].background.primary,
          color: theme.colors[themeMode].text.primary,
        }}
        className="
          touch-manipulation
          active:scale-95
          shadow-sm hover:shadow-md
          hover:bg-red-500 hover:border-red-500 hover:text-white
          transition-all duration-200
        "
      >
        <X size={18} className="text-white" />
      </Button>
    </div>
  );
};
