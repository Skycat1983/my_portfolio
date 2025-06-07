import { useState } from "react";
import { DirectoryLayout } from "../components/DirectoryLayout";
// import { defaultFolders } from "../constants";
import { MenubarLayout } from "../components/menubar/MenubarLayout";
import { defaultDirectories } from "../directories";
// NEW CODE: Import Window component and types
import { Window } from "../components/Window";
import type { OpenWindow, Directory, Item } from "../directories";

const Desktop = () => {
  const [folders, setFolders] = useState(defaultDirectories.children);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  // NEW CODE: Window management state
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const [nextZIndex, setNextZIndex] = useState(1000); // Start high to stay above desktop

  // NEW CODE: Helper function to find directory by label
  const findDirectoryByLabel = (
    label: string,
    items: Item[]
  ): Directory | null => {
    console.log("findDirectoryByLabel searching for: ", label);
    for (const item of items) {
      if (item.label === label) {
        // Check if this item is a Directory (has children property)
        if ("children" in item) {
          console.log("findDirectoryByLabel found directory: ", item);
          return item as Directory;
        }
      }
      // If item is a directory, search its children recursively
      if ("children" in item) {
        const found = findDirectoryByLabel(label, item.children);
        if (found) return found;
      }
    }
    return null;
  };

  const handleOpenDirectory = (folderLabel: string) => {
    console.log("handleOpenDirectory in Desktop component: ", folderLabel);

    // Check if window is already open
    const existingWindow = openWindows.find(
      (window) => window.directory.label === folderLabel
    );
    if (existingWindow) {
      console.log(
        "handleOpenDirectory window already open, focusing: ",
        folderLabel
      );
      handleFocusWindow(existingWindow.id);
      return;
    }

    const directory = findDirectoryByLabel(folderLabel, [defaultDirectories]);
    if (!directory) {
      console.log("handleOpenDirectory directory not found: ", folderLabel);
      return;
    }

    const windowId = `window-${Date.now()}-${Math.random()}`;
    const basePosition = { x: 100, y: 100 };
    const offset = openWindows.length * 30; // Cascade effect

    const newWindow: OpenWindow = {
      id: windowId,
      directory,
      position: {
        x: basePosition.x + offset,
        y: basePosition.y + offset,
      },
      zIndex: nextZIndex,
    };

    console.log("handleOpenDirectory creating new window: ", newWindow);
    setOpenWindows((prev) => [...prev, newWindow]);
    setNextZIndex((prev) => prev + 1);
  };

  const handleCloseWindow = (windowId: string) => {
    console.log("handleCloseWindow in Desktop component: ", windowId);
    setOpenWindows((prev) => prev.filter((window) => window.id !== windowId));
  };

  const handleFocusWindow = (windowId: string) => {
    console.log("handleFocusWindow in Desktop component: ", windowId);
    setOpenWindows((prev) =>
      prev.map((window) =>
        window.id === windowId ? { ...window, zIndex: nextZIndex } : window
      )
    );
    setNextZIndex((prev) => prev + 1);
  };

  return (
    <div className="w-screen h-screen bg-gray-900 relative overflow-hidden">
      <MenubarLayout />
      <div className="p-10 h-full">
        <DirectoryLayout
          folders={folders}
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
          onFolderDoubleClick={handleOpenDirectory}
          layout="desktop"
        />
      </div>

      {openWindows.map((window) => (
        <Window
          key={window.id}
          window={window}
          onClose={handleCloseWindow}
          onFocus={handleFocusWindow}
          onOpenDirectory={handleOpenDirectory}
        />
      ))}
    </div>
  );
};

export default Desktop;
