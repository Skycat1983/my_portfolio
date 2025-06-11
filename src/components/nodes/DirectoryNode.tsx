import { useCallback } from "react";
import { useNewStore } from "../../hooks/useNewStore";
import { useNodeDrag } from "../../hooks/useNodeDrag";
import type { DirectoryEntry } from "../../types/nodeTypes";
import {
  containerClasses,
  imageSize,
  labelClasses,
  tileWrapper,
  titleBase,
  tileFrame,
} from "./node.styles";
import { FOLDER_MS } from "../../constants/images";
import { FOLDER_OS } from "../../constants/images";

type Props = { directory: DirectoryEntry };

export const DirectoryNode = ({ directory }: Props) => {
  // ─────────── store actions & state ───────────
  const os = useNewStore((s) => s.os);
  const selectNode = useNewStore((s) => s.selectNode);
  const handleDirectoryOpen = useNewStore((s) => s.handleDirectoryOpen);
  const isSelected = useNewStore((s) => s.selectedNodeId === directory.id);
  const moveNode = useNewStore((s) => s.moveNode);
  const deleteNode = useNewStore((s) => s.deleteNode);
  const isNodeInTrash = useNewStore((s) => s.isNodeInTrash);

  // ─────────── drag & drop functionality ───────────
  const dragHandlers = useNodeDrag();
  const isDropTarget = dragHandlers.isDropTarget(directory.id);

  // ─────────── click / dbl-click handlers ───────────
  const handleClick = useCallback(() => {
    console.log("Directory single-click:", directory.id);
    selectNode(directory.id);
  }, [directory.id, selectNode]);

  const handleDoubleClick = useCallback(() => {
    console.log("Directory double-click:", directory.id);
    handleDirectoryOpen(directory.id);
  }, [directory.id, handleDirectoryOpen]);

  // ─────────── key handler (ENTER → double-tap) ───────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" && isSelected) {
        e.preventDefault();
        console.log("Directory Enter-press:", directory.id);
      }
      if (e.key === "Delete" && isSelected) {
        e.preventDefault();

        if (isNodeInTrash(directory.id)) {
          deleteNode(directory.id);
        } else {
          moveNode(directory.id, "trash");
        }
      }
    },
    [isSelected, directory.id, moveNode, deleteNode, isNodeInTrash]
  );

  const folderImage = os === "mac" ? FOLDER_OS : FOLDER_MS;

  // ─────────── render ───────────
  return (
    <div className={tileFrame}>
      <div
        role="button" // tells screen-readers this is clickable
        tabIndex={0} // makes the div focusable → receives key events
        aria-selected={isSelected} // optional, for accessibility
        // Click handlers
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        // NEW: key handler
        onKeyDown={handleKeyDown}
        // Drag source (can be dragged)
        draggable="true"
        onDragStart={(e) => dragHandlers.handleDragStart(e, directory.id)}
        onDragEnd={dragHandlers.handleDragEnd}
        // Drop target (directories can accept drops)
        onDragOver={(e) => dragHandlers.handleDragOver(e, directory.id)}
        onDragEnter={(e) => dragHandlers.handleDragEnter(e, directory.id)}
        onDragLeave={dragHandlers.handleDragLeave}
        onDrop={(e) => dragHandlers.handleDrop(e, directory.id)}
        className={`${tileWrapper} ${containerClasses({
          selected: isSelected,
          drop: isDropTarget,
        })}`}
      >
        <img src={folderImage} alt={directory.label} className={imageSize} />
      </div>
      <h2 className={`${titleBase} ${labelClasses(isSelected)}`}>
        {directory.label}
      </h2>
    </div>
  );
};
