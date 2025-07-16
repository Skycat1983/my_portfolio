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
import { NodeSwitch } from "@/components/nodes/NodeSwitch";

export const InceptionPage = () => {
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  const customWallpaper = useNewStore((s) => s.customWallpaper);
  const getChildrenByParentID = useNewStore((s) => s.getChildrenByParentID);
  const getCurrentRootId = useNewStore((s) => s.getCurrentRootId);

  const currentDesktopRootId = getCurrentRootId("main");
  const nodes = getChildrenByParentID(currentDesktopRootId);
  const wifiEnabled = useNewStore((s) => s.wifiEnabled);
  const applicationId = "browser";
  const window = useNewStore((s) => s.findWindowByApplicationId(applicationId));

  console.log("inception window", window);

  // Handle staggered message delivery when wifi comes back online
  useStaggeredMessageDelivery(wifiEnabled);

  // Temp debug state
  // const getNodeByID = useNewStore((s) => s.getNodeByID);
  // const openWindow = useNewStore((s) => s.openWindow);

  // Monitor screen dimensions and update store
  const screenInfo = useScreenMonitor();
  const { isMobile } = screenInfo;

  let screen: "mobile" | "tablet" | "desktop" = "desktop";

  if (!window) {
    return <div>No window found</div>;
  }

  if (window.width > 1024) {
    screen = "desktop";
  } else if (window.width > 768 && window.width < 1024) {
    screen = "tablet";
  } else {
    screen = "mobile";
  }

  console.log("inception screen", screen);

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
          {screen === "mobile" && (
            <div className="block lg:hidden">
              <div className="grid grid-cols-[repeat(auto-fit,_minmax(80px,_1fr))] justify-items-center gap-x-6 gap-y-12 w-full md:justify-items-start">
                {nodes.map((node) => (
                  <div key={node.id} className="w-18 rounded-xl md:w-24">
                    <NodeSwitch
                      node={node}
                      windowId={window.windowId}
                      view="icons"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {screen !== "mobile" && (
            <div
              className={`hidden lg:flex flex-col w-full gap-10 space-y-10 h-full content-start ${
                operatingSystem === "windows"
                  ? "flex-wrap"
                  : "flex-wrap-reverse"
              }`}
            >
              {nodes.map((node) => (
                <div key={node.id} className="w-20 flex-shrink-0">
                  <NodeSwitch
                    node={node}
                    windowId={window.windowId}
                    view="icons"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <Dock />
      </div>
    </div>
  );
};
