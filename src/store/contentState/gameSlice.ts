import type { Store } from "@/hooks/useStore";
import type { ApplicationState, SetState, GetState } from "@/types/storeTypes";

// Country data structure from API
interface Country {
  id: string; // cca3 code
  name: string; // common name
  capital: string; // first capital (simplified)
  flag: {
    png: string;
    svg: string;
    alt: string;
  };
}

// Question structure
interface Question {
  flagUrl: string;
  flagAlt: string;
  correctAnswer: string;
  options: string[]; // 4 shuffled options (countries or capitals)
  correctCountryId: string;
  submittedAnswer?: string; // Track what user selected
  isCorrect?: boolean; // Track if answer was correct
}

// Game state
interface GameState {
  // Game data
  countries: Country[];
  isLoadingCountries: boolean;
  loadingError: string | null;

  // Game session
  gameStatus: "menu" | "playing" | "answered" | "gameOver";
  questionType: "country" | "capital";
  optionsCount: number; // Default 4, configurable for future

  // Current game
  remainingCountries: Country[];
  currentQuestion: Question | null;
  timeRemaining: number; // 0-10 seconds
  currentScore: number;
  questionsAnswered: number;

  // High scores (top 5)
  highScores: number[];

  // Timer
  timerId: ReturnType<typeof setInterval> | null;
}

// Game actions
interface GameActions {
  // Initialization
  loadCountries: () => Promise<void>;

  // Game control
  startGame: (questionType: "country" | "capital") => void;
  endGame: () => void;
  returnToMenu: () => void;

  // Question management
  generateQuestion: () => void;
  submitAnswer: (selectedOption: string) => void;
  nextQuestion: () => void;

  // Timer management
  startTimer: () => void;
  stopTimer: () => void;
  decrementTimer: () => void;

  // Scoring
  updateHighScores: (score: number) => void;
  resetCurrentGame: () => void;

  // Configuration
  setOptionsCount: (count: number) => void;
}

export type GameSlice = GameState & GameActions;

// Utility functions
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const transformApiCountry = (apiCountry: {
  cca3: string;
  name: { common: string };
  capital?: string[];
  flags: { png: string; svg: string; alt?: string };
}): Country => {
  return {
    id: apiCountry.cca3,
    name: apiCountry.name.common,
    capital: apiCountry.capital?.[0] || "No capital",
    flag: {
      png: apiCountry.flags.png,
      svg: apiCountry.flags.svg,
      alt: apiCountry.flags.alt || `Flag of ${apiCountry.name.common}`,
    },
  };
};

export const createGameSlice = (
  set: SetState<ApplicationState>,
  get: GetState<ApplicationState>
): GameSlice => ({
  // Initial state
  countries: [],
  isLoadingCountries: false,
  loadingError: null,
  gameStatus: "menu",
  questionType: "country",
  optionsCount: 4,
  remainingCountries: [],
  currentQuestion: null,
  timeRemaining: 10,
  currentScore: 0,
  questionsAnswered: 0,
  highScores: [],
  timerId: null,

  // Actions
  loadCountries: async () => {
    set((state) => ({
      ...state,
      isLoadingCountries: true,
      loadingError: null,
    }));

    try {
      const endpoint =
        "https://restcountries.com/v3.1/independent?status=true&fields=area,capital,cca3,independent,landlocked,languages,name,population,region,timezone,flags";
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Failed to fetch countries: ${response.status}`);
      }

      const apiCountries = await response.json();
      const transformedCountries = apiCountries
        .map(transformApiCountry)
        .filter((country: Country) => country.capital !== "No capital"); // Filter out countries without capitals

      set((state) => ({
        ...state,
        countries: transformedCountries,
        isLoadingCountries: false,
        loadingError: null,
      }));
    } catch (error) {
      console.error("loadCountries in gameSlice: error", error);
      set((state) => ({
        ...state,
        isLoadingCountries: false,
        loadingError:
          error instanceof Error ? error.message : "Failed to load countries",
      }));
    }
  },

  startGame: (questionType: "country" | "capital") => {
    const currentState = get() as Store;

    set((state) => ({
      ...state,
      gameStatus: "playing",
      questionType,
      currentScore: 0,
      questionsAnswered: 0,
      remainingCountries: [...currentState.countries],
      currentQuestion: null,
      timeRemaining: 10,
    }));

    // Generate first question
    const gameSlice = get() as Store;
    gameSlice.generateQuestion();
  },

  generateQuestion: () => {
    const currentState = get() as Store;

    // Check if enough countries remain
    if (currentState.remainingCountries.length < currentState.optionsCount) {
      const gameSlice = get() as Store;
      gameSlice.endGame();
      return;
    }

    // Randomly select countries for this question
    const selectedCountries = shuffleArray(
      currentState.remainingCountries
    ).slice(0, currentState.optionsCount);

    const correctCountry = selectedCountries[0] as Country;
    const options = selectedCountries.map((country: Country) =>
      currentState.questionType === "country" ? country.name : country.capital
    );

    const question: Question = {
      flagUrl: correctCountry.flag.png,
      flagAlt: correctCountry.flag.alt,
      correctAnswer:
        currentState.questionType === "country"
          ? correctCountry.name
          : correctCountry.capital,
      options: shuffleArray(options),
      correctCountryId: correctCountry.id,
    };

    // Remove used countries from pool
    const remainingAfterQuestion = currentState.remainingCountries.filter(
      (country: Country) =>
        !selectedCountries.some(
          (selected: Country) => selected.id === country.id
        )
    );

    set((state) => ({
      ...state,
      currentQuestion: question,
      remainingCountries: remainingAfterQuestion,
      timeRemaining: 10,
      gameStatus: "playing",
    }));

    // Start timer
    const gameSlice = get() as Store;
    gameSlice.startTimer();
  },

  submitAnswer: (selectedOption: string) => {
    const currentState = get() as Store;

    if (
      !currentState.currentQuestion ||
      currentState.gameStatus !== "playing"
    ) {
      return;
    }

    // Stop timer immediately
    const gameSlice = get() as Store;
    gameSlice.stopTimer();

    const isCorrect =
      selectedOption === currentState.currentQuestion.correctAnswer;
    const pointsEarned = isCorrect ? currentState.timeRemaining : 0;

    // Update question with submitted answer
    const updatedQuestion = {
      ...currentState.currentQuestion,
      submittedAnswer: selectedOption,
      isCorrect,
    };

    set((state) => {
      const gameState = state as Store;
      return {
        ...state,
        currentQuestion: updatedQuestion,
        currentScore: gameState.currentScore + pointsEarned,
        questionsAnswered: gameState.questionsAnswered + 1,
        gameStatus: "answered",
      };
    });

    // If incorrect, don't auto-end - wait for user to click continue
    if (!isCorrect) {
      console.log(
        "submitAnswer in gameSlice: incorrect answer, waiting for user to continue"
      );
      // Game will end when user clicks continue button
    }
  },

  nextQuestion: () => {
    const gameSlice = get() as Store;
    gameSlice.generateQuestion();
  },

  startTimer: () => {
    const currentState = get() as Store;

    // Clear existing timer if any
    if (currentState.timerId) {
      clearInterval(currentState.timerId);
    }

    const timerId = setInterval(() => {
      const gameSlice = get() as Store;
      gameSlice.decrementTimer();
    }, 1000);

    set((state) => ({
      ...state,
      timerId,
    }));
  },

  stopTimer: () => {
    const currentState = get() as Store;

    if (currentState.timerId) {
      clearInterval(currentState.timerId);
      set((state) => ({
        ...state,
        timerId: null,
      }));
    }
  },

  decrementTimer: () => {
    const currentState = get() as Store;

    if (currentState.timeRemaining <= 1) {
      // Time's up - auto submit as incorrect
      const gameSlice = get() as Store;
      gameSlice.stopTimer();
      gameSlice.submitAnswer(""); // Empty string will never match correct answer
    } else {
      set((state) => {
        const gameState = state as Store;
        return {
          ...state,
          timeRemaining: gameState.timeRemaining - 1,
        };
      });
    }
  },

  endGame: () => {
    const currentState = get() as Store;

    // Stop timer
    const gameSlice = get() as Store;
    gameSlice.stopTimer();

    // Update high scores
    gameSlice.updateHighScores(currentState.currentScore);

    set((state) => ({
      ...state,
      gameStatus: "gameOver",
    }));
  },

  returnToMenu: () => {
    const gameSlice = get() as Store;
    gameSlice.stopTimer();
    gameSlice.resetCurrentGame();

    set((state) => ({
      ...state,
      gameStatus: "menu",
    }));
  },

  resetCurrentGame: () => {
    set((state) => ({
      ...state,
      currentScore: 0,
      questionsAnswered: 0,
      currentQuestion: null,
      timeRemaining: 10,
      remainingCountries: [],
    }));
  },

  updateHighScores: (newScore: number) => {
    const currentState = get() as Store;

    const updatedScores = [...currentState.highScores, newScore]
      .sort((a, b) => b - a) // Descending order
      .slice(0, 5); // Keep top 5

    set((state) => ({
      ...state,
      highScores: updatedScores,
    }));
  },

  setOptionsCount: (count: number) => {
    set((state) => ({
      ...state,
      optionsCount: count,
    }));
  },
});
