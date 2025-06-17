import { useNewStore } from "../../store/useStore";
import { MacWindowControls } from "../controls/MacWindowControls";
import { WindowsWindowControls } from "../controls/WindowsWindowControls";

export const WindowControls = ({ windowId }: { windowId: string }) => {
  const operatingSystem = useNewStore((state) => state.operatingSystem);
  const closeWindow = useNewStore((state) => state.closeWindow);
  const minimizeWindow = useNewStore((state) => state.minimizeWindow);
  const maximizeWindow = useNewStore((state) => state.maximizeWindow);

  if (operatingSystem === "mac") {
    return (
      <MacWindowControls
        onClose={() => closeWindow(windowId)}
        onMinimize={() => minimizeWindow(windowId)}
        onMaximize={() => maximizeWindow(windowId)}
      />
    );
  } else if (operatingSystem === "windows") {
    return (
      <WindowsWindowControls
        onClose={() => closeWindow(windowId)}
        onMinimize={() => minimizeWindow(windowId)}
        onMaximize={() => maximizeWindow(windowId)}
      />
    );
  }
};
