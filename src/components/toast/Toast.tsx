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

interface ClickableToastProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  id: string | number;
}

const ClickableToast = ({
  icon,
  title,
  description,
  onClick,
  id,
}: ClickableToastProps) => {
  return (
    <div
      onClick={() => {
        onClick();
        toast.dismiss(id);
      }}
      className="cursor-pointer flex items-center gap-3 bg-white dark:bg-zinc-900 text-black dark:text-white p-4 rounded-lg shadow-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border border-gray-200 dark:border-zinc-700"
    >
      {icon}
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </div>
      </div>
    </div>
  );
};

export const Toast = () => {
  const whatsApp = useNewStore((s) => s.whatsApp);
  const wifiEnabled = useNewStore((s) => s.wifiEnabled);
  const openApplication = useNewStore((s) => s.openApplication);

  // Track the last message count we've notified about
  const lastNotifiedMessageCount = useRef(NON_USER_MESSAGE_COUNT);

  // const messagesFromAI = selectVisibleConversationMessages(whatsApp, "ai_work");
  const nonUserMessageCount = NON_USER_MESSAGE_COUNT;
  const whatsAppMessages = useNewStore((s) => s.whatsApp.messages.allIds);
  const deliveredMessagesReceived = whatsAppMessages.filter(
    (message) =>
      whatsApp.messages.byId[message].sender !== "user_self" &&
      (whatsApp.messages.byId[message].deliveryStatus === "delivered" ||
        whatsApp.messages.byId[message].deliveryStatus === "read")
  );
  const whatsAppInitialized = useNewStore((s) => s.whatsApp.isInitialized);
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
      toast.custom((id) => (
        <ClickableToast
          icon={<WhatsAppIcon />}
          title="WhatsApp"
          description="You have a new message"
          onClick={() => openApplication("whatsApp")}
          id={id}
        />
      ));

      // Update the ref to the current message count
      lastNotifiedMessageCount.current = deliveredMessagesReceived.length;
    }
  }, [
    whatsAppMessages,
    whatsAppInitialized,
    nonUserMessageCount,
    deliveredMessagesReceived,
    wifiEnabled,
    openApplication,
  ]);

  useEffect(() => {
    if (clickOnSomethingAchieved) {
      toast.custom((id) => (
        <ClickableToast
          icon={<TrophyIcon />}
          title="Achievement Unlocked!"
          description="You clicked on something!"
          onClick={() => openApplication("achievements")}
          id={id}
        />
      ));
    }
  }, [clickOnSomethingAchieved, openApplication]);

  // Trigger toasts when achievements are unlocked
  useEffect(() => {
    if (downloadEggsAchieved) {
      toast.custom((id) => (
        <ClickableToast
          icon={<TrophyIcon />}
          title="Achievement Unlocked!"
          description="You downloaded some eggs."
          onClick={() => openApplication("achievements")}
          id={id}
        />
      ));
    }
  }, [downloadEggsAchieved, openApplication]);

  useEffect(() => {
    if (deletedPortfolioAchieved) {
      toast.custom((id) => (
        <ClickableToast
          icon={<TrophyIcon />}
          title="Achievement Unlocked!"
          description="You deleted a portfolio."
          onClick={() => openApplication("achievements")}
          id={id}
        />
      ));
    }
  }, [deletedPortfolioAchieved, openApplication]);

  useEffect(() => {
    if (visitEveryWebsiteAchieved) {
      toast.custom((id) => (
        <ClickableToast
          icon={<TrophyIcon />}
          title="Achievement Unlocked!"
          description="You visited all the websites!"
          onClick={() => openApplication("achievements")}
          id={id}
        />
      ));
    }
  }, [visitEveryWebsiteAchieved, openApplication]);

  useEffect(() => {
    if (operatingSystemSwitchedAchieved) {
      toast.custom((id) => (
        <ClickableToast
          icon={<TrophyIcon />}
          title="Achievement Unlocked!"
          description="You switched operating systems."
          onClick={() => openApplication("achievements")}
          id={id}
        />
      ));
    }
  }, [operatingSystemSwitchedAchieved, openApplication]);

  useEffect(() => {
    if (thankEmilyForHelpingMe) {
      toast.custom((id) => (
        <ClickableToast
          icon={<TrophyIcon />}
          title="Achievement Unlocked!"
          description="You thanked Emily for her help."
          onClick={() => openApplication("achievements")}
          id={id}
        />
      ));
    }
  }, [thankEmilyForHelpingMe, openApplication]);

  useEffect(() => {
    if (apologiseToEmily === true) {
      toast.custom((id) => (
        <ClickableToast
          icon={<TrophyIcon />}
          title="Achievement Unlocked!"
          description="You apologised"
          onClick={() => openApplication("achievements")}
          id={id}
        />
      ));
    }
  }, [apologiseToEmily, openApplication]);

  // Always render the Toaster component so it can show toasts
  return <Toaster />;
};
