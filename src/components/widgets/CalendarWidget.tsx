"use client";

import React from "react";

const CalendarWidget: React.FC = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const today = currentDate.getDate();

  const monthNames = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ];

  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];

  // Get first day of month and days in month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Convert to Monday = 0

  // Generate calendar days
  const calendarDays: (number | null)[] = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-2 md:p-3 text-white shadow-lg h-full flex flex-col">
      {/* Header */}
      {/* <div className="text-center mb-2">
        <h3 className="text-xs font-medium text-gray-300">
          {monthNames[currentMonth]}
        </h3>
      </div> */}

      {/* Days of week header */}
      {/* <div className="grid grid-cols-7 gap-0.5 mb-1">
        {daysOfWeek.map((day, index) => (
          <div
            key={index}
            className="text-xs text-gray-400 text-center py-0.5 font-medium"
          >
            {day}
          </div>
        ))}
      </div> */}

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5 flex-1">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`
              text-center py-1 text-xs rounded transition-colors flex items-center justify-center
              ${
                day === null
                  ? ""
                  : day === today
                  ? "bg-blue-500 text-white font-bold"
                  : "text-gray-300 hover:bg-gray-700/50"
              }
            `}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarWidget;
