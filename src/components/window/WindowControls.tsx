import { useNewStore } from "@/hooks/useStore";

import { MacWindowControls } from "../controls/MacWindowControls";
import { WindowsWindowControls } from "../controls/WindowsWindowControls";
import { MobileWindowControls } from "../controls/MobileWindowControls";
import type { WindowId } from "@/constants/applicationRegistry";

export const WindowControls = ({ windowId }: { windowId: WindowId }) => {
  const operatingSystem = useNewStore((state) => state.operatingSystem);
  const screenDimensions = useNewStore((state) => state.screenDimensions);
  const closeWindow = useNewStore((state) => state.closeWindow);
  // const minimizeWindow = useNewStore((state) => state.minimizeWindow);
  const updateWindow = useNewStore((state) => state.updateWindow);
  const window = useNewStore((state) =>
    state.findWindow((w) => w.windowId === windowId)
  );

  console.log("WindowControls: window", window);
  const toggleMaximizeWindow = () => {
    if (window?.isMaximized) {
      updateWindow(windowId, { isMaximized: false });
    } else {
      updateWindow(windowId, { isMaximized: true });
    }
  };

  // On mobile, always use mobile controls regardless of OS
  if (screenDimensions.isMobile) {
    return <MobileWindowControls onClose={() => closeWindow(windowId)} />;
  }

  // Desktop: use OS-specific controls
  if (operatingSystem === "mac") {
    return (
      <MacWindowControls
        isMaximized={window?.isMaximized}
        onClose={() => closeWindow(windowId)}
        // onMinimize={() => minimizeWindow(windowId)}
        onMaximize={() => toggleMaximizeWindow()}
        isFixed={window?.fixed}
      />
    );
  } else if (operatingSystem === "windows") {
    return (
      <WindowsWindowControls
        isMaximized={window?.isMaximized}
        onClose={() => closeWindow(windowId)}
        // onMinimize={() => minimizeWindow(windowId)}
        onMaximize={() => toggleMaximizeWindow()}
        isFixed={window?.fixed}
      />
    );
  }
};
