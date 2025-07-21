import type {
  AllCommoditiesResponse,
  SingleCommodityResponse,
  MultiCommodityState,
  CommodityValue,
} from "../types";
import { useMemo } from "react";
import AnalysisToolbar from "./AnalysisToolbar";
import { useNewStore } from "@/hooks/useStore";
import { Line, Area, Bar, ReferenceLine } from "recharts";
import {
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
} from "recharts";
import theme from "@/styles/theme";
import { useGraph } from "./hooks/useGraph";
import {
  useCommodityData,
  useMultipleCommodityData,
  useMultiCommodityData,
} from "./hooks/useCommodityData";
import { COMMODITY_OPTIONS } from "../types";

interface CommodityResultsProps {
  // Legacy props (for backward compatibility)
  data: SingleCommodityResponse | AllCommoditiesResponse | null;
  error: string | null;
  selectedCommodity?: string; // For selecting specific commodity from multi-commodity response

  // New multi-commodity props (optional for backward compatibility)
  multiCommodityData?: MultiCommodityState;
  selectedCommodities?: CommodityValue[];
}

/**
 * Commodity Chart Component
 *
 * Features:
 * - Theme-aware commodity-specific colors (darker in light mode, lighter in dark mode)
 * - Smart Y-axis domain calculation for nice round axis labels
 * - Support for both single commodity and multi-commodity data
 * - Dynamic theming integration with unique colors for each commodity
 * - Interactive chart controls (zoom, pan, toggle views)
 */

const Chart = ({
  data,
  selectedCommodity,
  multiCommodityData,
  selectedCommodities = [],
}: CommodityResultsProps) => {
  const currentTheme = useNewStore((state) => state.theme);

  // Check if we're in multi-commodity mode
  const isMultiMode = Boolean(
    multiCommodityData && selectedCommodities.length > 1
  );

  console.log(
    "Chart render mode:",
    isMultiMode ? "Multi-commodity" : "Single commodity"
  );
  console.log("Selected commodities:", selectedCommodities);

  // Get current commodity color using theme-aware colors (for single commodity mode)
  const getCurrentCommodityColor = () => {
    const commodityColors = theme.colors.commodities;

    if (data && "data" in data) {
      // Single commodity
      const commodity = data.commodity as keyof typeof commodityColors;
      return (
        commodityColors[commodity]?.[currentTheme] ||
        theme.colors.status.success[currentTheme]
      );
    } else if (selectedCommodity) {
      // Selected from multiple commodities
      const commodity = selectedCommodity as keyof typeof commodityColors;
      return (
        commodityColors[commodity]?.[currentTheme] ||
        theme.colors.status.success[currentTheme]
      );
    }
    // Default for all commodities index
    return commodityColors.ALL_COMMODITIES[currentTheme];
  };

  const currentColor = getCurrentCommodityColor();

  // Legacy color array (kept for backward compatibility with existing chart components)
  const colours = [currentColor];

  // Transform commodity data to chart format (hooks at top level)
  const singleCommodityData = useCommodityData(
    data && "data" in data ? data : null
  );

  const multipleCommodityData = useMultipleCommodityData(
    data && "type" in data ? data : null
  );

  // New multi-commodity data processing
  const multiCommodityChartData = useMultiCommodityData(
    multiCommodityData || {},
    selectedCommodities
  );

  // Select the appropriate data based on mode and response type
  const commodityData = useMemo(() => {
    if (isMultiMode) {
      // Multi-commodity mode: use new multi-commodity data
      console.log("Using multi-commodity data:", multiCommodityChartData);
      return {
        timeUnits: multiCommodityChartData.timeUnits.map((unit) => ({
          name: unit.name,
          dates: [unit.date, unit.date] as [string, string],
          accumulated: 0, // Not used in multi-mode
          growth: 0, // Not used in multi-mode
          unit: "month" as const,
        })),
      };
    }

    // Legacy single commodity mode
    if (!data) return { timeUnits: [] };

    if ("data" in data) {
      return singleCommodityData;
    }

    // For multiple commodities, filter by selected commodity if specified
    if (selectedCommodity && "type" in data) {
      const selectedResult = data.results.find(
        (result): result is SingleCommodityResponse =>
          "data" in result && result.commodity === selectedCommodity
      );

      if (selectedResult) {
        // Transform the selected commodity data using the same logic as useCommodityData
        const sortedData = [...selectedResult.data].sort(
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

          const formatDateToMonthYear = (dateString: string): string => {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            });
          };

          return {
            name: formatDateToMonthYear(dataPoint.date),
            dates: [dataPoint.date, dataPoint.date] as [string, string],
            accumulated: value,
            growth: growth,
            unit: "month" as const,
          };
        });

        return { timeUnits };
      }
    }

    return multipleCommodityData;
  }, [
    data,
    singleCommodityData,
    multipleCommodityData,
    selectedCommodity,
    isMultiMode,
    multiCommodityChartData,
  ]);

  const {
    graphData,
    graphType,
    valueType,
    showAverage,
    showRange,
    graphRange,
    toggleGraphType,
    toggleValueType,
    toggleShowAverage,
    toggleShowRange,
    handleZoomIn,
    handleZoomOut,
    handleShiftLeft,
    handleShiftRight,
  } = useGraph({ contactsData: commodityData || { timeUnits: [] } });

  const { mainData, averageData, rangeData } = graphData;

  const canZoomIn = useMemo(() => {
    const currentRange = graphRange[1] - graphRange[0];
    return currentRange > 5;
  }, [graphRange]);

  const canZoomOut = useMemo(() => {
    const currentRange = graphRange[1] - graphRange[0];
    return currentRange < mainData.length;
  }, [graphRange, mainData]);

  const canShiftLeft = useMemo(() => {
    return graphRange[0] > 0;
  }, [graphRange]);

  const canShiftRight = useMemo(() => {
    return graphRange[1] < mainData.length - 1;
  }, [graphRange, mainData]);

  // Multi-commodity chart data preparation
  const multiChartData = useMemo(() => {
    if (!isMultiMode) return [];

    return multiCommodityChartData.timeUnits.slice(
      graphRange[0],
      graphRange[1] + 1
    );
  }, [isMultiMode, multiCommodityChartData, graphRange]);

  const visibleData = useMemo(() => {
    return isMultiMode
      ? multiChartData
      : mainData.slice(graphRange[0], graphRange[1] + 1);
  }, [isMultiMode, multiChartData, mainData, graphRange]);

  console.log("GRAPH_CHART visibleData", visibleData);

  const visibleAverageData = useMemo(() => {
    return averageData?.slice(graphRange[0], graphRange[1] + 1);
  }, [averageData, graphRange]);

  // Function to calculate a "nice" upper bound for the y-axis
  const getNiceUpperBound = (maxValue: number): number => {
    if (maxValue <= 0) return 0;

    // Calculate the order of magnitude
    const magnitude = Math.floor(Math.log10(maxValue));
    const powerOf10 = Math.pow(10, magnitude);

    // Normalize the max value to be between 1 and 10
    const normalizedMax = maxValue / powerOf10;

    // Determine nice step based on normalized value
    let niceStep: number;
    if (normalizedMax <= 1) niceStep = 1;
    else if (normalizedMax <= 2) niceStep = 2;
    else if (normalizedMax <= 2.5) niceStep = 2.5;
    else if (normalizedMax <= 5) niceStep = 5;
    else niceStep = 10;

    // Scale back up and round up to next nice value
    const niceUpperBound =
      Math.ceil(normalizedMax / niceStep) * niceStep * powerOf10;

    return niceUpperBound;
  };

  // Enhanced Y-axis domain calculation for multi-commodity support
  const yDomain = useMemo(() => {
    // Helper function to calculate nice axis bounds
    const calculateNiceAxisBounds = (min: number, max: number) => {
      // For growth values, handle symmetrically around zero
      if (valueType === "growth") {
        const absMax = Math.max(Math.abs(min), Math.abs(max));
        const niceMax = getNiceUpperBound(absMax);
        return [-niceMax, niceMax];
      }

      // For positive values, start from 0 and find nice upper bound
      const niceMax = getNiceUpperBound(max);
      return [0, niceMax];
    };

    if (visibleData.length === 0) return [0, 100];

    if (isMultiMode && selectedCommodities.length > 0) {
      // Multi-commodity mode: calculate range across all selected commodities
      const allValues: number[] = [];

      visibleData.forEach((dataPoint: any) => {
        selectedCommodities.forEach((commodity) => {
          const value = dataPoint[`value_${commodity}`];
          if (value !== null && value !== undefined) {
            allValues.push(Number(value));
          }
        });
      });

      if (allValues.length === 0) return [0, 100];

      const min = Math.min(...allValues);
      const max = Math.max(...allValues);
      return calculateNiceAxisBounds(min, max);
    } else {
      // Single commodity mode
      const values = visibleData
        .map((d: any) => d.value)
        .filter((v) => v !== undefined);
      if (values.length === 0) return [0, 100];

      const min = Math.min(...values);
      const max = Math.max(...values);
      return calculateNiceAxisBounds(min, max);
    }
  }, [visibleData, valueType, isMultiMode, selectedCommodities]);

  console.log("GRAPH_CHART yDomain", yDomain);

  const visibleRangeData = useMemo(() => {
    if (!rangeData || !showRange) return null;

    if (isMultiMode && selectedCommodities.length > 0) {
      // Multi-commodity range calculation
      const allValues: number[] = [];

      visibleData.forEach((dataPoint: any) => {
        selectedCommodities.forEach((commodity) => {
          const value = dataPoint[`value_${commodity}`];
          if (value !== null && value !== undefined) {
            allValues.push(Number(value));
          }
        });
      });

      if (allValues.length === 0) return null;

      return {
        min: Math.min(...allValues),
        max: Math.max(...allValues),
      };
    } else {
      // Single commodity range
      const values = visibleData
        .map((d: any) => d.value)
        .filter((v) => v !== undefined);
      if (values.length === 0) return null;

      return {
        min: Math.min(...values),
        max: Math.max(...values),
      };
    }
  }, [visibleData, rangeData, showRange, isMultiMode, selectedCommodities]);

  console.log("GRAPH_CHART visibleRangeData", visibleRangeData);

  // Multi-commodity tooltip formatter
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{
      value: number | null;
      dataKey?: string;
      color?: string;
    }>;
    label?: string;
  }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div
        className="p-3 border rounded-lg shadow-lg"
        style={{
          backgroundColor: theme.colors[currentTheme].background.secondary,
          borderColor: theme.colors[currentTheme].border.primary,
          color: theme.colors[currentTheme].text.primary,
        }}
      >
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((entry, index) => {
          if (entry.value === null || entry.value === undefined) return null;

          const commodity = entry.dataKey?.replace("value_", "");
          const commodityLabel =
            COMMODITY_OPTIONS.find((opt) => opt.value === commodity)?.label ||
            commodity;

          return (
            <p key={index} style={{ color: entry.color }}>
              {commodityLabel}: ${Number(entry.value).toFixed(2)}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full h-full">
      <div className="flex justify-center items-center p-4 border-b">
        <AnalysisToolbar
          graphType={graphType}
          toggleGraphType={toggleGraphType}
          valueType={valueType}
          toggleValueType={toggleValueType}
          showAverage={showAverage}
          showRange={showRange}
          toggleShowAverage={toggleShowAverage}
          toggleShowRange={toggleShowRange}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onShiftLeft={handleShiftLeft}
          onShiftRight={handleShiftRight}
          canZoomIn={canZoomIn}
          canZoomOut={canZoomOut}
          canShiftLeft={canShiftLeft}
          canShiftRight={canShiftRight}
        />
      </div>

      <div className="p-4">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={visibleData}>
            <defs>
              {/* Create gradients for each commodity */}
              {isMultiMode &&
                selectedCommodities.map((commodity) => (
                  <linearGradient
                    key={`gradient-${commodity}`}
                    id={`colorGradient-${commodity}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={
                        multiCommodityChartData.commodityColors[commodity]
                      }
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor={
                        multiCommodityChartData.commodityColors[commodity]
                      }
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                ))}
              {!isMultiMode && (
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={currentColor}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor={currentColor}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              )}
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={yDomain} />
            <Tooltip content={isMultiMode ? <CustomTooltip /> : undefined} />

            {/* Range reference lines */}
            <ReferenceLine
              y={visibleRangeData?.max}
              stroke="#22c55e"
              strokeDasharray="5 5"
              strokeWidth={1}
              strokeOpacity={0.7}
              label={{
                value: `Max: ${visibleRangeData?.max.toFixed(0)}`,
                position: "right",
                fill: "#22c55e",
              }}
            />

            <ReferenceLine
              y={visibleRangeData?.min}
              stroke="#ef4444"
              strokeDasharray="5 5"
              strokeWidth={1}
              strokeOpacity={0.7}
              label={{
                value: `Min: ${visibleRangeData?.min.toFixed(0)}`,
                position: "right",
                fill: "#ef4444",
              }}
            />

            {/* Multi-commodity rendering */}
            {isMultiMode &&
              selectedCommodities.map((commodity, index) => {
                const commodityColor =
                  multiCommodityChartData.commodityColors[commodity] ||
                  theme.colors.status.success[currentTheme];

                if (graphType === "area") {
                  return (
                    <Area
                      key={commodity}
                      type="monotone"
                      dataKey={`value_${commodity}`}
                      strokeWidth={2}
                      fill={`url(#colorGradient-${commodity})`}
                      stroke={commodityColor}
                      connectNulls={false}
                    />
                  );
                } else {
                  return (
                    <Bar
                      key={commodity}
                      dataKey={`value_${commodity}`}
                      fill={commodityColor}
                      stroke={commodityColor}
                      opacity={0.8}
                      stackId={graphType === "bar" ? "stack" : undefined}
                    />
                  );
                }
              })}

            {/* Single commodity rendering (legacy) */}
            {!isMultiMode && (
              <>
                {graphType === "area" ? (
                  <Area
                    type="monotone"
                    dataKey="value"
                    strokeWidth={2}
                    fill="url(#colorGradient)"
                    stroke={colours[0]}
                  />
                ) : (
                  <Bar
                    dataKey="value"
                    fill={currentColor}
                    stroke={currentColor}
                  />
                )}

                {showAverage && visibleAverageData && (
                  <Line
                    type="monotone"
                    data={visibleAverageData}
                    dataKey="average"
                    stroke="#f97316"
                    name="Average"
                    strokeWidth={2}
                  />
                )}
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
