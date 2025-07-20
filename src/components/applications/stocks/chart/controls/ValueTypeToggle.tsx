import useScreenSize from "@/hooks/useScreenSize";
import { TrendingUp, Database } from "lucide-react";

interface ValueTypeToggleProps {
  valueType: "accumulated" | "growth";
  toggleValueType: () => void;
}

const ValueTypeToggle = ({
  valueType,
  toggleValueType,
}: ValueTypeToggleProps) => {
  const screenSize = useScreenSize();
  const isSmallScreen = screenSize.isMobile;

  return (
    <button
      onClick={toggleValueType}
      className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-full"
    >
      {valueType === "accumulated" ? (
        <>
          <Database size={16} />
          {!isSmallScreen && "Total"}
        </>
      ) : (
        <>
          <TrendingUp size={16} />
          {!isSmallScreen && "Growth"}
        </>
      )}
    </button>
  );
};

export default ValueTypeToggle;
