import { useNewStore } from "../../../store/useStore";
import type { DirectoryWindow } from "../../../types/storeTypes";
import { DirectoryLayout } from "./DirectoryLayout";

export const DirectoryContent = ({ window }: { window: DirectoryWindow }) => {
  const { nodeId, windowId } = window;
  const getChildrenByParentID = useNewStore((s) => s.getChildrenByParentID);
  const children = getChildrenByParentID(nodeId);
  console.log("children", children);

  return (
    <DirectoryLayout nodes={children} layout="window" windowId={windowId} />
  );
};
