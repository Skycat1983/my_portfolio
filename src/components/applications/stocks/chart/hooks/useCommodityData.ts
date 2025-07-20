import { useMemo } from "react";
import type {
  SingleCommodityResponse,
  AllCommoditiesResponse,
} from "../../types";

// Reuse the existing types from useData
export interface TemporalCalculationsResult {
  timeUnits: TimeUnit[];
}

interface TimeUnit {
  name: string;
  dates: [string, string]; // [startDate, endDate]
  accumulated: number;
  growth: number | undefined;
  unit: "month" | "year"; // We're working with monthly/yearly commodity data
}

const formatDateToMonthYear = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  }); // "Jun 2025"
};

export const useCommodityData = (
  commodityResponse: SingleCommodityResponse | null
): TemporalCalculationsResult => {
  const timeUnits = useMemo(() => {
    if (!commodityResponse?.data) {
      return [];
    }

    // Sort data by date (oldest first) to ensure proper growth calculations
    const sortedData = [...commodityResponse.data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return sortedData.map((dataPoint, index) => {
      const value = parseFloat(dataPoint.value);
      const previousValue =
        index > 0 ? parseFloat(sortedData[index - 1].value) : null;

      // Calculate month-over-month growth percentage
      const growth =
        previousValue !== null
          ? ((value - previousValue) / previousValue) * 100
          : undefined;

      return {
        name: formatDateToMonthYear(dataPoint.date),
        dates: [dataPoint.date, dataPoint.date] as [string, string], // Same date for start/end since it's monthly data
        accumulated: value,
        growth: growth,
        unit: "month" as const,
      };
    });
  }, [commodityResponse]);

  return { timeUnits };
};

// Hook for handling multiple commodities - returns data for the first successful commodity
export const useMultipleCommodityData = (
  allCommoditiesResponse: AllCommoditiesResponse | null
): TemporalCalculationsResult & { selectedCommodity?: string } => {
  const result = useMemo(() => {
    if (!allCommoditiesResponse?.results) {
      return { timeUnits: [] };
    }

    // Find the first successful commodity response
    const firstSuccessful = allCommoditiesResponse.results.find(
      (result): result is SingleCommodityResponse => "data" in result
    );

    if (!firstSuccessful) {
      return { timeUnits: [] };
    }

    // Transform using the single commodity logic
    const sortedData = [...firstSuccessful.data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const timeUnits = sortedData.map((dataPoint, index) => {
      const value = parseFloat(dataPoint.value);
      const previousValue =
        index > 0 ? parseFloat(sortedData[index - 1].value) : null;

      const growth =
        previousValue !== null
          ? ((value - previousValue) / previousValue) * 100
          : undefined;

      return {
        name: formatDateToMonthYear(dataPoint.date),
        dates: [dataPoint.date, dataPoint.date] as [string, string],
        accumulated: value,
        growth: growth,
        unit: "month" as const,
      };
    });

    return {
      timeUnits,
      selectedCommodity: firstSuccessful.commodity,
    };
  }, [allCommoditiesResponse]);

  return result;
};
