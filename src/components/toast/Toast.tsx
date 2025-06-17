import { useEffect } from "react";
import { toast } from "sonner";
import { useNewStore } from "../../store/useStore";
import { Toaster } from "../ui/sonner";
import ACHIEVEMENT from "../../assets/icons_m/achievement.png";

// Create trophy icon component
const TrophyIcon = () => (
  <div className="flex items-center justify-center">
    <img src={ACHIEVEMENT} alt="Achievement" className="w-6 h-6" />
  </div>
);

export const Toast = () => {
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
        description: "You joined a queue! 🔄",
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
