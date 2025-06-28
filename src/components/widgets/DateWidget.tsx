import React from "react";

const DateWidget: React.FC = () => {
  const currentDate = new Date();
  const dayOfWeek = currentDate.toLocaleDateString("en-US", {
    weekday: "short",
  });
  const month = currentDate.toLocaleDateString("en-US", { month: "short" });
  const day = currentDate.getDate();

  return (
    <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 text-white shadow-lg flex flex-col items-center justify-center h-full min-h-32 w-full">
      {/* Day and Month */}
      <div className="text-center mb-2">
        <p className="text-lg font-medium text-gray-300">
          {dayOfWeek} {month}
        </p>
      </div>

      {/* Large Day Number */}
      <div className="text-center">
        <span className="text-6xl font-bold text-white leading-none">
          {day}
        </span>
      </div>
    </div>
  );
};

export default DateWidget;
