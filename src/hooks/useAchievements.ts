import { useNewStore } from "./useStore";

interface AchievementsUnlocked {
  downloadEggsAchieved: boolean;
  deletedPortfolioAchieved: boolean;
  joinAQueueAchieved: boolean;
  operatingSystemSwitchedAchieved: boolean;
}

export const useAchievements = (): AchievementsUnlocked => {
  const downloadEggsAchieved = useNewStore(
    (state) => state.downloadEggsAchieved
  );
  const deletedPortfolioAchieved = useNewStore(
    (state) => state.portfolioDeletedAchieved
  );
  const joinAQueueAchieved = useNewStore((state) => state.joinAQueueAchieved);
  const operatingSystemSwitchedAchieved = useNewStore(
    (state) => state.operatingSystemSwitchedAchieved
  );

  return {
    downloadEggsAchieved,
    deletedPortfolioAchieved,
    joinAQueueAchieved,
    operatingSystemSwitchedAchieved,
  };
};
