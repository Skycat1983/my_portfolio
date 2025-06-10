import { useStore } from "./useStore";

type DoubleClickContext = "desktop" | "window";

interface UseNodeDoubleClickProps {
  context: DoubleClickContext;
  windowNodeId?: string; // Required when context is "window"
}

export const useNodeDoubleClick = ({
  context,
  windowNodeId,
}: UseNodeDoubleClickProps) => {
  const { getNode, openWindow, navigateInWindow, isDirectChildOfRoot } =
    useStore();

  const handleNodeDoubleClick = (nodeId: string) => {
    console.log(
      `handleNodeDoubleClick in ${context}: Double-clicked nodeId`,
      nodeId
    );

    const node = getNode(nodeId);
    if (!node) return;

    // Handle links - always open URL in new tab
    if (node.type === "link") {
      console.log(
        `handleNodeDoubleClick in ${context}: Opening link`,
        node.url
      );
      window.open(node.url, "_blank");
      return;
    }

    // Handle apps - always open in new windows
    if (node.type === "app") {
      console.log(
        `handleNodeDoubleClick in ${context}: Opening app window`,
        nodeId
      );
      openWindow(nodeId);
      return;
    }

    // Handle directories - behavior depends on context
    if (node.type === "directory") {
      if (context === "desktop") {
        // From desktop: only open window if it's a direct child of root
        if (isDirectChildOfRoot(nodeId)) {
          console.log(
            `handleNodeDoubleClick in ${context}: Opening directory window`,
            nodeId
          );
          openWindow(nodeId);
        }
      } else if (context === "window" && windowNodeId) {
        // From window: navigate within current window
        console.log(
          `handleNodeDoubleClick in ${context}: Navigating to directory`,
          nodeId
        );
        navigateInWindow(windowNodeId, nodeId);
      }
    }
  };

  return { handleNodeDoubleClick };
};
