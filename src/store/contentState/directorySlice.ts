import type { DirectoryEntry } from "../../types/nodeTypes";
import type { SetState, GetState } from "../../types/storeTypes";
import type { WindowOperationsSlice } from "../windowState/windowOperationsSlice";
import type { WindowHistorySlice } from "../windowState/windowHistorySlice";

type DirectoryWindowOperationsSlice = WindowOperationsSlice &
  WindowHistorySlice;

interface DirectoryOperationsActions {
  test: () => void;
  openDirectoryWindow: (directoryNodeId: DirectoryEntry["id"]) => void;
  enterDirectory: (directoryNodeId: DirectoryEntry["id"]) => void;
}

export const createDirectoryWindowOperationsSlice = (
  set: SetState<DirectoryWindowOperationsSlice>,
  get: GetState<DirectoryWindowOperationsSlice>
): DirectoryOperationsActions => ({
  test: () => {
    console.log("test");
  },
  openDirectoryWindow: (directoryNodeId: DirectoryEntry["id"]) => {
    const { isWindowIdOpen, focusWindowByNodeId, openWindow } = get();
    if (isWindowIdOpen(directoryNodeId)) {
      focusWindowByNodeId(directoryNodeId);
    } else {
      const windowHistoryItem = directoryNodeId;
      openWindow(directoryNodeId, windowHistoryItem);
    }
  },
  enterDirectory: (directoryNodeId: DirectoryEntry["id"]) => {
    const { getWindowCurrentItem } = get();
    const currentItem = getWindowCurrentItem(directoryNodeId);
    console.log("currentItem", currentItem);
  },
});
