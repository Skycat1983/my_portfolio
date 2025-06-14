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
  eggsDownloaded: number;
  portfolioDeleted: boolean;
  //   emailSent: boolean;
  //   websiteVisited: boolean;
  //   cvDownloaded: number;
  //   operatingSystemSwitched: boolean;
}

interface AchievementAction {
  //   incrementEmployerScore: (n: number) => void;
  incrementEggsDownloaded: () => void;
  deletePortfolio: () => void;
  //   sendEmail: () => void;
  //   visitWebsite: () => void;
  //   downloadCV: () => void;
  //   switchOperatingSystem: () => void;
}

export type AchievementSlice = AchievementState & AchievementAction;

export const createAchievementSlice = (
  set: SetState<NewDesktopStore>
): AchievementSlice => ({
  eggsDownloaded: 0,
  portfolioDeleted: false,
  //   emailSent: false,
  //   websiteVisited: false,
  //   cvDownloaded: 0,
  //   operatingSystemSwitched: false,

  incrementEggsDownloaded: () => {
    set((state) => ({
      eggsDownloaded: state.eggsDownloaded + 1,
    }));
  },

  deletePortfolio: () => {
    set(() => ({
      portfolioDeleted: true,
    }));
  },
});
