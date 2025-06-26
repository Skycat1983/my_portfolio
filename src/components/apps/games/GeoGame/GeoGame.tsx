import { useEffect } from "react";
import { useNewStore } from "../../../../hooks/useStore";

// Game Menu Component
const GameMenu = () => {
  const { highScores, startGame, isLoadingCountries, loadingError } =
    useNewStore();

  const handleStartCountryGame = () => {
    console.log("handleStartCountryGame in GameMenu: starting country game");
    startGame("country");
  };

  const handleStartCapitalGame = () => {
    console.log("handleStartCapitalGame in GameMenu: starting capital game");
    startGame("capital");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-indigo-900 mb-2">
          🌍 Flag Quest
        </h1>
        <p className="text-lg text-indigo-700">
          How many flags can you identify before making a mistake?
        </p>
      </div>

      {/* Game Mode Selection */}
      <div className="flex flex-col gap-4 mb-8">
        <button
          onClick={handleStartCountryGame}
          disabled={isLoadingCountries}
          className="px-8 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 min-w-64"
          tabIndex={0}
          aria-label="Play with country names"
        >
          {isLoadingCountries
            ? "Loading Countries..."
            : "🏁 Play with Countries"}
        </button>

        <button
          onClick={handleStartCapitalGame}
          disabled={isLoadingCountries}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 min-w-64"
          tabIndex={0}
          aria-label="Play with capital cities"
        >
          {isLoadingCountries
            ? "Loading Countries..."
            : "🏛️ Play with Capitals"}
        </button>
      </div>

      {/* Error Display */}
      {loadingError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-semibold">Error loading countries:</p>
          <p>{loadingError}</p>
        </div>
      )}

      {/* High Scores */}
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-64">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          🏆 High Scores
        </h2>
        {highScores.length > 0 ? (
          <ol className="space-y-2">
            {highScores.map((score, index) => (
              <li
                key={index}
                className={`flex justify-between items-center p-2 rounded ${
                  index === 0
                    ? "bg-yellow-100 text-yellow-800"
                    : index === 1
                    ? "bg-gray-100 text-gray-700"
                    : index === 2
                    ? "bg-orange-100 text-orange-700"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                <span className="font-semibold">#{index + 1}</span>
                <span className="font-bold">{score} points</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-gray-500 text-center">No scores yet!</p>
        )}
      </div>

      {/* How to Play */}
      <div className="mt-6 max-w-md text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          How to Play
        </h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Look at the flag and choose the correct answer</li>
          <li>• You have 10 seconds per question</li>
          <li>• Points = remaining seconds when you answer</li>
          <li>• One wrong answer ends the game!</li>
        </ul>
      </div>
    </div>
  );
};

// Timer Display Component
const TimerDisplay = () => {
  const { timeRemaining } = useNewStore();

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeRemaining / 10) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="50" height="50" className="transform -rotate-90">
        <circle
          cx="25"
          cy="25"
          r={radius}
          stroke="rgb(229, 231, 235)"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx="25"
          cy="25"
          r={radius}
          stroke={
            timeRemaining > 5
              ? "rgb(34, 197, 94)"
              : timeRemaining > 2
              ? "rgb(251, 146, 60)"
              : "rgb(239, 68, 68)"
          }
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <span
        className={`absolute text-lg font-bold ${
          timeRemaining > 5
            ? "text-green-600"
            : timeRemaining > 2
            ? "text-orange-500"
            : "text-red-500"
        }`}
      >
        {timeRemaining}
      </span>
    </div>
  );
};

// Game Interface Component
const GameInterface = () => {
  const {
    currentQuestion,
    currentScore,
    questionsAnswered,
    timeRemaining,
    gameStatus,
    submitAnswer,
    nextQuestion,
  } = useNewStore();

  const handleOptionClick = (option: string) => {
    console.log("handleOptionClick in GameInterface: selected option", option);
    if (gameStatus === "playing") {
      submitAnswer(option);
    }
  };

  const handleNextQuestion = () => {
    console.log(
      "handleNextQuestion in GameInterface: proceeding to next question"
    );
    nextQuestion();
  };

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="text-xl text-gray-600">Loading question...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Game Header */}
      <div className="flex justify-between items-center mb-6 bg-white rounded-lg shadow-lg p-4">
        <div className="text-lg">
          <span className="text-gray-600">Score: </span>
          <span className="font-bold text-indigo-600">{currentScore}</span>
        </div>
        <div className="text-lg">
          <span className="text-gray-600">Question: </span>
          <span className="font-bold text-indigo-600">
            {questionsAnswered + 1}
          </span>
        </div>
        <TimerDisplay />
      </div>

      {/* Flag Display */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6 max-w-lg w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Which{" "}
            {currentQuestion.options.includes(currentQuestion.correctAnswer)
              ? currentQuestion.correctAnswer.includes(" ") &&
                currentQuestion.correctAnswer.charAt(0) ===
                  currentQuestion.correctAnswer.charAt(0).toUpperCase()
                ? "capital city"
                : "country"
              : "answer"}{" "}
            does this flag represent?
          </h2>

          <div className="flex justify-center mb-6">
            <img
              src={currentQuestion.flagUrl}
              alt={currentQuestion.flagAlt}
              className="max-w-full max-h-48 rounded-lg shadow-md border-2 border-gray-200"
              style={{ minHeight: "120px", objectFit: "contain" }}
            />
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((option, index) => {
              let buttonStyle =
                "w-full p-4 rounded-lg font-semibold transition-all duration-200 border-2 ";

              if (gameStatus === "answered") {
                if (option === currentQuestion.correctAnswer) {
                  buttonStyle += "bg-green-100 border-green-500 text-green-800"; // Correct answer
                } else if (option === currentQuestion.submittedAnswer) {
                  buttonStyle += "bg-red-100 border-red-500 text-red-800"; // Wrong answer selected
                } else {
                  buttonStyle += "bg-gray-100 border-gray-300 text-gray-600"; // Other options
                }
              } else {
                buttonStyle +=
                  "bg-white border-gray-300 text-gray-700 hover:bg-indigo-50 hover:border-indigo-400 transform hover:scale-105";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  disabled={gameStatus !== "playing"}
                  className={buttonStyle}
                  tabIndex={0}
                  aria-label={`Option ${index + 1}: ${option}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {/* Next Question Button */}
          {gameStatus === "answered" && currentQuestion.isCorrect && (
            <div className="mt-6 text-center">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                tabIndex={0}
                aria-label="Continue to next question"
              >
                Next Question →
              </button>
            </div>
          )}

          {/* Feedback Display */}
          {gameStatus === "answered" && (
            <div
              className={`mt-4 p-3 rounded-lg text-center font-semibold ${
                currentQuestion.isCorrect
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {currentQuestion.isCorrect
                ? `Correct! +${timeRemaining} points`
                : "Incorrect! Game Over"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Game Over Screen Component
const GameOverScreen = () => {
  const {
    currentScore,
    questionsAnswered,
    highScores,
    returnToMenu,
    startGame,
    questionType,
  } = useNewStore();

  const isNewHighScore = highScores.includes(currentScore) && currentScore > 0;
  const rank = highScores.indexOf(currentScore) + 1;

  const handlePlayAgain = () => {
    console.log("handlePlayAgain in GameOverScreen: restarting game");
    startGame(questionType);
  };

  const handleBackToMenu = () => {
    console.log("handleBackToMenu in GameOverScreen: returning to menu");
    returnToMenu();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6 bg-gradient-to-br from-red-50 to-pink-100">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Game Over!</h1>

        {/* Score Display */}
        <div className="mb-6">
          <div className="text-5xl font-bold text-indigo-600 mb-2">
            {currentScore}
          </div>
          <div className="text-lg text-gray-600">Final Score</div>
        </div>

        {/* High Score Notification */}
        {isNewHighScore && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">
            <p className="font-semibold">🎉 New High Score!</p>
            <p>
              Rank #{rank} out of {highScores.length}
            </p>
          </div>
        )}

        {/* Game Stats */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-lg font-semibold text-gray-800 mb-2">
            Game Statistics
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Questions Answered:</span>
            <span className="font-semibold">{questionsAnswered}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Average Points:</span>
            <span className="font-semibold">
              {questionsAnswered > 0
                ? Math.round(currentScore / questionsAnswered)
                : 0}
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Game Mode:</span>
            <span className="font-semibold capitalize">{questionType}s</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handlePlayAgain}
            className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            tabIndex={0}
            aria-label="Play again with same game mode"
          >
            🔄 Play Again
          </button>

          <button
            onClick={handleBackToMenu}
            className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            tabIndex={0}
            aria-label="Return to main menu"
          >
            🏠 Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

// Main GeoGame Component
export const GeoGame = ({ windowId }: { windowId: string }) => {
  const window = useNewStore((s) => s.getWindowById(windowId));
  console.log("GeoGame: window", window);
  // const windowId = window?.windowId;
  console.log("GeoGame: windowId", windowId);
  const gameStatus = useNewStore((s) => s.gameStatus);
  const loadCountries = useNewStore((s) => s.loadCountries);
  const isLoadingCountries = useNewStore((s) => s.isLoadingCountries);
  const countries = useNewStore((s) => s.countries);

  // Load countries on component mount
  useEffect(() => {
    console.log("GeoGame useEffect: loading countries on mount");
    if (!isLoadingCountries && countries.length === 0) {
      loadCountries();
    }
  }, [isLoadingCountries, countries.length]); // Removed loadCountries from dependencies to prevent infinite loop

  // Render appropriate screen based on game status
  switch (gameStatus) {
    case "menu":
      return <GameMenu />;
    case "playing":
    case "answered":
      return <GameInterface />;
    case "gameOver":
      return <GameOverScreen />;
    default:
      return <GameMenu />;
  }
};
