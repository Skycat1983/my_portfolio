import { useNewStore } from "@/hooks/useStore";
import { EARTH1 } from "@/constants/images";

const gameBackgroundImage = EARTH1;

export const GameOverScreen = () => {
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
    <div className="h-full w-full relative bg-gradient-to-br from-red-50 to-pink-100 p-2 overflow-hidden">
      {/* Background Image */}
      <img
        src={gameBackgroundImage}
        alt="Background"
        className="absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] object-cover opacity-20 rounded"
      />

      <div className="relative flex flex-col items-center justify-center p-4 ">
        <div className="bg-white bg-opacity-95 rounded-lg shadow-xl p-8 max-w-md w-full text-center">
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
              <p className="font-semibold">🏆 New High Score!</p>
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
              className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200"
              tabIndex={0}
              aria-label="Play again with same game mode"
            >
              Play Again
            </button>

            <button
              onClick={handleBackToMenu}
              className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200"
              tabIndex={0}
              aria-label="Return to main menu"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
