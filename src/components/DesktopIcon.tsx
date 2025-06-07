import type { MapNode } from "../constants/nodes";

interface NodeIconProps {
  node: MapNode;
  isSelected: boolean;
  onSelect: (nodeId: string) => void;
  onDoubleClick?: (nodeId: string) => void;
}

export const NodeIcon = ({
  node,
  isSelected,
  onSelect,
  onDoubleClick,
}: NodeIconProps) => {
  const handleClick = () => {
    onSelect(node.id);
  };

  const handleDoubleClick = () => {
    console.log("NodeIcon double-click:", node.label);
    if (onDoubleClick) {
      onDoubleClick(node.id);
    }
  };

  const containerClass = isSelected
    ? "border-2 border-gray-500 bg-transparent rounded-md p-3 cursor-pointer"
    : "rounded-md cursor-pointer hover:bg-gray-800/30";

  const labelClass = isSelected
    ? "text-white bg-blue-500 rounded-md p-2"
    : "text-white p-2";

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className="flex flex-col items-center"
    >
      <div
        className={`p-4 w-[120px] h-[120px] flex flex-col items-center justify-center ${containerClass}`}
      >
        <img
          src={node.image}
          alt={node.label}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex flex-col items-center justify-center">
        <h2
          className={`text-lg font-bold ${labelClass} text-center max-w-[120px] truncate`}
        >
          {node.label}
        </h2>
      </div>
    </div>
  );
};
