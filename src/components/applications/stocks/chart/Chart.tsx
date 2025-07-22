import type {
  MultiCommodityState,
  CommodityValue,
  MultiTimeUnit,
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
import { useMultiCommodityData } from "./hooks/useCommodityData";
import { COMMODITY_OPTIONS } from "../types";

// Type definitions for chart data
interface MultiCommodityDataPoint extends MultiTimeUnit {
  name: string;
  date: string;
}

interface ChartProps {
  multiCommodityData: MultiCommodityState;
  selectedCommodities: CommodityValue[];
  error: string | null;
}

/**
 * Commodity Chart Component
 *
 * Features:
 * - Theme-aware commodity-specific colors (darker in light mode, lighter in dark mode)
 * - Smart Y-axis domain calculation for nice round axis labels
 * - Support for multi-commodity data with growth/accumulated value types
 * - Dynamic theming integration with unique colors for each commodity
 * - Interactive chart controls (zoom, pan, toggle views)
 */

const Chart = ({ multiCommodityData, selectedCommodities }: ChartProps) => {
  const currentTheme = useNewStore((state) => state.theme);

  console.log("Chart render - unified system");
  console.log("Selected commodities:", selectedCommodities);

  // Multi-commodity data processing
  const multiCommodityChartData = useMultiCommodityData(
    multiCommodityData,
    selectedCommodities
  );

  // Transform data for chart hooks (keeping legacy structure for useGraph)
  const commodityData = useMemo(() => {
    return {
      timeUnits: multiCommodityChartData.timeUnits.map((unit) => ({
        name: unit.name,
        dates: [unit.date, unit.date] as [string, string],
        accumulated: 0, // Not used in multi-mode
        growth: 0, // Not used in multi-mode
        unit: "month" as const,
      })),
    };
  }, [multiCommodityChartData]);

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
  } = useGraph({ contactsData: commodityData });

  const { mainData } = graphData;

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

  // Transform data based on valueType (accumulated vs growth)
  const transformedChartData = useMemo(() => {
    const timeUnits = multiCommodityChartData.timeUnits.slice(
      graphRange[0],
      graphRange[1] + 1
    );

    if (valueType === "accumulated") {
      // Return absolute values as-is
      return timeUnits;
    } else {
      // Calculate growth percentages for each commodity
      return timeUnits.map((unit, index) => {
        const transformedUnit = { ...unit };

        selectedCommodities.forEach((commodity) => {
          const currentValue = unit[`value_${commodity}`];

          if (
            currentValue !== null &&
            currentValue !== undefined &&
            index > 0
          ) {
            // Get previous value for growth calculation
            const globalIndex = graphRange[0] + index;
            const previousGlobalIndex = globalIndex - 1;

            if (
              previousGlobalIndex >= 0 &&
              previousGlobalIndex < multiCommodityChartData.timeUnits.length
            ) {
              const previousValue =
                multiCommodityChartData.timeUnits[previousGlobalIndex][
                  `value_${commodity}`
                ];

              if (
                previousValue !== null &&
                previousValue !== undefined &&
                Number(previousValue) !== 0
              ) {
                // Calculate percentage change: ((current - previous) / previous) * 100
                const growthPercentage =
                  ((Number(currentValue) - Number(previousValue)) /
                    Number(previousValue)) *
                  100;
                transformedUnit[`value_${commodity}`] = growthPercentage;
                transformedUnit[
                  `${commodity}_formatted`
                ] = `${growthPercentage.toFixed(2)}%`;
              } else {
                // No previous value or previous value is 0 - set to 0
                transformedUnit[`value_${commodity}`] = 0;
                transformedUnit[`${commodity}_formatted`] = "0.00%";
              }
            } else {
              // First data point - no growth to calculate
              transformedUnit[`value_${commodity}`] = 0;
              transformedUnit[`${commodity}_formatted`] = "0.00%";
            }
          } else if (index === 0) {
            // First data point in visible range - no growth to calculate
            transformedUnit[`value_${commodity}`] = 0;
            transformedUnit[`${commodity}_formatted`] = "0.00%";
          }
        });

        return transformedUnit;
      });
    }
  }, [multiCommodityChartData, graphRange, valueType, selectedCommodities]);

  // Multi-commodity average calculation (using transformed data)
  const multiCommodityAverageData = useMemo(() => {
    if (!showAverage || selectedCommodities.length === 0) return null;

    return transformedChartData.map((dataPoint) => {
      // Calculate average across all selected commodities for this time point
      const values: number[] = [];
      selectedCommodities.forEach((commodity) => {
        const value = dataPoint[`value_${commodity}`];
        if (value !== null && value !== undefined) {
          values.push(Number(value));
        }
      });

      const average =
        values.length > 0
          ? values.reduce((sum, val) => sum + val, 0) / values.length
          : 0;

      return {
        name: dataPoint.name,
        average: average,
      };
    });
  }, [transformedChartData, selectedCommodities, showAverage]);

  const visibleData = useMemo(() => {
    const baseData = transformedChartData;

    // If showing average, merge average data into the main data
    if (showAverage && multiCommodityAverageData) {
      return baseData.map((dataPoint, index) => ({
        ...dataPoint,
        average: multiCommodityAverageData[index]?.average || 0,
      }));
    }

    return baseData;
  }, [transformedChartData, showAverage, multiCommodityAverageData]);

  console.log("Chart visibleData:", visibleData);
  console.log("Chart valueType:", valueType);

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

  // Y-axis domain calculation for multi-commodity support
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

    // Calculate range across all selected commodities
    const allValues: number[] = [];

    visibleData.forEach((dataPoint: MultiCommodityDataPoint) => {
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
  }, [visibleData, valueType, selectedCommodities]);

  console.log("Chart yDomain:", yDomain);

  const visibleRangeData = useMemo(() => {
    if (!showRange) return null;

    if (selectedCommodities.length === 0) return null;

    // Multi-commodity range calculation
    const allValues: number[] = [];

    visibleData.forEach((dataPoint: MultiCommodityDataPoint) => {
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
  }, [visibleData, showRange, selectedCommodities]);

  console.log("Chart visibleRangeData:", visibleRangeData);

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

          const formattedValue =
            valueType === "growth"
              ? `${Number(entry.value).toFixed(2)}%`
              : `$${Number(entry.value).toFixed(2)}`;

          return (
            <p key={index} style={{ color: entry.color }}>
              {commodityLabel}: {formattedValue}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full h-full">
      <div className="flex justify-center items-center ">
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

      <div className="py-2 flex justify-center items-center w-full">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={visibleData} width={1000} height={300}>
            <defs>
              {/* Create gradients for each commodity */}
              {selectedCommodities.map((commodity) => (
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
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={yDomain} width={30} />
            <Tooltip content={<CustomTooltip />} />

            {/* Range reference lines */}
            {visibleRangeData && (
              <>
                <ReferenceLine
                  y={visibleRangeData.max}
                  stroke="#22c55e"
                  strokeDasharray="5 5"
                  strokeWidth={1}
                  strokeOpacity={0.7}
                  label={{
                    value: `Max: ${visibleRangeData.max.toFixed(
                      valueType === "growth" ? 2 : 0
                    )}${valueType === "growth" ? "%" : ""}`,
                    position: "right",
                    fill: "#22c55e",
                  }}
                />

                <ReferenceLine
                  y={visibleRangeData.min}
                  stroke="#ef4444"
                  strokeDasharray="5 5"
                  strokeWidth={1}
                  strokeOpacity={0.7}
                  label={{
                    value: `Min: ${visibleRangeData.min.toFixed(
                      valueType === "growth" ? 2 : 0
                    )}${valueType === "growth" ? "%" : ""}`,
                    position: "right",
                    fill: "#ef4444",
                  }}
                />
              </>
            )}

            {/* Multi-commodity rendering */}
            {selectedCommodities.map((commodity) => {
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

            {/* Multi-commodity average line - rendered on top */}
            {showAverage && multiCommodityAverageData && (
              <Line
                type="monotone"
                dataKey="average"
                stroke="#f97316"
                name="Multi-Commodity Average"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
