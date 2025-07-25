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
import { useStaggeredMessageDelivery } from "../components/applications/whatsApp/hooks/useStaggeredMessageDelivery";
import { NodeDropZoneWrapper } from "@/components/finder/NodeDropZoneWrapper";
import { DesktopLayout } from "@/pages/DesktopLayout";
import { useEffect, useMemo, useCallback } from "react";
import { desktopRootId, mobileRootId } from "@/constants/nodeHierarchy";

export const AppLayout = () => {
  const nodeMap = useNewStore((s) => s.nodeMap);
  const unlockClickOnSomethingAchievement = useNewStore(
    (s) => s.unlockClickOnSomethingAchievement
  );
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  const toggleOS = useNewStore((s) => s.toggleOS);
  const customWallpaper = useNewStore((s) => s.customWallpaper);
  const windows = useNewStore((s) => s.windows);
  const getCurrentRootId = useNewStore((s) => s.getCurrentRootId);
  const updateLegacyFields = useNewStore((s) => s.updateLegacyFields);
  const deleteWindows = useNewStore((s) => s.deleteWindows);
  const closeWindow = useNewStore((s) => s.closeWindow);

  const currentDesktopRootId = getCurrentRootId("main");

  const wifiEnabled = useNewStore((s) => s.wifiEnabled);

  const histories = useNewStore((s) => s.histories);

  console.warn("HISTORIES", histories);

  // Handle staggered message delivery when wifi comes back online
  useStaggeredMessageDelivery(wifiEnabled);

  // Monitor screen dimensions and update store
  const screenInfo = useScreenMonitor();
  const { isMobile } = screenInfo;

  const baseId = isMobile ? mobileRootId : desktopRootId;

  const nodesToRender = useMemo(() => {
    const baseNode = nodeMap[baseId];
    if (!baseNode || baseNode.type !== "directory") return [];

    return baseNode.children.map((childId) => nodeMap[childId]);
  }, [nodeMap, baseId]);

  // Memoized function to close specific windows without depending on windows array
  const closeSpecificWindows = useCallback(() => {
    const currentWindows = useNewStore.getState().windows;

    currentWindows.forEach((window) => {
      closeWindow(window.windowId);
    });
  }, [closeWindow]);

  // Handle context switching when screen size changes
  useEffect(() => {
    // Update node legacy fields for new context
    updateLegacyFields();

    // Close finder windows since hierarchy changed
    if (isMobile) {
      if (operatingSystem !== "mac") {
        toggleOS();
        // we delete the windows because the directory layouts vary for mobile and desktop
      }
    }
  }, [isMobile, updateLegacyFields, deleteWindows, operatingSystem, toggleOS]);

  useEffect(() => {
    // Update node legacy fields for new context

    // Close all windows since hierarchy changed and automatically clean up their histories
    closeSpecificWindows();
  }, [isMobile, closeSpecificWindows]); // Only run when isMobile changes
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
      {/* <StocksMain /> */}
      {/* MAIN CONTENT  mobile = col, tablet = row , desktop = row*/}
      <div className="flex flex-col md:flex-row h-full w-full gap-10 p-10">
        <Widgets />

        {/* DESKTOP NODES */}
        <div className="flex-1 min-h-0 w-full">
          <NodeDropZoneWrapper
            nodeId={currentDesktopRootId}
            shrinkToFit={false}
          >
            <DesktopLayout nodes={nodesToRender} />
          </NodeDropZoneWrapper>
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
