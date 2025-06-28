import { useNodeDrag } from "../components/nodes/hooks/useNodeDrag";
import { BACKGROUND_MAC, BACKGROUND_WIN } from "../constants/images";
import { ResizableWindow } from "../components/window/ResizableWindow";
import { useNewStore } from "../hooks/useStore";
import Dock from "../components/dock/Dock";
import { MenuBar } from "../components/menubar/MenuBar";
import { Widgets } from "../components/widgets/WidgetsLayout";
import { DirectoryLayout } from "../components/apps/directory/DirectoryLayout";

export const AppLayout = () => {
  const nodeMap = useNewStore((s) => s.nodeMap);
  console.log("nodeMap", nodeMap);
  const unlockClickOnSomethingAchievement = useNewStore(
    (s) => s.unlockClickOnSomethingAchievement
  );
  const getChildrenByParentID = useNewStore((s) => s.getChildrenByParentID);
  const rootId = useNewStore((s) => s.rootId);
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  const openWindows = useNewStore((s) => s.openWindows);

  //enables drag and drop to and from desktop functionality
  const dragHandlers = useNodeDrag();

  // desktop children/nodes
  const desktopChildren = getChildrenByParentID(rootId);

  const background =
    operatingSystem === "mac" ? BACKGROUND_MAC : BACKGROUND_WIN;

  const flexDirection =
    operatingSystem === "mac" ? "flex-col" : "flex-col-reverse";

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

  return (
    <div
      className={`w-screen h-screen bg-gray-900 relative overflow-hidden bg-cover bg-center bg-no-repeat flex ${flexDirection}`}
      style={{
        backgroundImage: `url(${background})`,
      }}
      onClick={() => {
        console.log("clicked");
        unlockClickOnSomethingAchievement();
      }}
    >
      <MenuBar />

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
        <div className="bg-blue-100/10 h-full w-full">
          <DirectoryLayout
            nodes={mobileNodes}
            layout="desktop"
            windowId="desktop-root"
          />
          {/* {desktopChildren.map((node) => (
            <NodeSwitch key={node.id} node={node} />
          ))} */}
        </div>

        {openWindows.map((window) => (
          <ResizableWindow key={window.windowId} window={window} />
        ))}

        <Dock />
      </div>
    </div>
  );
};

{
  /* <div className="hidden md:block">
        <MenubarLayout />
      </div>

      <div
        className="p-10 h-full"
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
        {openWindows.map((window) => (
          <ResizableWindow key={window.windowId} window={window} />
        ))}

        {operatingSystem === "mac" && <Weather />}
        <DirectoryLayout
          nodes={desktopChildren}
          layout="desktop"
          windowId="desktop-root"
        />
      </div>

      {operatingSystem === "mac" && <Dock />} */
}
