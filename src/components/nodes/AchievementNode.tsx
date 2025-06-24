import { useCallback } from "react";
import { useNodeEvents } from "./hooks/useNodeEvents";
import { useNewStore } from "../../hooks/useStore";
import type { AchievementEntry } from "../../types/nodeTypes";
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
  const openWindow = useNewStore((s) => s.openWindow);
  // ─────────── node-specific activation ───────────
  const handleActivate = useCallback(() => {
    console.log("Achievement activate in AchievementNode:", achievement.id);
    // Reset the notification counter when achievement node is opened
    if (unseenAchievements > 0) {
      markAchievementsAsSeen();
    }
    unlockAccessAchievements();
    openWindow(achievement, achievement.id);
  }, [
    achievement,
    unseenAchievements,
    markAchievementsAsSeen,
    unlockAccessAchievements,
    openWindow,
  ]);

  // ─────────── shared node behavior ───────────
  const nodeBehavior = useNodeEvents({
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

interface NotificationBadgeProps {
  count: number;
  className?: string;
}

export const NotificationBadge = ({
  count,
  className = "",
}: NotificationBadgeProps) => {
  if (count <= 0) return null;

  return (
    <div
      className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center shadow-lg border-2 border-white ${className}`}
      style={{ zIndex: 10 }}
    >
      {count > 99 ? "99+" : count}
    </div>
  );
};
