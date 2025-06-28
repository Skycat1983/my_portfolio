import { useCallback } from "react";
import { useNodeEvents } from "./hooks/useNodeEvents";
import type { LinkEntry } from "../../types/nodeTypes";
import {
  containerClasses,
  imageSize,
  labelClasses,
  tileFrame,
  tileWrapper,
  titleBase,
} from "./node.styles";
import { useNewStore } from "../../hooks/useStore";

type Props = { link: LinkEntry };

export const LinkNode = ({ link }: Props) => {
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

  // ─────────── render ───────────
  return (
    <>
      <div className={tileFrame}>
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
          className={`${tileWrapper()} ${containerClasses({
            selected: nodeBehavior.isSelected,
            drop: nodeBehavior.isDropTarget,
          })}`}
        >
          <img src={link.image} alt={link.label} className={imageSize} />
        </div>
        <h2 className={`${titleBase} ${labelClasses(nodeBehavior.isSelected)}`}>
          {link.label}
        </h2>
      </div>
    </>
  );
};
