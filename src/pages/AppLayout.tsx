import {
  BACKGROUND_IPHONE,
  BACKGROUND_MAC,
  BACKGROUND_WIN,
} from "../constants/images";
import { ResizableWindow } from "../components/window/ResizableWindow";
import { useNewStore } from "../hooks/useStore";
import { useScreenMonitor } from "../hooks/useScreenSize";
import Dock from "../components/dock/Dock";
import { MenubarLayout } from "../components/menubar/MenubarLayout";
import { Widgets } from "../components/widgets/WidgetsLayout";
import { DirectoryContent } from "../components/applications/directory/DirectoryContent";
import { desktopRootId } from "../constants/nodeHierarchy";
import { useStaggeredMessageDelivery } from "../components/applications/whatsApp/hooks/useStaggeredMessageDelivery";

export const AppLayout = () => {
  const nodeMap = useNewStore((s) => s.nodeMap);
  console.log("DO NOT DELETE THIS LOG: nodeMap", nodeMap);
  const unlockClickOnSomethingAchievement = useNewStore(
    (s) => s.unlockClickOnSomethingAchievement
  );
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  const customWallpaper = useNewStore((s) => s.customWallpaper);
  const openWindows = useNewStore((s) => s.openWindows);
  const histories = useNewStore((s) => s.histories);
  console.log("AppLayout.tsx: openWindows", openWindows);
  console.log("AppLayout.tsx: histories", histories);

  // Wifi state for staggered message delivery
  const wifiEnabled = useNewStore((s) => s.wifiEnabled);

  // Handle staggered message delivery when wifi comes back online
  useStaggeredMessageDelivery(wifiEnabled);

  // Monitor screen dimensions and update store
  const screenInfo = useScreenMonitor();
  const { isMobile } = screenInfo;

  const background =
    customWallpaper ||
    (isMobile
      ? BACKGROUND_IPHONE
      : operatingSystem === "mac"
      ? BACKGROUND_MAC
      : BACKGROUND_WIN);

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
          <DirectoryContent windowId={desktopRootId} nodeId={desktopRootId} />
          {/* <ListView nodes={nodes} /> */}
        </div>

        {openWindows.map((window) => (
          <ResizableWindow key={window.windowId} window={window} />
        ))}

        <Dock />
      </div>
    </div>
  );
};
