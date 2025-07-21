import type { AllCommoditiesResponse, SingleCommodityResponse } from "../types";
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
} from "./hooks/useCommodityData";

interface CommodityResultsProps {
  data: SingleCommodityResponse | AllCommoditiesResponse | null;
  error: string | null;
  selectedCommodity?: string; // For selecting specific commodity from multi-commodity response
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

const Chart = ({ data, selectedCommodity }: CommodityResultsProps) => {
  const currentTheme = useNewStore((state) => state.theme);

  // Get current commodity color using theme-aware colors
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

  // Select the appropriate data based on response type and selected commodity
  const commodityData = useMemo(() => {
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
  }, [data, singleCommodityData, multipleCommodityData, selectedCommodity]);

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

  const visibleData = useMemo(() => {
    return mainData.slice(graphRange[0], graphRange[1] + 1);
  }, [mainData, graphRange]);

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

    const values = visibleData.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);

    return calculateNiceAxisBounds(min, max);
  }, [visibleData, valueType]);

  console.log("GRAPH_CHART yDomain", yDomain);
  console.log(
    "GRAPH_CHART max value:",
    visibleData.length > 0 ? Math.max(...visibleData.map((d) => d.value)) : 0
  );

  const visibleRangeData = useMemo(() => {
    if (!rangeData || !showRange) return null;
    const rangeValues = {
      min: Math.min(...visibleData.map((d) => d.value)),
      max: Math.max(...visibleData.map((d) => d.value)),
    };
    return rangeValues;
  }, [visibleData, rangeData, showRange]);

  console.log("GRAPH_CHART visibleRangeData", visibleRangeData);

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
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={currentColor} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={yDomain} />
            <Tooltip />

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

            {graphType === "area" ? (
              <Area
                type="monotone"
                dataKey="value"
                strokeWidth={2}
                fill="url(#colorGradient)"
                stroke={colours[0]}
              />
            ) : (
              <Bar dataKey="value" fill={currentColor} stroke={currentColor} />
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
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
