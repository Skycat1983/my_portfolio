import { useNewStore } from "@/hooks/useStore";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";
import { urlInputStyle } from "./BrowserFrame.styles";

interface BrowserAddressBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClick: (e: React.MouseEvent<HTMLInputElement>) => void;
}

export const BrowserAddressBar = ({
  value,
  onChange,
  onKeyDown,
  onClick,
}: BrowserAddressBarProps) => {
  const screenDimensions = useNewStore((state) => state.screenDimensions);

  // Mobile-friendly input styles
  const mobileInputStyle = screenDimensions.isMobile
    ? {
        ...urlInputStyle,
        height: "44px",
        fontSize: "16px", // Prevents zoom on iOS
        borderRadius: "8px",
      }
    : urlInputStyle;

  return (
    <div className="flex items-center flex-1 relative">
      <Shield
        size={screenDimensions.isMobile ? 18 : 14}
        className="absolute left-3 text-green-500"
      />
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onClick={onClick}
        onPointerDown={(e) => e.stopPropagation()}
        style={mobileInputStyle}
        className={cn(
          screenDimensions.isMobile ? "pl-10" : "pl-8",
          "w-full touch-manipulation"
        )}
        placeholder="Start typing to visit the site…"
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  );
};
