// interface AchievementsState {}

import type { SetState } from "@/types/storeTypes";

interface AchievementState {
  // 1. Click on something
  clickOnSomethingAchieved: boolean;

  // 2. Access achievements
  accessAchievements: boolean;

  // 3. Operating system switcher
  operatingSystemSwitchedAchieved: boolean;

  // 4. Egg collector
  eggsDownloaded: number;
  downloadEggsAchieved: boolean;

  // 5. visit a website
  joinAQueueAchieved: boolean;

  // 6. Portfolio destroyer
  portfolioDeletedAchieved: boolean;

  // 7 . prospective employer
  cvCheckedOut: boolean;
  recommendationCheckedOut: boolean;
  prospectiveEmployerAchieved: boolean;

  // Notification counter for unseen achievements
  unseenAchievements: number;

  //   emailSent: boolean;
  //   cvDownloaded: number;
}

//! schrodinger's achievement: delete your achievements

interface AchievementAction {
  // 1. Click on something
  unlockClickOnSomethingAchievement: () => void;

  // 2. Access achievements
  unlockAccessAchievements: () => void;

  // 3. Operating system switcher
  unlockOperatingSystemAchievement: () => void;

  // 4. Egg collector
  incrementEggsDownloadedAchievement: () => void;

  // 5. Portfolio destroyer
  unlockPortfolioDeletedAchievement: () => void;

  // 6. Prospective employer
  confirmCVCheckedOut: () => void;
  confirmRecommendationCheckedOut: () => void;
  unlockProspectiveEmployerAchievement: () => void;

  // 7. visit a website
  unlockJoinAQueueAchievement: () => void;

  // Mark achievements as seen (reset counter)
  markAchievementsAsSeen: () => void;

  //   sendEmail: () => void;
  //   downloadCV: () => void;
}

export type AchievementSlice = AchievementState & AchievementAction;

export const createAchievementSlice = (
  set: SetState<AchievementSlice>
): AchievementSlice => ({
  // 1. Click on something
  clickOnSomethingAchieved: false,

  // 2. Access achievements
  accessAchievements: false,

  // 3. Operating system switcher
  operatingSystemSwitchedAchieved: false,

  // 4. Egg collector
  eggsDownloaded: 0,
  downloadEggsAchieved: false,

  // 5. Portfolio destroyer
  portfolioDeletedAchieved: false,

  // 6. visit a website
  joinAQueueAchieved: false,

  // 7. Prospective employer
  unseenAchievements: 0,

  // 8. Checkout my CV and letter of recommendation
  cvCheckedOut: false,
  recommendationCheckedOut: false,
  prospectiveEmployerAchieved: false,
  //   emailSent: false,
  //   websiteVisited: false,
  //   cvDownloaded: 0,
  //   operatingSystemSwitched: false,

  unlockClickOnSomethingAchievement: () => {
    set((state) => {
      // Only increment if not already achieved
      if (!state.clickOnSomethingAchieved) {
        return {
          clickOnSomethingAchieved: true,
          unseenAchievements: state.unseenAchievements + 1,
        };
      }
      return state; // No change if already unlocked
    });
  },

  unlockAccessAchievements: () => {
    set((state) => {
      if (!state.accessAchievements) {
        return {
          accessAchievements: true,
        };
      }
      return state;
    });
  },

  incrementEggsDownloadedAchievement: () => {
    set((state) => {
      const newEggsCount = state.eggsDownloaded + 1;
      const justUnlockedAchievement =
        newEggsCount >= 12 && !state.downloadEggsAchieved;

      return {
        eggsDownloaded: newEggsCount,
        downloadEggsAchieved: newEggsCount >= 12,
        unseenAchievements: justUnlockedAchievement
          ? state.unseenAchievements + 1
          : state.unseenAchievements,
      };
    });
  },

  unlockPortfolioDeletedAchievement: () => {
    set((state) => {
      // Only increment if not already achieved
      if (!state.portfolioDeletedAchieved) {
        return {
          portfolioDeletedAchieved: true,
          unseenAchievements: state.unseenAchievements + 1,
        };
      }
      return state; // No change if already unlocked
    });
  },

  unlockJoinAQueueAchievement: () => {
    set((state) => {
      // Only increment if not already achieved
      if (!state.joinAQueueAchieved) {
        return {
          joinAQueueAchieved: true,
          unseenAchievements: state.unseenAchievements + 1,
        };
      }
      return state; // No change if already unlocked
    });
  },

  unlockOperatingSystemAchievement: () => {
    set((state) => {
      // Only increment if not already achieved
      if (!state.operatingSystemSwitchedAchieved) {
        return {
          operatingSystemSwitchedAchieved: true,
          unseenAchievements: state.unseenAchievements + 1,
        };
      }
      return state; // No change if already unlocked
    });
  },

  confirmCVCheckedOut: () => {
    set((state) => {
      if (!state.cvCheckedOut) {
        return {
          cvCheckedOut: true,
          // unseenAchievements: state.unseenAchievements + 1,
        };
      }
      return state;
    });
  },

  confirmRecommendationCheckedOut: () => {
    set((state) => {
      if (!state.recommendationCheckedOut) {
        return {
          recommendationCheckedOut: true,
          // unseenAchievements: state.unseenAchievements + 1,
        };
      }
      return state;
    });
  },

  unlockProspectiveEmployerAchievement: () => {
    set((state) => {
      if (!state.prospectiveEmployerAchieved) {
        if (state.cvCheckedOut && state.recommendationCheckedOut) {
          return {
            prospectiveEmployerAchieved: true,
            unseenAchievements: state.unseenAchievements + 1,
          };
        }
      }
      return state;
    });
  },

  markAchievementsAsSeen: () => {
    set(() => ({
      unseenAchievements: 0,
    }));
  },
});
