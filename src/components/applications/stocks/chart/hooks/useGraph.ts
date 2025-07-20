import { useState, useCallback, useMemo } from "react";
import { calculateMetrics } from "../dataUtils";
import type { TemporalCalculationsResult } from "./useData";

interface UseGraphProps {
  contactsData: TemporalCalculationsResult;
}

interface GraphData {
  mainData: Array<{
    name: string;
    value: number;
  }>;
  averageData?: Array<{
    name: string;
    average: number;
  }>;
  rangeData?: {
    min: number;
    max: number;
    range: number;
  };
}

export const useGraph = ({ contactsData }: UseGraphProps) => {
  const { timeUnits } = contactsData;
  const [valueType, setValueType] = useState<"accumulated" | "growth">(
    "accumulated"
  );
  const [graphType, setGraphType] = useState<"area" | "bar">("bar");
  const [graphRange, setGraphRange] = useState<number[]>([
    0,
    timeUnits.length - 1,
  ]);
  const [showAverage, setShowAverage] = useState<boolean>(false);
  const [showRange, setShowRange] = useState<boolean>(true);
  const [showProjected, setShowProjected] = useState<boolean>(false);

  const toggleValueType = useCallback(() => {
    setValueType((current) =>
      current === "accumulated" ? "growth" : "accumulated"
    );
  }, []);

  const toggleGraphType = useCallback(() => {
    setGraphType((current) => (current === "area" ? "bar" : "area"));
  }, []);

  const toggleShowAverage = useCallback(() => {
    setShowAverage((current) => !current);
  }, []);

  const toggleShowProjected = useCallback(() => {
    setShowProjected((current) => !current);
  }, []);

  const toggleShowRange = useCallback(() => {
    setShowRange((current) => !current);
  }, []);

  const handleZoomIn = useCallback(() => {
    setGraphRange((current) => {
      const range = current[1] - current[0];
      if (range <= 2) return current; // Prevent zooming in too far

      const midPoint = Math.floor((current[0] + current[1]) / 2);
      const newRange = Math.floor(range / 2);
      return [
        Math.max(0, midPoint - Math.floor(newRange / 2)),
        Math.min(timeUnits.length - 1, midPoint + Math.ceil(newRange / 2)),
      ];
    });
  }, [timeUnits.length]);

  const handleZoomOut = useCallback(() => {
    setGraphRange((current) => {
      const range = current[1] - current[0];
      const newRange = range * 2;
      const midPoint = Math.floor((current[0] + current[1]) / 2);

      return [
        Math.max(0, midPoint - Math.floor(newRange / 2)),
        Math.min(timeUnits.length - 1, midPoint + Math.ceil(newRange / 2)),
      ];
    });
  }, [timeUnits.length]);

  const handleShiftLeft = useCallback(() => {
    setGraphRange((current) => {
      const range = current[1] - current[0];
      const shift = Math.max(1, Math.floor(range * 0.25)); // Shift by 25% of current range
      if (current[0] <= 0) return current; // Already at start

      return [
        Math.max(0, current[0] - shift),
        Math.max(range, current[1] - shift),
      ];
    });
  }, []);

  const handleShiftRight = useCallback(() => {
    setGraphRange((current) => {
      const range = current[1] - current[0];
      const shift = Math.max(1, Math.floor(range * 0.25)); // Shift by 25% of current range
      if (current[1] >= timeUnits.length - 1) return current; // Already at end

      return [
        Math.min(timeUnits.length - 1 - range, current[0] + shift),
        Math.min(timeUnits.length - 1, current[1] + shift),
      ];
    });
  }, [timeUnits.length]);

  const graphData = useMemo((): GraphData => {
    const { timeUnits } = contactsData;

    // Prepare main data based on selected type
    const mainData = timeUnits.map((t) => ({
      name: t.name,
      value: valueType === "accumulated" ? t.accumulated : t.growth ?? 0,
    }));

    // Calculate and prepare average data if needed
    const averageData = showAverage
      ? timeUnits.map((t, index) => ({
          name: t.name,
          average: calculateMetrics.rollingAverage(
            timeUnits.map((unit) =>
              valueType === "accumulated" ? unit.accumulated : unit.growth ?? 0
            ),
            index,
            7 // week rolling average
          ),
        }))
      : undefined;

    const rangeData = calculateMetrics.range(
      timeUnits.map((t) =>
        valueType === "accumulated" ? t.accumulated : t.growth ?? 0
      )
    );

    return {
      mainData,
      averageData,
      rangeData,
    };
  }, [contactsData, valueType, showAverage]);

  return {
    graphData,
    valueType,
    graphType,
    graphRange,
    showAverage,
    showProjected,
    showRange,
    toggleValueType,
    toggleGraphType,
    toggleShowAverage,
    toggleShowProjected,
    toggleShowRange,
    handleZoomIn,
    handleZoomOut,
    handleShiftLeft,
    handleShiftRight,
  };
};
