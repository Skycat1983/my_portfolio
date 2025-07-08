import { useNewStore } from "@/hooks/useStore";
import { useWhatsAppHistory } from "./useWhatsAppHistory";

/*
This hook is used to update the message status of the whatsApp messages.
*/
export const useMessageStatus = () => {
  const isInitialized = useNewStore((s) => s.whatsApp.isInitialized);
  const whatsAppState = useNewStore((s) => s.whatsApp);
  const wifiEnabled = useNewStore((s) => s.wifiEnabled);
  const getWindowByApplicationId = useNewStore(
    (s) => s.getWindowByApplicationId
  );
  const whatsAppWindow = getWindowByApplicationId("whatsApp");
  console.log("useMessageStatus: whatsAppWindow", whatsAppWindow);
  if (!whatsAppWindow) return;
  //   const whatsAppHistory = useWhatsAppHistory(whatsAppWindow.windowId);
  //   console.log("useMessageStatus: whatsAppHistory", whatsAppHistory);

  return {};
};
