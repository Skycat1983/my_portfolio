import { useMemo } from "react";
import type {
  SingleCommodityResponse,
  // AllCommoditiesResponse,
  MultiCommodityState,
  CommodityValue,
  MultiTimeUnit,
  MultiCommodityChartData,
} from "../../types";
import { useNewStore } from "@/hooks/useStore";
import theme from "@/styles/theme";

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
// export const useMultipleCommodityData = (
//   allCommoditiesResponse: AllCommoditiesResponse | null
// ): TemporalCalculationsResult & { selectedCommodity?: string } => {
//   const result = useMemo(() => {
//     if (!allCommoditiesResponse?.results) {
//       return { timeUnits: [] };
//     }

//     // Find the first successful commodity response
//     const firstSuccessful = allCommoditiesResponse.results.find(
//       (result): result is SingleCommodityResponse => "data" in result
//     );

//     if (!firstSuccessful) {
//       return { timeUnits: [] };
//     }

//     // Transform using the single commodity logic
//     const sortedData = [...firstSuccessful.data].sort(
//       (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
//     );

//     const timeUnits = sortedData.map((dataPoint, index) => {
//       const value = parseFloat(dataPoint.value);
//       const previousValue =
//         index > 0 ? parseFloat(sortedData[index - 1].value) : null;

//       const growth =
//         previousValue !== null
//           ? ((value - previousValue) / previousValue) * 100
//           : undefined;

//       return {
//         name: formatDateToMonthYear(dataPoint.date),
//         dates: [dataPoint.date, dataPoint.date] as [string, string],
//         accumulated: value,
//         growth: growth,
//         unit: "month" as const,
//       };
//     });

//     return {
//       timeUnits,
//       selectedCommodity: firstSuccessful.commodity,
//     };
//   }, [allCommoditiesResponse]);

//   return result;
// };

// New hook for handling multiple selected commodities
export const useMultiCommodityData = (
  multiCommodityState: MultiCommodityState,
  selectedCommodities: CommodityValue[]
): MultiCommodityChartData => {
  const currentTheme = useNewStore((state) => state.theme);

  return useMemo(() => {
    if (!selectedCommodities.length) {
      return {
        timeUnits: [],
        selectedCommodities: [],
        commodityColors: {},
      };
    }

    // Get commodity colors for theme
    const commodityColors: Partial<Record<CommodityValue, string>> = {};
    selectedCommodities.forEach((commodity) => {
      commodityColors[commodity] =
        theme.colors.commodities[commodity]?.[currentTheme] ||
        theme.colors.status.success[currentTheme];
    });

    // Collect all dates from selected commodities
    const allDatesSet = new Set<string>();
    const commodityDataMap: Partial<
      Record<CommodityValue, Record<string, number>>
    > = {};

    selectedCommodities.forEach((commodity) => {
      const commodityEntry = multiCommodityState[commodity];
      if (commodityEntry?.data?.data) {
        commodityDataMap[commodity] = {};

        commodityEntry.data.data.forEach((dataPoint) => {
          allDatesSet.add(dataPoint.date);
          const commodityData = commodityDataMap[commodity];
          if (commodityData) {
            commodityData[dataPoint.date] = parseFloat(dataPoint.value);
          }
        });
      }
    });

    // Sort all dates chronologically
    const sortedDates = Array.from(allDatesSet).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    // Create unified time units with data for all selected commodities
    const timeUnits: MultiTimeUnit[] = sortedDates.map((date) => {
      const timeUnit: MultiTimeUnit = {
        name: formatDateToMonthYear(date),
        date: date,
      };

      // Add data for each selected commodity
      selectedCommodities.forEach((commodity) => {
        const value = commodityDataMap[commodity]?.[date];
        if (value !== undefined) {
          timeUnit[`value_${commodity}`] = value;
          timeUnit[`${commodity}_formatted`] = `$${value.toFixed(2)}`;
        } else {
          // Handle missing data points
          timeUnit[`value_${commodity}`] = null;
          timeUnit[`${commodity}_formatted`] = "N/A";
        }
      });

      return timeUnit;
    });

    return {
      timeUnits,
      selectedCommodities,
      commodityColors,
    };
  }, [multiCommodityState, selectedCommodities, currentTheme]);
};

// Helper function to check if multi-commodity data has valid data
export const hasValidMultiCommodityData = (
  multiCommodityState: MultiCommodityState,
  selectedCommodities: CommodityValue[]
): boolean => {
  return selectedCommodities.some((commodity) => {
    const entry = multiCommodityState[commodity];
    return entry?.data?.data?.length > 0;
  });
};

// Helper function to get date range for selected commodities
export const getMultiCommodityDateRange = (
  multiCommodityState: MultiCommodityState,
  selectedCommodities: CommodityValue[]
): { startDate: string; endDate: string } | null => {
  const allDates: string[] = [];

  selectedCommodities.forEach((commodity) => {
    const entry = multiCommodityState[commodity];
    if (entry?.data?.data) {
      entry.data.data.forEach((dataPoint) => {
        allDates.push(dataPoint.date);
      });
    }
  });

  if (allDates.length === 0) return null;

  const sortedDates = allDates.sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  return {
    startDate: sortedDates[0],
    endDate: sortedDates[sortedDates.length - 1],
  };
};
