import { MenubarLayout } from "../components/menubar/MenubarLayout";
import { DirectoryLayout } from "../components/apps/directory/DirectoryLayout";
import { useNodeDrag } from "../components/nodes/hooks/useNodeDrag";
import { BACKGROUND_MAC, BACKGROUND_WIN } from "../constants/images";
import { ResizableWindow } from "../components/window/ResizableWindow";
import { useNewStore } from "../hooks/useStore";
import { Weather } from "../components/widgets/WeatherWidget";
import Dock from "../components/dock/Dock";
import { desktopRootId } from "../constants/nodes";

export const DesktopLayout = () => {
  const unlockClickOnSomethingAchievement = useNewStore(
    (s) => s.unlockClickOnSomethingAchievement
  );
  const getChildrenByParentID = useNewStore((s) => s.getChildrenByParentID);
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  const openWindows = useNewStore((s) => s.openWindows);

  //enables drag and drop to and from desktop functionality
  const dragHandlers = useNodeDrag();

  // desktop children/nodes
  const desktopChildren = getChildrenByParentID(desktopRootId);

  const background =
    operatingSystem === "mac" ? BACKGROUND_MAC : BACKGROUND_WIN;

  return (
    <div
      // className="w-screen h-screen bg-gray-900 relative overflow-hidden background-image"
      className="w-screen h-screen bg-gray-900 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${background})`,
      }}
      onClick={() => {
        console.log("clicked");
        unlockClickOnSomethingAchievement();
      }}
    >
      <div className="hidden md:block">
        <MenubarLayout />
      </div>

      <div
        className="p-10 h-full"
        onDragOver={
          dragHandlers
            ? (e) => {
                return dragHandlers.handleDragOver(e, desktopRootId);
              }
            : undefined
        }
        onDragEnter={
          dragHandlers
            ? (e) => {
                return dragHandlers.handleDragEnter(e, desktopRootId);
              }
            : undefined
        }
        onDragLeave={(e) => {
          return dragHandlers?.handleDragLeave(e);
        }}
        onDrop={
          dragHandlers
            ? (e) => {
                return dragHandlers.handleDrop(e, desktopRootId);
              }
            : undefined
        }
      >
        {/* Render all open windows */}
        {openWindows.map((window) => (
          <ResizableWindow key={window.windowId} window={window} />
        ))}
        {/* <GeoGame /> */}

        {operatingSystem === "mac" && <Weather />}
        <DirectoryLayout nodes={desktopChildren} />
      </div>

      {/* Dock - positioned outside the main content area to avoid drag/drop conflicts */}
      {operatingSystem === "mac" && <Dock />}
    </div>
  );
};
