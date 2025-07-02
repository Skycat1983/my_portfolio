import type { WindowType } from "@/types/storeTypes";
import { getWindowComponent } from "../window/WindowComponentRegistry";

export const WindowContent = ({ window }: { window: WindowType }) => {
  const { windowId, nodeType, nodeId, componentKey } = window;

  console.log("WindowContent in WindowContent.tsx: ", window);

  if (componentKey) {
    const RegistryComponent = getWindowComponent(componentKey);
    if (RegistryComponent) {
      return (
        <RegistryComponent
          windowId={windowId}
          nodeId={nodeId}
          window={window}
        />
      );
    } else {
      console.warn(
        "WindowContent: window componentKey",
        window.componentKey,
        "not found in registry"
      );
    }
  }

  // Fallback for unknown types
  console.warn(
    "WindowContent: no component found for nodeType",
    nodeType,
    "nodeId",
    nodeId
  );
  return null;
};
