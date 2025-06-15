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
