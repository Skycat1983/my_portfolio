import {
  BACKGROUND_IPHONE,
  BACKGROUND_MAC,
  BACKGROUND_WIN,
} from "@/constants/images";
import { useNewStore } from "@/hooks/useStore";
import { useScreenMonitor } from "@/hooks/useScreenSize";
import Dock from "@/components/dock/Dock";
import { MenubarLayout } from "@/components/menubar/MenubarLayout";
import { Widgets } from "@/components/widgets/WidgetsLayout";
// Context-aware root IDs are now obtained from store methods
import { useStaggeredMessageDelivery } from "@/components/applications/whatsApp/hooks/useStaggeredMessageDelivery";
import { NodeDropZoneWrapper } from "@/components/finder/NodeDropZoneWrapper";
import { DesktopLayout } from "@/pages/DesktopLayout";

export const InceptionPage = () => {
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  const customWallpaper = useNewStore((s) => s.customWallpaper);
  const getChildrenByParentID = useNewStore((s) => s.getChildrenByParentID);
  const getCurrentRootId = useNewStore((s) => s.getCurrentRootId);

  const currentDesktopRootId = getCurrentRootId("main");
  const nodes = getChildrenByParentID(currentDesktopRootId);
  const wifiEnabled = useNewStore((s) => s.wifiEnabled);

  // Handle staggered message delivery when wifi comes back online
  useStaggeredMessageDelivery(wifiEnabled);

  // Temp debug state
  // const getNodeByID = useNewStore((s) => s.getNodeByID);
  // const openWindow = useNewStore((s) => s.openWindow);

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
        // unlockClickOnSomethingAchievement();
      }}
    >
      <MenubarLayout />

      {/* MAIN CONTENT  mobile = col, tablet = row , desktop = row*/}
      <div className="flex flex-col md:flex-row h-full w-full gap-10 p-10">
        {/* WIDGETS */}
        <Widgets />

        {/* DESKTOP NODES */}
        <div className="flex-1 min-h-0 w-full">
          <NodeDropZoneWrapper
            nodeId={currentDesktopRootId}
            shrinkToFit={false}
          >
            <DesktopLayout nodes={nodes} />
          </NodeDropZoneWrapper>
          {/* <ListView nodes={nodes} /> */}
        </div>

        <Dock />
      </div>
    </div>
  );
};
