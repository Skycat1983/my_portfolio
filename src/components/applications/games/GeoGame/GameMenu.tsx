import { useNewStore } from "@/hooks/useStore";
import { EARTH2, PLANET } from "@/constants/images";

const titleBackgroundImage = EARTH2;

export const GameMenu = () => {
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
    <div className="h-full w-full relative bg-gradient-to-br from-blue-50 to-indigo-100 p-2 overflow-hidden min-w-[375px]">
      {/* Background Image */}
      <img
        src={titleBackgroundImage}
        alt="Background"
        className="absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] object-cover opacity-20 rounded"
      />

      {/* Content Container */}
      <div className="relative h-full flex flex-col items-center justify-center pt-32">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img src={PLANET} alt="Planet" className="w-16 h-16" />
            <h1 className="text-4xl font-bold text-indigo-900">Flag Quest</h1>
            <img src={PLANET} alt="Planet" className="w-16 h-16" />
          </div>
          <p className="text-lg text-indigo-700">Game of the Year Edition</p>
        </div>

        {/* Game Mode Selection */}
        <div className="flex flex-col gap-4 mb-8">
          <button
            onClick={handleStartCountryGame}
            disabled={isLoadingCountries}
            className="px-8 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200 min-w-64"
            tabIndex={0}
            aria-label="Play with country names"
          >
            {isLoadingCountries
              ? "Loading Countries..."
              : "Play with Countries"}
          </button>

          <button
            onClick={handleStartCapitalGame}
            disabled={isLoadingCountries}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200 min-w-64"
            tabIndex={0}
            aria-label="Play with capital cities"
          >
            {isLoadingCountries ? "Loading Countries..." : "Play with Capitals"}
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
        <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-6 min-w-64 mb-6">
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
        <div className="max-w-md text-center">
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
    </div>
  );
};
