import { useNewStore } from "@/hooks/useStore";
import { EARTH1 } from "@/constants/images";
import { TimerDisplay } from "./TimerDisplay";

const gameBackgroundImage = EARTH1;

export const GameInterface = () => {
  const {
    currentQuestion,
    currentScore,
    questionsAnswered,
    timeRemaining,
    gameStatus,
    questionType,
    submitAnswer,
    nextQuestion,
    endGame,
  } = useNewStore();

  const handleOptionClick = (option: string) => {
    console.log("handleOptionClick in GameInterface: selected option", option);
    if (gameStatus === "playing") {
      submitAnswer(option);
    }
  };

  const handleContinueClick = () => {
    console.log(
      "handleContinueClick in GameInterface: continuing after answer"
    );
    if (gameStatus === "answered") {
      if (currentQuestion?.isCorrect) {
        nextQuestion();
      } else {
        endGame();
      }
    }
  };

  if (!currentQuestion) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading question...</div>
      </div>
    );
  }

  // Determine question text based on game mode
  const getQuestionText = () => {
    if (gameStatus === "answered") {
      if (currentQuestion.isCorrect) {
        return `Correct! +${timeRemaining} points`;
      } else {
        return "Incorrect! Game Over";
      }
    }

    if (questionType === "capital") {
      return "Which capital city belongs to this flag?";
    } else {
      return "Which country does this flag belong to?";
    }
  };

  return (
    <div className="h-full w-full relative bg-gradient-to-br from-blue-50 to-indigo-100 p-2 overflow-hidden min-w-[375px]">
      {/* Background Image */}
      <img
        src={gameBackgroundImage}
        alt="Background"
        className="absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] object-cover opacity-20 rounded"
      />

      {/* Game Header */}
      <div className="relative z-10 flex justify-between items-center p-4 bg-white bg-opacity-90 rounded-lg shadow-lg m-4 mt-6">
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
      <div
        className="relative z-10 flex-1 flex flex-col items-center justify-center p-4"
        onClick={gameStatus === "answered" ? handleContinueClick : undefined}
        style={{ cursor: gameStatus === "answered" ? "pointer" : "default" }}
      >
        <div className="bg-white bg-opacity-95 rounded-lg shadow-xl p-8 w-full max-w-lg max-h-full">
          {/* Question Text - Fixed Height */}
          <div className="h-16 flex items-center justify-center mb-4">
            <h2
              className={`text-xl font-semibold text-center ${
                gameStatus === "answered"
                  ? currentQuestion.isCorrect
                    ? "text-green-800"
                    : "text-red-800"
                  : "text-gray-800"
              }`}
            >
              {getQuestionText()}
            </h2>
          </div>

          <div className="flex justify-center mb-6">
            <img
              src={currentQuestion.flagUrl}
              alt={currentQuestion.flagAlt}
              className="max-w-full h-32 rounded-lg shadow-md border-2 border-gray-200 object-contain"
            />
          </div>

          {/* Answer Options - 2x2 Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {currentQuestion.options.map((option, index) => {
              let buttonStyle =
                "w-full p-4 rounded-lg font-semibold transition-colors duration-200 border-2 text-white ";

              if (gameStatus === "answered") {
                if (option === currentQuestion.correctAnswer) {
                  buttonStyle += "bg-green-600 border-green-600"; // Correct answer
                } else if (option === currentQuestion.submittedAnswer) {
                  buttonStyle += "bg-red-600 border-red-600"; // Wrong answer selected
                } else {
                  buttonStyle += "bg-gray-500 border-gray-500"; // Other options
                }
              } else {
                buttonStyle +=
                  "bg-indigo-600 border-indigo-600 hover:bg-indigo-700 hover:border-indigo-700";
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

          {/* Click to Continue Instruction - Fixed Height */}
          <div className="h-6 text-center flex items-center justify-center">
            {gameStatus === "answered" && (
              <p className="text-sm text-gray-600 italic">
                Click anywhere to continue...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
