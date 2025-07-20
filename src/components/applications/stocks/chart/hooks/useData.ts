import { useMemo } from "react";

type TemporalTimeframe = "hour" | "day" | "week" | "month" | "year";

interface TemporalData {
  values: number[];
  timeframe: TemporalTimeframe;
}

interface TimeUnit {
  name: string;
  dates: [string, string]; // [startDate, endDate]
  accumulated: number;
  growth: number | undefined;
  unit: TemporalTimeframe;
}
export interface TemporalCalculationsResult {
  timeUnits: TimeUnit[];
}

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const generateTimeLabel = (
  index: number,
  totalPoints: number,
  timeframe: TemporalTimeframe
): { name: string; dates: [string, string] } => {
  const now = new Date();
  const reversedIndex = totalPoints - 1 - index;

  switch (timeframe) {
    case "week": {
      const targetDate = new Date(now);
      targetDate.setDate(now.getDate() - reversedIndex * 7);
      const weekEnd = new Date(targetDate);
      weekEnd.setDate(weekEnd.getDate() + 6);
      return {
        name: `Week ${targetDate.getWeek()}`,
        dates: [
          targetDate.toISOString().split("T")[0],
          weekEnd.toISOString().split("T")[0],
        ],
      };
    }
    case "day": {
      const targetDate = new Date(now);
      targetDate.setDate(now.getDate() - reversedIndex);
      return {
        name: DAYS_OF_WEEK[targetDate.getDay()],
        dates: [
          targetDate.toISOString().split("T")[0],
          targetDate.toISOString().split("T")[0],
        ],
      };
    }
    default:
      throw new Error(`Unsupported timeframe: ${timeframe}`);
  }
};

export const useData = ({
  values,
  timeframe,
}: TemporalData): TemporalCalculationsResult => {
  const timeUnits = useMemo(() => {
    return values.map((value, index) => {
      const { name, dates } = generateTimeLabel(
        index,
        values.length,
        timeframe
      );

      return {
        name,
        dates,
        accumulated: value,
        growth: index === 0 ? undefined : value - values[index - 1],
        unit: timeframe,
      };
    });
  }, [values, timeframe]);

  return {
    timeUnits,
  };
};

declare global {
  interface Date {
    getWeek(): number;
  }
}

Date.prototype.getWeek = function (): number {
  const firstDayOfYear = new Date(this.getFullYear(), 0, 1);
  return Math.ceil(
    ((this.getTime() - firstDayOfYear.getTime()) / 86400000 +
      firstDayOfYear.getDay() +
      1) /
      7
  );
};
