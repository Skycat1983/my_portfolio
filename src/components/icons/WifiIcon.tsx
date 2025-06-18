import { Wifi, WifiOff } from "lucide-react";
import { useNewStore } from "../../hooks/useStore";

export const WifiIcon = () => {
  const wifiEnabled = useNewStore((s) => s.wifiEnabled);
  const toggleWifi = useNewStore((s) => s.toggleWifi);

  const iconClass = "cursor-pointer h-4 w-4 text-white";

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
