import { useState } from "react";
import { DirectoryLayout } from "../components/DirectoryLayout";
import { MenuBar } from "../components/menubar/MenuBar";

const Desktop = () => {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const folders = [
    { label: "Projects" },
    { label: "Stack" },
    { label: "Contact" },
    { label: "About" },
    { label: "Resume" },
  ];

  return (
    <div className="w-screen h-screen bg-gray-900 relative overflow-hidden">
      <MenuBar />
      <div className="p-16 h-full">
        <DirectoryLayout
          folders={folders}
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
        />
      </div>
    </div>
  );
};

export default Desktop;
