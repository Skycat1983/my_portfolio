import { useNodeDrag } from "../components/nodes/hooks/useNodeDrag";
import { BACKGROUND_MAC, BACKGROUND_WIN } from "../constants/images";
import { ResizableWindow } from "../components/window/ResizableWindow";
import { useNewStore } from "../hooks/useStore";
import Dock from "../components/dock/Dock";
import { MenubarLayout } from "../components/menubar/MenubarLayout";
import { Widgets } from "../components/widgets/WidgetsLayout";
import { DirectoryLayout } from "../components/apps/directory/DirectoryLayout";

export const AppLayout = () => {
  const nodeMap = useNewStore((s) => s.nodeMap);
  console.log("nodeMap", nodeMap);
  const unlockClickOnSomethingAchievement = useNewStore(
    (s) => s.unlockClickOnSomethingAchievement
  );
  // const getChildrenByParentID = useNewStore((s) => s.getChildrenByParentID);
  const rootId = useNewStore((s) => s.rootId);
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  const openWindows = useNewStore((s) => s.openWindows);

  //enables drag and drop to and from desktop functionality
  const dragHandlers = useNodeDrag();

  // desktop children/nodes (using mobileNodes instead for now)
  // const desktopChildren = getChildrenByParentID(rootId);

  const background =
    operatingSystem === "mac" ? BACKGROUND_MAC : BACKGROUND_WIN;

  const mobileNodeKeys = [
    "gtaiv",
    "geo",
    "achievements",
    "portfolio",
    "SkyNot_download",
    "roboCrop_download",
  ];

  const mobileNodes = mobileNodeKeys.map((key) => nodeMap[key]);
  console.log("mobileNodes", mobileNodes);

  const padding = operatingSystem === "mac" ? "pt-10" : "pb-10";

  return (
    <div
      className={`w-screen h-screen bg-gray-900 relative overflow-hidden bg-cover bg-center bg-no-repeat ${padding}`}
      style={{
        backgroundImage: `url(${background})`,
      }}
      onClick={() => {
        console.log("clicked");
        unlockClickOnSomethingAchievement();
      }}
    >
      <MenubarLayout />

      {/* MAIN CONTENT  mobile = col, tablet = row , desktop = row*/}
      <div
        className="flex flex-col md:flex-row h-full w-full gap-10 p-10"
        onDragOver={
          dragHandlers
            ? (e) => {
                return dragHandlers.handleDragOver(e, rootId);
              }
            : undefined
        }
        onDragEnter={
          dragHandlers
            ? (e) => {
                return dragHandlers.handleDragEnter(e, rootId);
              }
            : undefined
        }
        onDragLeave={(e) => {
          return dragHandlers?.handleDragLeave(e);
        }}
        onDrop={
          dragHandlers
            ? (e) => {
                return dragHandlers.handleDrop(e, rootId);
              }
            : undefined
        }
      >
        {/* WIDGETS */}
        <Widgets />

        {/* DESKTOP NODES */}
        <div className="flex-1 min-h-0 w-full">
          <DirectoryLayout nodes={mobileNodes} />
        </div>

        {openWindows.map((window) => (
          <ResizableWindow key={window.windowId} window={window} />
        ))}

        <Dock />
      </div>
    </div>
  );
};
