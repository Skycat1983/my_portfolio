import { useNewStore } from "@/hooks/useStore";

export const useMessageStatus = () => {
  const isInitialized = useNewStore((s) => s.whatsApp.isInitialized);

  const wifiEnabled = useNewStore((s) => s.wifiEnabled);

  const isOnline = wifiEnabled;

  return { isOnline };
};
