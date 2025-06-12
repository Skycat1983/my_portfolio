import { useCallback } from "react";
import { useNewStore } from "../../hooks/useNewStore";
import { useNodeDrag } from "../../hooks/useNodeDrag";
import type { BrowserEntry } from "../../types/nodeTypes";
import {
  containerClasses,
  imageSize,
  labelClasses,
  tileWrapper,
  titleBase,
  tileFrame,
} from "./node.styles";
import { EDGE, FIREFOX } from "../../constants/images";

type Props = { browser: BrowserEntry };

export const BrowserNode = ({ browser }: Props) => {
  // ─────────── store actions & state ───────────
  const os = useNewStore((s) => s.os);
  const selectNode = useNewStore((s) => s.selectNode);
  const isSelected = useNewStore((s) => s.selectedNodeId === browser.id);
  const openBrowser = useNewStore((s) => s.openBrowser);
  const moveNode = useNewStore((s) => s.moveNode);
  const deleteNode = useNewStore((s) => s.deleteNode);
  const isNodeInTrash = useNewStore((s) => s.isNodeInTrash);

  // ─────────── drag & drop functionality ───────────
  const dragHandlers = useNodeDrag();
  const isDropTarget = dragHandlers.isDropTarget(browser.id);

  // ─────────── click / dbl-click handlers ───────────
  const handleClick = useCallback(() => {
    console.log("Browser single-click:", browser.id);
    selectNode(browser.id);
  }, [browser.id, selectNode]);

  const handleDoubleClick = useCallback(() => {
    console.log("Browser double-click:", browser.id);
    openBrowser();
  }, [browser.id, openBrowser]);

  // ─────────── key handler (ENTER → double-tap) ───────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" && isSelected) {
        e.preventDefault();
        console.log("Browser Enter-press:", browser.id);
      }
      if (e.key === "Delete" && isSelected) {
        e.preventDefault();

        if (isNodeInTrash(browser.id)) {
          deleteNode(browser.id);
        } else {
          moveNode(browser.id, "trash");
        }
      }
    },
    [isSelected, browser.id, moveNode, deleteNode, isNodeInTrash]
  );

  console.log("browser", browser);

  const folderImage = os === "mac" ? FIREFOX : EDGE;

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
        onDragStart={(e) => dragHandlers.handleDragStart(e, browser.id)}
        onDragEnd={dragHandlers.handleDragEnd}
        // Drop target (directories can accept drops)
        onDragOver={(e) => dragHandlers.handleDragOver(e, browser.id)}
        onDragEnter={(e) => dragHandlers.handleDragEnter(e, browser.id)}
        onDragLeave={dragHandlers.handleDragLeave}
        onDrop={(e) => dragHandlers.handleDrop(e, browser.id)}
        className={`${tileWrapper} ${containerClasses({
          selected: isSelected,
          drop: isDropTarget,
        })}`}
      >
        <img src={folderImage} alt={browser.label} className={imageSize} />
      </div>
      <h2 className={`${titleBase} ${labelClasses(isSelected)}`}>
        {browser.label}
      </h2>
    </div>
  );
};
