import { useNewStore } from "./useStore";

interface AchievementsUnlocked {
  downloadEggs: boolean;
  deletedPortfolio: boolean;
  eggsDownloaded: number;
}

const eggThreshold = 12;

export const useAchievements = (): AchievementsUnlocked => {
  const eggsDownloaded = useNewStore((state) => state.eggsDownloaded);

  const downloadEggs = eggsDownloaded >= eggThreshold;

  const deletedPortfolio = useNewStore((state) => state.portfolioDeleted);

  return { downloadEggs, deletedPortfolio, eggsDownloaded };
};
