import { MenubarLayout } from "../components/menubar/MenubarLayout";
import { DirectoryLayout } from "../components/apps/directory/DirectoryLayout";
import { useNodeDrag } from "../components/nodes/hooks/useNodeDrag";
import { BACKGROUND_MAC, BACKGROUND_WIN } from "../constants/images";
import { ResizableWindow } from "../components/window/ResizableWindow";
import { useNewStore } from "../hooks/useStore";
import { Weather } from "../components/widgets/Weather";
import Dock from "../components/dock/Dock";
import { GridLayout, GridCell, GridLayoutDemo } from "../components/GridLayout";
import { MenuBar } from "../components/menubar/MenuBar";

export const AppLayout = () => {
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
      {/* main content */}
      <div className="grid grid-cols-6 grid-rows-4 h-full w-full gap-10 p-10">
        <div className="col-span-6 row-span-1 md:col-span-2 md:row-span-4 bg-red-100/10 h-full">
          <p>widgets</p>
        </div>
        <div className="col-span-6 row-span-4 md:col-span-4 md:row-span-4 bg-blue-100/10 h-full">
          <p>desktop item</p>
        </div>
      </div>
    </div>
  );
};

{
  /* <GridLayout>
        <GridCell
          colSpan={6}
          className={operatingSystem === "mac" ? "order-first" : "order-last"}
        >
          <MenuBar />
        </GridCell>
        <GridCell colSpan={2} bgColor="" className="h-full">
          <p>widgets</p>
        </GridCell>
        <GridCell colSpan={4} bgColor="" className="h-full">
          <p>desktop item</p>
        </GridCell>
      </GridLayout> */
}
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
