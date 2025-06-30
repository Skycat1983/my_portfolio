import { BACKGROUND_MAC, BACKGROUND_WIN } from "../constants/images";
import { ResizableWindow } from "../components/window/ResizableWindow";
import { useNewStore } from "../hooks/useStore";
import { useScreenMonitor } from "../hooks/useScreenSize";
import Dock from "../components/dock/Dock";
import { MenubarLayout } from "../components/menubar/MenubarLayout";
import { Widgets } from "../components/widgets/WidgetsLayout";
import { DirectoryContent } from "../components/apps/directory/DirectoryContent";

export const AppLayout = () => {
  const nodeMap = useNewStore((s) => s.nodeMap);
  console.log("nodeMap", nodeMap);
  const unlockClickOnSomethingAchievement = useNewStore(
    (s) => s.unlockClickOnSomethingAchievement
  );
  const rootId = useNewStore((s) => s.rootId);
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  const openWindows = useNewStore((s) => s.openWindows);

  // Monitor screen dimensions and update store
  const screenInfo = useScreenMonitor();
  console.log("screenInfo in AppLayout: ", screenInfo);

  const background =
    operatingSystem === "mac" ? BACKGROUND_MAC : BACKGROUND_WIN;

  // const mobileNodeKeys = [
  //   "gtaiv",
  //   "geo",
  //   "achievements",
  //   "portfolio",
  //   "SkyNot_download",
  //   "roboCrop_download",
  // ];

  // const mobileNodes = mobileNodeKeys.map((key) => nodeMap[key]);
  // console.log("mobileNodes", mobileNodes);

  const padding = operatingSystem === "mac" ? "md:pt-10" : "md:pb-10";

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
      <div className="flex flex-col md:flex-row h-full w-full gap-10 p-10">
        {/* WIDGETS */}
        <Widgets />

        {/* DESKTOP NODES */}
        <div className="flex-1 min-h-0 w-full">
          {/* <DirectoryLayout nodes={nodesToRender} /> */}
          <DirectoryContent nodeId={rootId} />
        </div>

        {openWindows.map((window) => (
          <ResizableWindow key={window.windowId} window={window} />
        ))}

        <Dock />
      </div>
    </div>
  );
};
