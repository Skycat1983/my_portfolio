// interface AchievementsState {}

import type { SetState } from "../../types/storeTypes";
import type { NewDesktopStore } from "../useStore";

// Download 12 eggs.
// Delete my portfolio.
// Send me an email
// Visit a website
// Download my CV 3 times
// Switch operating system

interface AchievementState {
  // employerScore: number;
  clickOnSomethingAchieved: boolean;
  accessAchievements: boolean;
  eggsDownloaded: number;
  downloadEggsAchieved: boolean;
  portfolioDeletedAchieved: boolean;
  joinAQueueAchieved: boolean;
  operatingSystemSwitchedAchieved: boolean;

  // Notification counter for unseen achievements
  unseenAchievements: number;

  //   emailSent: boolean;
  //   cvDownloaded: number;
}

//! schrodinger's achievement: delete your achievements

interface AchievementAction {
  //   incrementEmployerScore: (n: number) => void;
  unlockClickOnSomethingAchievement: () => void;
  unlockAccessAchievements: () => void;
  incrementEggsDownloadedAchievement: () => void;
  unlockPortfolioDeletedAchievement: () => void;
  unlockJoinAQueueAchievement: () => void;
  unlockOperatingSystemAchievement: () => void;

  // Mark achievements as seen (reset counter)
  markAchievementsAsSeen: () => void;

  //   sendEmail: () => void;
  //   downloadCV: () => void;
}

export type AchievementSlice = AchievementState & AchievementAction;

export const createAchievementSlice = (
  set: SetState<NewDesktopStore>
): AchievementSlice => ({
  clickOnSomethingAchieved: false,
  accessAchievements: false,
  eggsDownloaded: 0,
  downloadEggsAchieved: false,
  portfolioDeletedAchieved: false,
  joinAQueueAchieved: false,
  operatingSystemSwitchedAchieved: false,
  unseenAchievements: 0,
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

  markAchievementsAsSeen: () => {
    set(() => ({
      unseenAchievements: 0,
    }));
  },
});
