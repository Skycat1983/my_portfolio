import { useEffect, useRef } from "react";
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
  const wifiEnabled = useNewStore((s) => s.wifiEnabled);

  // Track the last message count we've notified about
  const lastNotifiedMessageCount = useRef(NON_USER_MESSAGE_COUNT);

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
  const operatingSystemSwitchedAchieved = useNewStore(
    (s) => s.operatingSystemSwitchedAchieved
  );
  const visitEveryWebsiteAchieved = useNewStore(
    (s) => s.visitEveryWebsiteAchieved
  );
  const thankEmilyForHelpingMe = useNewStore((s) => s.thankEmilyForHelpingMe);
  const apologiseToEmily = useNewStore((s) => s.apologiseToEmily);

  useEffect(() => {
    // Only show toast if we have more messages than we've previously notified about
    if (
      whatsAppInitialized &&
      wifiEnabled &&
      deliveredMessagesReceived.length > lastNotifiedMessageCount.current
    ) {
      toast.success("WhatsApp", {
        description: "You have a new message",
        duration: 4000,
        icon: <WhatsAppIcon />,
      });

      // Update the ref to the current message count
      lastNotifiedMessageCount.current = deliveredMessagesReceived.length;
    }
  }, [
    whatsAppMessages,
    whatsAppInitialized,
    nonUserMessageCount,
    deliveredMessagesReceived,
    wifiEnabled,
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
    if (visitEveryWebsiteAchieved) {
      toast.success("Achievement Unlocked!", {
        description: "You visited a website! 🔄",
        duration: 4000,
        icon: <TrophyIcon />,
      });
    }
  }, [visitEveryWebsiteAchieved]);

  useEffect(() => {
    if (operatingSystemSwitchedAchieved) {
      toast.success("Achievement Unlocked!", {
        description: "You switched operating systems! 💻",
        duration: 4000,
        icon: <TrophyIcon />,
      });
    }
  }, [operatingSystemSwitchedAchieved]);

  useEffect(() => {
    if (thankEmilyForHelpingMe) {
      toast.success("Achievement Unlocked!", {
        description: "You thanked Emily with perfect grammar! 💌",
        duration: 4000,
        icon: <TrophyIcon />,
      });
    }
  }, [thankEmilyForHelpingMe]);

  useEffect(() => {
    if (apologiseToEmily === true) {
      toast.success("Achievement Unlocked!", {
        description: "You apologised to Emily! 😅",
        duration: 4000,
        icon: <TrophyIcon />,
      });
    }
  }, [apologiseToEmily]);

  // Always render the Toaster component so it can show toasts
  return <Toaster />;
};
