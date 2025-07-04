import { useCallback } from "react";
import { useNodeEvents } from "./hooks/useNodeEvents";
import type { LinkEntry } from "@/types/nodeTypes";
import {
  getContainerClasses,
  getImageSize,
  getLabelClasses,
  getTileWrapper,
  getTitleFrame,
  getTitleBase,
} from "./node.styles";
import { useNewStore } from "@/hooks/useStore";

type Props = { link: LinkEntry; view: "icons" | "list" | "columns" };

export const LinkNode = ({ link, view }: Props) => {
  const confirmCVCheckedOut = useNewStore((s) => s.confirmCVCheckedOut);
  const confirmRecommendationCheckedOut = useNewStore(
    (s) => s.confirmRecommendationCheckedOut
  );
  const unlockProspectiveEmployerAchievement = useNewStore(
    (s) => s.unlockProspectiveEmployerAchievement
  );

  // ─────────── node-specific activation ───────────
  const handleActivate = useCallback(() => {
    if (link.id === "resume") {
      confirmCVCheckedOut();
      unlockProspectiveEmployerAchievement();
    } else if (link.id === "recommendation") {
      confirmRecommendationCheckedOut();
      unlockProspectiveEmployerAchievement();
    }
    console.log("Link activate: opening URL", link.url);
    window.open(link.url, "_blank", "noopener,noreferrer");
  }, [
    link,
    confirmCVCheckedOut,
    confirmRecommendationCheckedOut,
    unlockProspectiveEmployerAchievement,
  ]);

  // ─────────── shared node behavior ───────────
  const nodeBehavior = useNodeEvents({
    id: link.id,
    nodeType: "link",
    enableLogging: true,
    onActivate: handleActivate,
  });

  const showLabel = link.parentId !== "dock-root";

  // ─────────── render ───────────
  return (
    <>
      <div className={getTitleFrame(view)}>
        <div
          {...nodeBehavior.accessibilityProps}
          // Click handlers
          onClick={nodeBehavior.handleClick}
          onDoubleClick={nodeBehavior.handleDoubleClick}
          onKeyDown={nodeBehavior.handleKeyDown}
          // Drag source
          {...nodeBehavior.dragSourceHandlers}
          // Drop target (empty for non-directories)
          {...nodeBehavior.dropTargetHandlers}
          className={`${getTileWrapper(view)} ${getContainerClasses({
            selected: nodeBehavior.isSelected,
            drop: nodeBehavior.isDropTarget,
            view,
          })}`}
        >
          <img
            src={link.image}
            alt={link.label}
            className={getImageSize(view)}
          />
        </div>
        {showLabel && (
          <h2
            className={`${getTitleBase(view)} ${getLabelClasses(
              view,
              nodeBehavior.isSelected
            )}`}
          >
            {link.label}
          </h2>
        )}
      </div>
    </>
  );
};
