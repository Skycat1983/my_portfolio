import { useCallback } from "react";
import { useNewStore } from "../../hooks/useNewStore";
import type { DirectoryEntry } from "../../types/nodeTypes";
import {
  containerClasses,
  imageSize,
  labelClasses,
  tileWrapper,
  titleBase,
  tileFrame,
} from "./node.styles";

type Props = { directory: DirectoryEntry };

export const DirectoryNode = ({ directory }: Props) => {
  // ─────────── store actions & state ───────────
  const selectNode = useNewStore((s) => s.selectNode);
  const handleDirectoryDoubleTap = useNewStore(
    (s) => s.handleDirectoryDoubleClick
  );
  const isSelected = useNewStore((s) => s.selectedNodeId === directory.id);

  // ─────────── click / dbl-click handlers ───────
  const handleClick = useCallback(() => {
    console.log("Directory single-click:", directory.id);
    selectNode(directory.id);
  }, [directory.id, selectNode]);

  const handleDoubleClick = useCallback(() => {
    console.log("Directory double-click:", directory.id);
    handleDirectoryDoubleTap(directory.id);
  }, [directory.id, handleDirectoryDoubleTap]);

  // (DnD drop target still hard-coded off)
  const isDropTarget = false;

  // ─────────── render ───────────
  return (
    <div className={tileFrame}>
      <div
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        className={`${tileWrapper} ${containerClasses({
          selected: isSelected,
          drop: isDropTarget,
        })}`}
      >
        <img
          src={directory.image}
          alt={directory.label}
          className={imageSize}
        />
      </div>
      <h2 className={`${titleBase} ${labelClasses(isSelected)}`}>
        {directory.label}
      </h2>
    </div>
  );
};
