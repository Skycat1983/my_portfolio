// interface AchievementsState {}

import {
  validateThankEmilyMessage,
  type ThankEmilyValidation,
} from "@/components/applications/achievements/validateThankEmily";
import { WEB_PAGE_REGISTRY } from "@/components/applications/browser/browserConstants";
import type { SetState } from "@/types/storeTypes";

// Validation result for Thank Emily achievement

interface AchievementState {
  // 1. Click on something
  clickOnSomethingAchieved: boolean;

  // 2. Thank Emily
  thankEmilyForHelpingMe: boolean;
  thankEmilyValidation: ThankEmilyValidation;
  failedValidationAttempts: number;
  apologiseToEmily: boolean | null;

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

  //! new achievements
  mobileViewAchieved: boolean;
  resizeWindowAchieved: boolean;
  dragAndDropAchieved: boolean;
  saveDocumentAchieved: boolean;
  compareTwoCommoditiesAchieved: boolean;
}

//! schrodinger's achievement: delete your achievements

interface AchievementAction {
  // Thank Emily validation
  validateThankEmilyMessage: (message: string) => ThankEmilyValidation;

  // Apologise to Emily
  unlockApologiseToEmilyAchievement: () => void;

  // 1. Click on something
  unlockClickOnSomethingAchievement: () => void;

  // 2. Access achievements
  // unlockAccessAchievements: () => void;

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

  // new achievements
  unlockMobileViewAchievement: () => void;
  unlockResizeWindowAchievement: () => void;
  unlockDragAndDropAchievement: () => void;
  unlockSaveDocumentAchievement: () => void;
  unlockCompareTwoCommoditiesAchievement: () => void;

  //   sendEmail: () => void;
  //   downloadCV: () => void;
}

export type AchievementSlice = AchievementState & AchievementAction;
export type { ThankEmilyValidation };

export const createAchievementSlice = (
  set: SetState<AchievementSlice>
): AchievementSlice => ({
  // 1. Click on something
  clickOnSomethingAchieved: false,

  // 2. Thank Emily
  thankEmilyForHelpingMe: false,
  thankEmilyValidation: {
    score: 0,
    maxScore: 100,
    errors: [],
    suggestions: ["Try sending Emily a thank you message!"],
    isComplete: false,
  },
  failedValidationAttempts: 0,
  apologiseToEmily: null,

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

  // new achievements
  mobileViewAchieved: false,
  resizeWindowAchieved: false,
  dragAndDropAchieved: false,
  saveDocumentAchieved: false,
  compareTwoCommoditiesAchieved: false,

  validateThankEmilyMessage: (message: string) => {
    const validation = validateThankEmilyMessage(message);

    set((state) => {
      const shouldUnlockAchievement = validation.isComplete;
      const validationFailed = !validation.isComplete;

      return {
        thankEmilyValidation: validation,
        // Increment failed attempts if validation failed
        failedValidationAttempts: validationFailed
          ? state.failedValidationAttempts + 1
          : state.failedValidationAttempts,
        ...(shouldUnlockAchievement && {
          thankEmilyForHelpingMe: true,
          unseenAchievements: state.unseenAchievements + 1,
          // Only show apology achievement after successful completion AND >= 3 failed attempts
          ...(state.failedValidationAttempts >= 3 && {
            apologiseToEmily: false,
          }),
        }),
      };
    });

    return validation;
  },

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

  // unlockAccessAchievements: () => {
  //   set((state) => {
  //     if (!state.accessAchievements) {
  //       return {
  //         accessAchievements: true,
  //       };
  //     }
  //     return state;
  //   });
  // },

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

  unlockApologiseToEmilyAchievement: () => {
    set((state) => {
      if (state.apologiseToEmily === false) {
        return {
          apologiseToEmily: true,
          unseenAchievements: state.unseenAchievements + 1,
        };
      }
      return state;
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

  unlockMobileViewAchievement: () => {
    set((state) => {
      if (!state.mobileViewAchieved) {
        return {
          mobileViewAchieved: true,
          unseenAchievements: state.unseenAchievements + 1,
        };
      }
      return state;
    });
  },

  unlockResizeWindowAchievement: () => {
    set((state) => {
      console.log("unlockResizeWindowAchievement", state.resizeWindowAchieved);
      if (!state.resizeWindowAchieved) {
        return {
          resizeWindowAchieved: true,
          unseenAchievements: state.unseenAchievements + 1,
        };
      }
      return state;
    });
  },

  unlockDragAndDropAchievement: () => {
    set((state) => {
      if (!state.dragAndDropAchieved) {
        return {
          dragAndDropAchieved: true,
          unseenAchievements: state.unseenAchievements + 1,
        };
      }
      return state;
    });
  },

  unlockSaveDocumentAchievement: () => {
    set((state) => {
      if (!state.saveDocumentAchieved) {
        return {
          saveDocumentAchieved: true,
          unseenAchievements: state.unseenAchievements + 1,
        };
      }
      return state;
    });
  },

  unlockCompareTwoCommoditiesAchievement: () => {
    set((state) => {
      if (!state.compareTwoCommoditiesAchieved) {
        return {
          compareTwoCommoditiesAchieved: true,
          unseenAchievements: state.unseenAchievements + 1,
        };
      }
      return state;
    });
  },

  resetAchievements: () => {
    set(() => ({
      thankEmilyForHelpingMe: false,
      thankEmilyValidation: {
        score: 0,
        maxScore: 100,
        errors: [],
        suggestions: ["Try sending Emily a thank you message!"],
        isComplete: false,
      },
      failedValidationAttempts: 0,
      apologiseToEmily: null,
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
