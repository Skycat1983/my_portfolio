import { Wifi, WifiOff } from "lucide-react";
import { useNewStore } from "@/hooks/useStore";

export const WifiIcon = () => {
  const theme = useNewStore((s) => s.theme);

  const wifiEnabled = useNewStore((s) => s.wifiEnabled);
  const toggleWifi = useNewStore((s) => s.toggleWifi);

  const iconClass =
    theme === "dark"
      ? "cursor-pointer h-4 w-4 text-white"
      : "cursor-pointer h-4 w-4 text-black";

  return (
    <button onClick={() => toggleWifi()}>
      {wifiEnabled ? (
        <Wifi className={iconClass} />
      ) : (
        <WifiOff className={iconClass} />
      )}
    </button>
  );
};
