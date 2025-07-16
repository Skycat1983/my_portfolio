// interface AchievementsState {}

import { WEB_PAGE_REGISTRY } from "@/components/applications/browser/browserConstants";
import type { SetState } from "@/types/storeTypes";

// Validation result for Thank Emily achievement
interface ThankEmilyValidation {
  score: number; // 0-100 percentage
  maxScore: number; // Always 100
  errors: string[];
  suggestions: string[];
  isComplete: boolean;
}

interface AchievementState {
  thankEmilyForHelpingMe: boolean;
  thankEmilyValidation: ThankEmilyValidation;

  apologiseToEmily: boolean | null;

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
  // Thank Emily validation
  validateThankEmilyMessage: (message: string) => ThankEmilyValidation;

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
export type { ThankEmilyValidation };

// Validation function for Thank Emily message
const validateThankEmilyMessage = (message: string): ThankEmilyValidation => {
  // Always create fresh arrays to ensure no persistence between calls
  const errors: string[] = [];
  const suggestions: string[] = [];
  let score = 100;
  const maxScore = 100;
  const trimmedMessage = message.trim();

  // === CORE REQUIREMENTS (deduct 10 points for each error) ===

  // 1. Check for thanks/thank you
  const hasThanks = /\b(thanks|thank you)\b/i.test(trimmedMessage);
  const hasIncorrectThankyou = /\bthankyou\b/i.test(trimmedMessage);

  if (hasIncorrectThankyou) {
    score -= 10;
    errors.push("'thankyou' is two words, not one");
    suggestions.push("Use 'thank you' instead of 'thankyou'");
  } else if (!hasThanks) {
    score -= 10;
    errors.push(
      "You can't express gratitude without a 'thanks' or a 'thank you'"
    );
    suggestions.push("Add 'thanks' or 'thank you' to your message");
  }

  // 2. Check capitalization at start
  const startsWithCapital = /^[A-Z]/.test(trimmedMessage);
  if (!startsWithCapital) {
    score -= 10;
    errors.push("Sentences start with a capital letter...");
    suggestions.push("Capitalize the first letter of your message");
  }

  // 3. Check ends with full stop
  const endsWithPeriod = /\.$/.test(trimmedMessage);
  if (!endsWithPeriod) {
    score -= 10;
    errors.push("A properly formatted message ends with a full stop.");
    suggestions.push("Add a full stop at the end of your message");
  }

  // 4. Check Emily capitalization (if Emily is mentioned)
  const hasIncorrectEmily = /\bemily\b/.test(trimmedMessage);

  if (hasIncorrectEmily) {
    score -= 10;
    errors.push(
      "Emily helped me a lot here. You should at least capitalize her name."
    );
    suggestions.push("Write 'Emily' with a capital 'E'");
  }

  // 5. Check for helping context
  const hasGoodGrammar =
    /\b(help(ing|ed)?|assist(ing|ed|ance)?|support(ing|ed)?)\b/i.test(
      trimmedMessage
    );
  if (!hasGoodGrammar) {
    score -= 10;
    errors.push("Message should mention how Emily helped you");
    suggestions.push("Add details about how Emily helped you");
  }

  // === ADDITIONAL GRAMMAR CHECKS (Optional - easily removable) ===

  // Grammar Check A: Comma after direct address
  const hasThankYouEmily = /\bthank you emily\b/i.test(trimmedMessage);
  if (hasThankYouEmily) {
    score -= 10;
    errors.push(
      "When addressing someone directly, use a comma: 'Thank you, Emily'"
    );
    suggestions.push(
      "Add a comma before Emily's name when thanking her directly"
    );
  }

  // Grammar Check B: Double spacing (easily removable)
  const hasDoubleSpaces = /\s{2,}/.test(trimmedMessage);
  if (hasDoubleSpaces) {
    score -= 10;
    errors.push(
      "Avoid multiple consecutive spaces. It shows laziness and poor attention to detail."
    );
    suggestions.push("Use single spaces between words");
  }

  // Grammar Check C: Common contractions (easily removable)
  const hasInformalContractions = /\b(ur|u|thx|thnx)\b/i.test(trimmedMessage);
  if (hasInformalContractions) {
    score -= 10;
    errors.push("Use formal language instead of text abbreviations");
    suggestions.push("Write out full words like 'you' and 'thank you'");
  }

  // Grammar Check D: Repetitive words (easily removable)
  const words = trimmedMessage.toLowerCase().split(/\s+/);
  const wordCounts = words.reduce((acc, word) => {
    const cleanWord = word.replace(/[^\w]/g, "");
    acc[cleanWord] = (acc[cleanWord] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const repeatedWords = Object.entries(wordCounts)
    .filter(([word, count]) => count > 2 && word.length > 2)
    .map(([word]) => word);

  if (repeatedWords.length > 0) {
    score -= 10;
    errors.push(`Avoid repeating words too often: ${repeatedWords.join(", ")}`);
    suggestions.push(
      "Use varied vocabulary to make your message more engaging"
    );
  }

  // Ensure score doesn't go below 0
  score = Math.max(0, score);

  // Achievement only unlocks with perfect score AND no errors
  const isComplete = score === 100 && errors.length === 0;

  console.log("test result score", score);
  console.log("test result errors", errors);
  console.log("test result suggestions", suggestions);
  console.log("test result isComplete", isComplete);

  return {
    score,
    maxScore,
    errors: [...errors], // Spread to ensure fresh array
    suggestions: [...suggestions], // Spread to ensure fresh array
    isComplete,
  };
};

export const createAchievementSlice = (
  set: SetState<AchievementSlice>
): AchievementSlice => ({
  thankEmilyForHelpingMe: false,
  thankEmilyValidation: {
    score: 0,
    maxScore: 100,
    errors: [],
    suggestions: ["Try sending Emily a thank you message!"],
    isComplete: false,
  },
  apologiseToEmily: null,

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

  validateThankEmilyMessage: (message: string) => {
    const validation = validateThankEmilyMessage(message);

    set((state) => {
      const shouldUnlockAchievement = validation.isComplete;

      return {
        thankEmilyValidation: validation,
        ...(shouldUnlockAchievement && {
          thankEmilyForHelpingMe: true,
          unseenAchievements: state.unseenAchievements + 1,
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
      thankEmilyForHelpingMe: false,
      thankEmilyValidation: {
        score: 0,
        maxScore: 100,
        errors: [],
        suggestions: ["Try sending Emily a thank you message!"],
        isComplete: false,
      },
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
