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
// Context-aware root IDs are now obtained from store methods
import { useStaggeredMessageDelivery } from "../components/applications/whatsApp/hooks/useStaggeredMessageDelivery";
import { NodeDropZoneWrapper } from "@/components/finder/NodeDropZoneWrapper";
import { DesktopLayout } from "@/pages/DesktopLayout";
import { useEffect } from "react";

export const AppLayout = () => {
  const nodeMap = useNewStore((s) => s.nodeMap);
  console.log("DO NOT DELETE THIS LOG: nodeMap", nodeMap);
  const unlockClickOnSomethingAchievement = useNewStore(
    (s) => s.unlockClickOnSomethingAchievement
  );
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  const toggleOS = useNewStore((s) => s.toggleOS);
  const customWallpaper = useNewStore((s) => s.customWallpaper);
  const histories = useNewStore((s) => s.histories);
  const windows = useNewStore((s) => s.windows);
  const getChildrenByParentID = useNewStore((s) => s.getChildrenByParentID);
  const getCurrentRootId = useNewStore((s) => s.getCurrentRootId);
  const updateLegacyFields = useNewStore((s) => s.updateLegacyFields);
  const deleteWindows = useNewStore((s) => s.deleteWindows);

  const currentDesktopRootId = getCurrentRootId("main");
  const nodes = getChildrenByParentID(currentDesktopRootId);
  const wifiEnabled = useNewStore((s) => s.wifiEnabled);

  // Handle staggered message delivery when wifi comes back online
  useStaggeredMessageDelivery(wifiEnabled);

  // Temp debug state
  const getNodeByID = useNewStore((s) => s.getNodeByID);
  const openWindow = useNewStore((s) => s.openWindow);

  // Monitor screen dimensions and update store
  const screenInfo = useScreenMonitor();
  const { isMobile } = screenInfo;

  // Handle context switching when screen size changes
  useEffect(() => {
    console.log("AppLayout: isMobile changed to", isMobile);

    // Update node legacy fields for new context
    updateLegacyFields();

    // Close finder windows since hierarchy changed
    const deletedWindows = deleteWindows(
      (window) => window.applicationRegistryId === "finder"
    );
    if (isMobile) {
      if (operatingSystem !== "mac") {
        toggleOS();
      }
    }

    console.log(
      "AppLayout: closed",
      deletedWindows,
      "finder windows due to context switch"
    );
  }, [isMobile, updateLegacyFields, deleteWindows, operatingSystem, toggleOS]);

  useEffect(() => {
    const browserNode = getNodeByID("browser-desktop");
    if (browserNode && browserNode.type === "application") {
      console.log("AppLayout.tsx: useEffect");

      openWindow(browserNode);
    }
  }, [openWindow, getNodeByID]);

  console.log("AppLayout.tsx: histories", histories);

  // Wifi state for staggered message delivery

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
        {/* <div className="flex-1 min-h-0 w-full">
          <CaptchaPage />
        </div> */}
        {/* <CaptchaPage /> */}

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

        {windows.map((window) => (
          <ResizableWindow
            key={window.windowId}
            window={window}
            isMobile={isMobile}
          />
        ))}

        <Dock />
      </div>
    </div>
  );
};
