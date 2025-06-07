import type { OpenWindow } from "../directories";
import { DirectoryLayout } from "./DirectoryLayout";
import { useState } from "react";

interface WindowProps {
  window: OpenWindow;
  onClose: (windowId: string) => void;
  onFocus: (windowId: string) => void;
  onOpenDirectory?: (folderLabel: string) => void;
}

export const Window = ({
  window,
  onClose,
  onFocus,
  onOpenDirectory,
}: WindowProps) => {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const handleClose = () => {
    console.log("handleClose in Window component: ", window.id);
    onClose(window.id);
  };

  const handleWindowClick = () => {
    console.log("handleWindowClick in Window component: ", window.id);
    onFocus(window.id);
  };

  const handleNestedDirectoryOpen = (folderLabel: string) => {
    console.log("handleNestedDirectoryOpen in Window component: ", folderLabel);
    if (onOpenDirectory) {
      onOpenDirectory(folderLabel);
    }
  };

  return (
    <div
      className="absolute bg-gray-800 border border-gray-600 rounded-lg shadow-lg min-w-[400px] min-h-[300px]"
      style={{
        left: window.position.x,
        top: window.position.y,
        zIndex: window.zIndex,
      }}
      onClick={handleWindowClick}
    >
      <div className="bg-gray-700 px-4 py-2 rounded-t-lg flex justify-between items-center">
        <h3 className="text-white font-semibold">{window.directory.label}</h3>
        <button
          onClick={handleClose}
          className="text-white hover:text-red-400 text-xl font-bold"
          aria-label="Close window"
        >
          ×
        </button>
      </div>

      <div className="p-4 max-h-[400px] overflow-auto">
        <DirectoryLayout
          folders={window.directory.children}
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
          onFolderDoubleClick={handleNestedDirectoryOpen}
        />
      </div>
    </div>
  );
};

export default Window;
