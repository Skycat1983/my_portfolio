// interface AchievementsState {}

import { WEB_PAGE_REGISTRY } from "@/components/applications/browser/browserConstants";
import type { SetState } from "@/types/storeTypes";

interface AchievementState {
  thankEmilyForHelpingMe: boolean;
  // 1. Click on something
  clickOnSomethingAchieved: boolean;

  // 2. Access achievements
  accessAchievements: boolean;

  // 3. Operating system switcher
  operatingSystemSwitchedAchieved: boolean;

  // 4. Egg collector
  eggsDownloaded: number;
  downloadEggsAchieved: boolean;

  visitEveryWebsiteAchieved: boolean;
  websitesVisited: (keyof typeof WEB_PAGE_REGISTRY)[];

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

  addToWebsitesVisited: (website: keyof typeof WEB_PAGE_REGISTRY) => void;

  // 6. Prospective employer
  confirmCVCheckedOut: () => void;
  confirmRecommendationCheckedOut: () => void;
  unlockProspectiveEmployerAchievement: () => void;

  // Mark achievements as seen (reset counter)
  markAchievementsAsSeen: () => void;

  resetAchievements: () => void;

  //   sendEmail: () => void;
  //   downloadCV: () => void;
}

export type AchievementSlice = AchievementState & AchievementAction;

export const createAchievementSlice = (
  set: SetState<AchievementSlice>
): AchievementSlice => ({
  thankEmilyForHelpingMe: false,
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

  // 5. visit a website
  visitEveryWebsiteAchieved: false,

  websitesVisited: [],

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

  addToWebsitesVisited: (website: keyof typeof WEB_PAGE_REGISTRY) => {
    set((state) => {
      const newWebsitesVisited = [...state.websitesVisited, website];
      const allWebsitesVisited =
        newWebsitesVisited.length === Object.keys(WEB_PAGE_REGISTRY).length;

      return {
        websitesVisited: newWebsitesVisited,
        ...(allWebsitesVisited &&
          !state.visitEveryWebsiteAchieved && {
            visitEveryWebsiteAchieved: true,
            unseenAchievements: state.unseenAchievements + 1,
          }),
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

  resetAchievements: () => {
    set(() => ({
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

      // 7. Prospective employer
      unseenAchievements: 0,

      // 8. Checkout my CV and letter of recommendation
      cvCheckedOut: false,
      recommendationCheckedOut: false,
      prospectiveEmployerAchieved: false,
    }));
  },
});
