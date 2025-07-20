export const calculateMetrics = {
  // percentage change between two values
  percentageChange: (current: number, previous: number): number => {
    if (previous === 0) return 0;
    return Number(((current - previous) / previous) * 100);
  },

  // average for a window of values
  rollingAverage: (
    values: number[],
    currentIndex: number,
    windowSize: number
  ): number => {
    const start = Math.max(0, currentIndex - windowSize + 1);
    const window = values.slice(start, currentIndex + 1);
    return Number(
      (window.reduce((acc, val) => acc + val, 0) / window.length).toFixed(2)
    );
  },

  // 3-month rolling average (for monthly commodity data)
  threeMonthAverage: (values: number[], currentIndex: number): number => {
    return calculateMetrics.rollingAverage(values, currentIndex, 3);
  },

  // 12-month rolling average (for yearly analysis)
  twelveMonthAverage: (values: number[], currentIndex: number): number => {
    return calculateMetrics.rollingAverage(values, currentIndex, 12);
  },

  // month-over-month change
  monthOverMonthChange: (values: number[], currentIndex: number): number => {
    if (currentIndex < 1) return 0;
    return calculateMetrics.percentageChange(
      values[currentIndex],
      values[currentIndex - 1]
    );
  },

  // year-over-year change (12 months ago)
  yearOverYearChange: (values: number[], currentIndex: number): number => {
    if (currentIndex < 12) return 0;
    return calculateMetrics.percentageChange(
      values[currentIndex],
      values[currentIndex - 12]
    );
  },

  // week-over-week change (legacy - kept for compatibility)
  weekOverWeekChange: (values: number[], currentIndex: number): number => {
    if (currentIndex < 7) return 0;
    return calculateMetrics.percentageChange(
      values[currentIndex],
      values[currentIndex - 7]
    );
  },

  //  range metrics
  range: (values: number[]): { min: number; max: number; range: number } => {
    const min = Math.min(...values);
    const max = Math.max(...values);
    return {
      min,
      max,
      range: max - min,
    };
  },

  // streak information
  streak: (
    changes: number[],
    currentIndex: number
  ): {
    currentStreak: number;
    isInStreak: boolean;
  } => {
    if (currentIndex === 0) return { currentStreak: 0, isInStreak: false };

    let currentStreak = 0;
    let previousStreak = 0;

    for (let i = currentIndex; i > 0; i--) {
      const change = changes[i];
      if (change > 0) {
        currentStreak = previousStreak >= 0 ? previousStreak + 1 : 1;
      } else if (change < 0) {
        currentStreak = previousStreak <= 0 ? previousStreak - 1 : -1;
      } else {
        break;
      }
      previousStreak = currentStreak;
    }

    return {
      currentStreak,
      isInStreak: currentStreak !== 0,
    };
  },

  // volatility calculation (standard deviation of percentage changes)
  volatility: (values: number[], windowSize: number = 12): number => {
    if (values.length < 2) return 0;

    const changes = values
      .slice(1)
      .map((value, index) =>
        calculateMetrics.percentageChange(value, values[index])
      );

    const recentChanges = changes.slice(-windowSize);
    const mean =
      recentChanges.reduce((sum, change) => sum + change, 0) /
      recentChanges.length;
    const variance =
      recentChanges.reduce(
        (sum, change) => sum + Math.pow(change - mean, 2),
        0
      ) / recentChanges.length;

    return Number(Math.sqrt(variance).toFixed(2));
  },

  // price momentum indicator
  momentum: (values: number[], periods: number = 3): number => {
    if (values.length < periods + 1) return 0;
    const current = values[values.length - 1];
    const past = values[values.length - 1 - periods];
    return calculateMetrics.percentageChange(current, past);
  },

  // support and resistance levels
  supportResistance: (values: number[], windowSize: number = 12) => {
    if (values.length < windowSize) return null;

    const recentValues = values.slice(-windowSize);
    const sorted = [...recentValues].sort((a, b) => a - b);

    return {
      support: sorted[0], // Lowest value in window
      resistance: sorted[sorted.length - 1], // Highest value in window
      currentPosition:
        ((values[values.length - 1] - sorted[0]) /
          (sorted[sorted.length - 1] - sorted[0])) *
        100,
    };
  },

  analyzeStreaks: (timeUnits: { growth: number | undefined }[]) => {
    let currentStreak = 0;
    let longestStreak = 0;
    let shortestStreak = Infinity;
    let currentStreakStart = 0;
    let currentStreakGains: number[] = [];
    const streakGains: { start: number; end: number; gains: number[] }[] = [];

    const processStreak = (endIndex: number) => {
      if (currentStreak > 0) {
        longestStreak = Math.max(longestStreak, currentStreak);
        shortestStreak = Math.min(shortestStreak, currentStreak);
        streakGains.push({
          start: currentStreakStart,
          end: endIndex,
          gains: currentStreakGains,
        });
      }
      currentStreak = 0;
      currentStreakGains = [];
    };

    timeUnits.forEach((unit, index) => {
      if (unit.growth === undefined) {
        // If we're in a streak, end it
        if (currentStreak > 0) {
          processStreak(index - 1);
        }
        return;
      }

      if (unit.growth > 0) {
        // Positive growth continues or starts streak
        if (currentStreak === 0) {
          currentStreakStart = index;
        }
        currentStreak++;
        currentStreakGains.push(unit.growth);
      } else if (unit.growth < 0) {
        // Negative growth ends streak
        if (currentStreak > 0) {
          processStreak(index - 1);
        }
      }
    });

    if (currentStreak > 0) {
      processStreak(timeUnits.length - 1);
    }

    const currentStreakInfo = { length: 0, gains: [] as number[] };
    for (let i = timeUnits.length - 1; i >= 0; i--) {
      const growth = timeUnits[i].growth;
      if (growth === undefined) break;
      if (growth <= 0) break;
      currentStreakInfo.length++;
      currentStreakInfo.gains.push(growth);
    }

    const streakStats = streakGains.map((streak) => ({
      length: streak.end - streak.start + 1,
      totalGain: streak.gains.reduce((sum, gain) => sum + gain, 0),
      averageGain:
        streak.gains.reduce((sum, gain) => sum + gain, 0) / streak.gains.length,
      startIndex: streak.start,
      endIndex: streak.end,
    }));

    return {
      currentStreak: currentStreakInfo.length,
      currentStreakGains: currentStreakInfo.gains,
      longestStreak,
      shortestStreak: shortestStreak === Infinity ? 0 : shortestStreak,
      streakCount: streakGains.length,
      streakStats,
      mostRecentStreak: streakGains[streakGains.length - 1]
        ? {
            startIndex: streakGains[streakGains.length - 1].start,
            endIndex: streakGains[streakGains.length - 1].end,
            gains: streakGains[streakGains.length - 1].gains,
          }
        : null,
    };
  },
};
