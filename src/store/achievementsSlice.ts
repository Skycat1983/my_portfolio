// interface AchievementsState {}

import type { SetState } from "../types/storeTypes";
import type { NewDesktopStore } from "../hooks/useStore";

// Download 12 eggs.
// Delete my portfolio.
// Send me an email
// Visit a website
// Download my CV 3 times
// Switch operating system

interface AchievementState {
  // employerScore: number;
  clickOnSomethingAchieved: boolean;
  eggsDownloaded: number;
  downloadEggsAchieved: boolean;
  portfolioDeletedAchieved: boolean;
  joinAQueueAchieved: boolean;
  operatingSystemSwitchedAchieved: boolean;

  //   emailSent: boolean;
  //   cvDownloaded: number;
}

interface AchievementAction {
  //   incrementEmployerScore: (n: number) => void;
  unlockClickOnSomethingAchievement: () => void;
  incrementEggsDownloadedAchievement: () => void;
  unlockPortfolioDeletedAchievement: () => void;
  unlockJoinAQueueAchievement: () => void;
  unlockOperatingSystemAchievement: () => void;

  //   sendEmail: () => void;
  //   downloadCV: () => void;
}

export type AchievementSlice = AchievementState & AchievementAction;

export const createAchievementSlice = (
  set: SetState<NewDesktopStore>
): AchievementSlice => ({
  clickOnSomethingAchieved: false,
  eggsDownloaded: 0,
  downloadEggsAchieved: false,
  portfolioDeletedAchieved: false,
  joinAQueueAchieved: false,
  operatingSystemSwitchedAchieved: false,
  //   emailSent: false,
  //   websiteVisited: false,
  //   cvDownloaded: 0,
  //   operatingSystemSwitched: false,

  unlockClickOnSomethingAchievement: () => {
    set(() => ({
      clickOnSomethingAchieved: true,
    }));
  },

  incrementEggsDownloadedAchievement: () => {
    set((state) => ({
      eggsDownloaded: state.eggsDownloaded + 1,
      download12EggsAchieved: state.eggsDownloaded >= 12,
    }));
  },

  unlockPortfolioDeletedAchievement: () => {
    set(() => ({
      portfolioDeletedAchieved: true,
    }));
  },

  unlockJoinAQueueAchievement: () => {
    set(() => ({
      joinAQueueAchieved: true,
    }));
  },

  unlockOperatingSystemAchievement: () => {
    set(() => ({
      operatingSystemSwitchedAchieved: true,
    }));
  },
});
