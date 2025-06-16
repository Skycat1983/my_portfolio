import { MenubarLayout } from "../components/menubar/MenubarLayout";
import { WindowLayout } from "../components/window/WindowLayout";
import { useNewStore } from "../hooks/useStore";
import { useNodeDrag } from "../hooks/useNodeDrag";
import { BACKGROUND_MAC, BACKGROUND_WIN } from "../constants/images";
import { ResizableWindow } from "../components/window/ResizableWindow";

export const Desktop = () => {
  const unlockClickOnSomethingAchievement = useNewStore(
    (s) => s.unlockClickOnSomethingAchievement
  );
  const getChildrenByParentID = useNewStore((s) => s.getChildrenByParentID);
  const { rootId, operatingSystem, openWindows } = useNewStore();

  //enables drag and drop to and from desktop functionality
  const dragHandlers = useNodeDrag();

  // desktop children/nodes
  const desktopChildren = getChildrenByParentID(rootId);

  const background =
    operatingSystem === "mac" ? BACKGROUND_MAC : BACKGROUND_WIN;

  console.log("desktopChildren", desktopChildren);
  console.log("openWindows", openWindows);

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
      <MenubarLayout />
      <div
        className="p-10 h-full"
        onDragOver={
          dragHandlers
            ? (e) => dragHandlers.handleDragOver(e, rootId)
            : undefined
        }
        onDragEnter={
          dragHandlers
            ? (e) => dragHandlers.handleDragEnter(e, rootId)
            : undefined
        }
        onDragLeave={dragHandlers?.handleDragLeave}
        onDrop={
          dragHandlers ? (e) => dragHandlers.handleDrop(e, rootId) : undefined
        }
      >
        {/* Render all open windows */}
        {openWindows.map((windowState) => (
          <ResizableWindow key={windowState.id} windowId={windowState.id} />
        ))}

        {/* {operatingSystem === "mac" && <Weather />} */}
        <WindowLayout nodes={desktopChildren} layout="desktop" />
      </div>
    </div>
  );
};
