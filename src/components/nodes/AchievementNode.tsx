import { useCallback } from "react";
import { useNodeBehavior } from "../../hooks/useNodeEvents";
import { useNewStore } from "../../hooks/useStore";
import type { AchievementEntry } from "../../types/nodeTypes";
import { NotificationBadge } from "../notification/NotificationBadge";
import {
  containerClasses,
  imageSize,
  labelClasses,
  tileFrame,
  tileWrapper,
  titleBase,
} from "./node.styles";

type Props = { achievement: AchievementEntry };

export const AchievementNode = ({ achievement }: Props) => {
  // ─────────── achievement state ───────────
  const unseenAchievements = useNewStore((s) => s.unseenAchievements);
  const markAchievementsAsSeen = useNewStore((s) => s.markAchievementsAsSeen);
  const unlockAccessAchievements = useNewStore(
    (s) => s.unlockAccessAchievements
  );

  // ─────────── node-specific activation ───────────
  const handleActivate = useCallback(() => {
    console.log("Achievement activate in AchievementNode:", achievement.id);
    // Reset the notification counter when achievement node is opened
    if (unseenAchievements > 0) {
      markAchievementsAsSeen();
    }
    unlockAccessAchievements();
  }, [
    achievement.id,
    unseenAchievements,
    markAchievementsAsSeen,
    unlockAccessAchievements,
  ]);

  // ─────────── shared node behavior ───────────
  const nodeBehavior = useNodeBehavior({
    id: achievement.id,
    nodeType: "achievement",
    enableLogging: true,
    onActivate: handleActivate,
  });

  // ─────────── render ───────────
  return (
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
        className={`${tileWrapper} ${containerClasses({
          selected: nodeBehavior.isSelected,
          drop: nodeBehavior.isDropTarget,
        })} relative`}
      >
        <img
          src={achievement.image}
          alt={achievement.label}
          className={imageSize}
        />

        {/* Notification Badge */}
        <NotificationBadge count={unseenAchievements} />
      </div>

      <h2 className={`${titleBase} ${labelClasses(nodeBehavior.isSelected)}`}>
        {achievement.label}
      </h2>
    </div>
  );
};
