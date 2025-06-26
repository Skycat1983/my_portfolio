import { useNewStore } from "../../hooks/useStore";

import { MacWindowControls } from "../controls/MacWindowControls";
import { WindowsWindowControls } from "../controls/WindowsWindowControls";

export const WindowControls = ({ windowId }: { windowId: string }) => {
  const operatingSystem = useNewStore((state) => state.operatingSystem);
  const closeWindow = useNewStore((state) => state.closeWindow);
  // const minimizeWindow = useNewStore((state) => state.minimizeWindow);
  const updateWindowById = useNewStore((state) => state.updateWindowById);
  const window = useNewStore((state) => state.getWindowById(windowId));

  const toggleMaximizeWindow = () => {
    if (window?.isMaximized) {
      updateWindowById(windowId, { isMaximized: false });
    } else {
      updateWindowById(windowId, { isMaximized: true });
    }
  };
  if (operatingSystem === "mac") {
    return (
      <MacWindowControls
        isMaximized={window?.isMaximized}
        onClose={() => closeWindow(windowId)}
        // onMinimize={() => minimizeWindow(windowId)}
        onMaximize={() => toggleMaximizeWindow()}
      />
    );
  } else if (operatingSystem === "windows") {
    return (
      <WindowsWindowControls
        isMaximized={window?.isMaximized}
        onClose={() => closeWindow(windowId)}
        // onMinimize={() => minimizeWindow(windowId)}
        onMaximize={() => toggleMaximizeWindow()}
      />
    );
  }
};
