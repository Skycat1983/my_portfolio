import Folder from "./Folder";

type DirectoryLayoutProps = {
  folders: { label: string }[];
  selectedFolder: string | null;
  setSelectedFolder: (folder: string) => void;
};

export const DirectoryLayout = ({
  folders,
  selectedFolder,
  setSelectedFolder,
}: DirectoryLayoutProps) => {
  return (
    <div
      className="
        flex
        flex-col
        flex-wrap-reverse
        content-start
        w-full
        gap-10
        h-full
      "
    >
      {folders.map((folder) => (
        <Folder
          key={folder.label}
          label={folder.label}
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
        />
      ))}
    </div>
  );
};
