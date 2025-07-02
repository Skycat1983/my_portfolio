import { useNewStore } from "@/hooks/useStore";

export const TimerDisplay = () => {
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
