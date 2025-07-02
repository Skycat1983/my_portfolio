import type { DockItemData } from "./Dock";

interface DockItemProps {
  item: DockItemData;
  onItemClick: (item: DockItemData) => void;
}

export const DockItem: React.FC<DockItemProps> = ({ item, onItemClick }) => {
  const handleClick = () => {
    console.log("DockItem click in Dock: clicking dock item", item.id);
    onItemClick(item);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className="dock-item group relative flex items-center justify-center cursor-pointer transition-all duration-200 ease-out hover:scale-110 hover:-translate-y-2"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Open ${item.label}`}
    >
      {/* Dock Item Background */}
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/10 shadow-lg flex items-center justify-center overflow-hidden group-hover:shadow-xl group-hover:border-white/20 transition-all duration-200">
        {item.image ? (
          <img
            src={item.image}
            alt={item.label}
            className="w-10 h-10 object-contain"
            draggable={false}
          />
        ) : item.icon ? (
          <div className="w-10 h-10 flex items-center justify-center text-white">
            {item.icon}
          </div>
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
            {item.label.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Tooltip */}
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900/90 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none backdrop-blur-sm">
        {item.label}
      </div>

      {/* Hover indicator dot */}
      <div className="absolute -bottom-2 w-1 h-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
    </div>
  );
};
