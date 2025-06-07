import type { Item } from "../directories";

interface FolderProps {
  label: string;
  selectedFolder: string | null;
  setSelectedFolder: (folder: string) => void;
  onDoubleClick?: (folderLabel: string) => void;
  item: Item;
}

const Folder = ({
  label,
  selectedFolder,
  setSelectedFolder,
  onDoubleClick,
  item,
}: FolderProps) => {
  const isSelected = selectedFolder === label;
  const divClass = isSelected
    ? "border-2 border-gray-500 bg-transparent rounded-md p-3 cursor-pointer"
    : "rounded-md cursor-pointer";

  const labelClass = isSelected
    ? "text-white bg-blue-500 rounded-md p-2"
    : "text-white p-2";

  const handleDoubleClick = () => {
    console.log("handleDoubleClick in Folder component: ", label);
    if (onDoubleClick) {
      onDoubleClick(label);
    }
  };

  return (
    <div
      onClick={() => setSelectedFolder(label)}
      onDoubleClick={handleDoubleClick}
    >
      <div
        className={`p-4 w-[120px] h-[120px] flex flex-col items-center justify-center ${divClass}`}
      >
        <img src={item.image} alt={item.label} />
      </div>
      <div className="flex flex-col items-center justify-center">
        <h2 className={`text-lg font-bold ${labelClass}`}>{label}</h2>
      </div>
    </div>
  );
};

export default Folder;
