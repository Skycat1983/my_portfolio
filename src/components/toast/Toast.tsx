import { useEffect } from "react";
import { toast } from "sonner";
import { useNewStore } from "@/hooks/useStore";
import { Toaster } from "../ui/sonner";
import ACHIEVEMENT from "@/assets/icons_m/achievement.png";
import { WHATSAPP } from "@/constants/images";
import { NON_USER_MESSAGE_COUNT } from "@/constants/whatsAppData";

// Create trophy icon component
const TrophyIcon = () => (
  <div className="flex items-center justify-center">
    <img src={ACHIEVEMENT} alt="Achievement" className="w-6 h-6" />
  </div>
);

const WhatsAppIcon = () => (
  <div className="flex items-center justify-center">
    <img src={WHATSAPP} alt="WhatsApp" className="w-6 h-6" />
  </div>
);

export const Toast = () => {
  const whatsApp = useNewStore((s) => s.whatsApp);
  console.log("whatsApp", whatsApp);
  // const messagesFromAI = selectVisibleConversationMessages(whatsApp, "ai_work");
  const nonUserMessageCount = NON_USER_MESSAGE_COUNT;
  console.log("nonUserMessageCount", nonUserMessageCount);
  const whatsAppMessages = useNewStore((s) => s.whatsApp.messages.allIds);
  const deliveredMessagesReceived = whatsAppMessages.filter(
    (message) =>
      whatsApp.messages.byId[message].sender !== "user_self" &&
      (whatsApp.messages.byId[message].deliveryStatus === "delivered" ||
        whatsApp.messages.byId[message].deliveryStatus === "read")
  );
  console.log("deliveredMessages", deliveredMessagesReceived);
  const whatsAppInitialized = useNewStore((s) => s.whatsApp.isInitialized);
  console.log("whatsAppMessages", whatsAppMessages);
  const clickOnSomethingAchieved = useNewStore(
    (s) => s.clickOnSomethingAchieved
  );
  const downloadEggsAchieved = useNewStore((s) => s.downloadEggsAchieved);
  const deletedPortfolioAchieved = useNewStore(
    (s) => s.portfolioDeletedAchieved
  );
  const joinAQueueAchieved = useNewStore((s) => s.joinAQueueAchieved);
  const operatingSystemSwitchedAchieved = useNewStore(
    (s) => s.operatingSystemSwitchedAchieved
  );

  useEffect(() => {
    console.log("TOAST: whatsAppInitialized", whatsAppInitialized);
    console.log("TOAST: deliveredMessagesReceived", deliveredMessagesReceived);
    console.log("TOAST: nonUserMessageCount", nonUserMessageCount);
    if (
      whatsAppInitialized &&
      deliveredMessagesReceived.length > nonUserMessageCount
    ) {
      toast.success("WhatsApp", {
        description: "You have a new message",
        duration: 4000,
        icon: <WhatsAppIcon />,
      });
    }
  }, [
    whatsAppMessages,
    whatsAppInitialized,
    nonUserMessageCount,
    deliveredMessagesReceived,
  ]);

  useEffect(() => {
    if (clickOnSomethingAchieved) {
      console.log("clickOnSomethingAchieved");
      toast.success("Achievement Unlocked!", {
        description: "You clicked on something!",
        duration: 4000,
        icon: <TrophyIcon />,
      });
    }
  }, [clickOnSomethingAchieved]);

  // Trigger toasts when achievements are unlocked
  useEffect(() => {
    if (downloadEggsAchieved) {
      toast.success("Achievement Unlocked!", {
        description: "You downloaded some eggs! 🥚",
        duration: 4000,
        icon: <TrophyIcon />,
      });
    }
  }, [downloadEggsAchieved]);

  useEffect(() => {
    if (deletedPortfolioAchieved) {
      toast.success("Achievement Unlocked!", {
        description: "You deleted a portfolio! 🗑️",
        duration: 4000,
        icon: <TrophyIcon />,
      });
    }
  }, [deletedPortfolioAchieved]);

  useEffect(() => {
    if (joinAQueueAchieved) {
      toast.success("Achievement Unlocked!", {
        description: "You visited a website! 🔄",
        duration: 4000,
        icon: <TrophyIcon />,
      });
    }
  }, [joinAQueueAchieved]);

  useEffect(() => {
    if (operatingSystemSwitchedAchieved) {
      toast.success("Achievement Unlocked!", {
        description: "You switched operating systems! 💻",
        duration: 4000,
        icon: <TrophyIcon />,
      });
    }
  }, [operatingSystemSwitchedAchieved]);

  // Always render the Toaster component so it can show toasts
  return <Toaster />;
};
