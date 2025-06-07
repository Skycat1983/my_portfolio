import type { Item } from "../directories";
import Folder from "./Folder";

type LayoutType = "desktop" | "window";

type DirectoryLayoutProps = {
  folders: Item[];
  selectedFolder: string | null;
  setSelectedFolder: (folder: string) => void;
  onFolderDoubleClick?: (folderLabel: string) => void;
  layout?: LayoutType;
};

export const DirectoryLayout = ({
  folders,
  selectedFolder,
  setSelectedFolder,
  onFolderDoubleClick,
  layout = "window",
}: DirectoryLayoutProps) => {
  const getLayoutClasses = () => {
    if (layout === "desktop") {
      return "flex flex-col flex-wrap-reverse content-start w-full gap-10 h-full";
    } else {
      return "flex flex-row flex-wrap justify-start items-start w-full gap-4 p-2";
    }
  };

  return (
    <div className={getLayoutClasses()}>
      {folders.map((folder) => (
        <Folder
          key={folder.label}
          label={folder.label}
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
          onDoubleClick={onFolderDoubleClick}
          item={folder}
        />
      ))}
    </div>
  );
};
