import { useNewStore } from "@/hooks/useStore";

export const useWhatsappMessageStatus = () => {
  const whatsAppState = useNewStore((state) => state.whatsApp);
  const whatsAppHistory = useNewStore((state) => state.histories);
  //   const deliveredMessagesReceived = whatsApp.messages.byId;
  //   const nonUserMessageCount = whatsApp.messages.byId;

  return {};
};
