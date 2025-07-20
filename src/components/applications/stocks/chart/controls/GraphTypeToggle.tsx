import useScreenSize from "@/hooks/useScreenSize";
import { BarChart3, LineChart } from "lucide-react";

interface GraphTypeToggleProps {
  graphType: "area" | "bar";
  toggleGraphType: () => void;
}

const GraphTypeToggle = ({
  graphType,
  toggleGraphType,
}: GraphTypeToggleProps) => {
  const screenSize = useScreenSize();
  const isSmallScreen = screenSize.isMobile;

  return (
    <button
      onClick={toggleGraphType}
      className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-full"
    >
      {graphType === "area" ? (
        <>
          <LineChart size={16} />
          {!isSmallScreen && "Area"}
        </>
      ) : (
        <>
          <BarChart3 size={16} />
          {!isSmallScreen && "Bar"}
        </>
      )}
    </button>
  );
};

export default GraphTypeToggle;
