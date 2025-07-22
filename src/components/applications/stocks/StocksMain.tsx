import { useState, useEffect, useCallback } from "react";
import { useNewStore } from "@/hooks/useStore";
import CommodityIconSelector from "./CommodityIconSelector";
import CommodityResults from "./CommodityResults";
import Chart from "./chart/Chart";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import type {
  CommodityValue,
  SingleCommodityResponse,
  MultiCommodityState,
  CommodityDataEntry,
} from "./types";
import theme from "@/styles/theme";

const StocksMain = () => {
  // Unified state management
  const [multiCommodityState, setMultiCommodityState] =
    useState<MultiCommodityState>({});
  const [selectedCommodities, setSelectedCommodities] = useState<
    CommodityValue[]
  >(["WTI"]);
  const [activeFetches, setActiveFetches] = useState<Set<CommodityValue>>(
    new Set()
  );
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  // Theme system
  const currentTheme = useNewStore((state) => state.theme);
  const bgColorPrimary = theme.colors[currentTheme].background.primary;
  const textColorPrimary = theme.colors[currentTheme].text.primary;
  const textColorSecondary = theme.colors[currentTheme].text.secondary;

  // Unified commodity fetch handler
  const handleCommodityFetch = useCallback(
    async (commodity: CommodityValue): Promise<void> => {
      try {
        // Add to active fetches
        setActiveFetches((prev) => new Set([...prev, commodity]));
        setGlobalError(null);

        const searchParams = new URLSearchParams();
        searchParams.set("type", commodity);
        const url = `/api/commodities?${searchParams.toString()}`;

        console.log(`Fetching commodity data for ${commodity} from: ${url}`);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch ${commodity}: ${response.status} ${response.statusText}`
          );
        }

        const data: SingleCommodityResponse = await response.json();
        console.log("handleCommodityFetch data in StocksMain:", data);

        // Update multi-commodity state
        const commodityEntry: CommodityDataEntry = {
          data: data,
          fetchedAt: Date.now(),
          selected: selectedCommodities.includes(commodity),
        };

        setMultiCommodityState((prev) => ({
          ...prev,
          [commodity]: commodityEntry,
        }));

        // Mark initial load as complete
        if (!hasInitialLoad) {
          setHasInitialLoad(true);
        }
      } catch (error) {
        console.error(`Error fetching commodity data for ${commodity}:`, error);

        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        setGlobalError(errorMessage);

        // Mark initial load as complete even on error
        if (!hasInitialLoad) {
          setHasInitialLoad(true);
        }
      } finally {
        // Remove from active fetches
        setActiveFetches((prev) => {
          const newSet = new Set(prev);
          newSet.delete(commodity);
          return newSet;
        });
      }
    },
    [selectedCommodities, hasInitialLoad]
  );

  // Add commodity to selection
  const handleAddCommodity = useCallback(
    async (commodity: CommodityValue) => {
      console.log(`Adding commodity: ${commodity}`);

      // Add to selected commodities if not already selected
      if (!selectedCommodities.includes(commodity)) {
        setSelectedCommodities((prev) => [...prev, commodity]);
      }

      // Update selection status in existing data
      setMultiCommodityState((prev) => {
        const existing = prev[commodity];
        if (existing) {
          return {
            ...prev,
            [commodity]: {
              ...existing,
              selected: true,
            },
          };
        }
        return prev;
      });

      // Fetch if data doesn't exist or is stale (older than 1 hour)
      const existingData = multiCommodityState[commodity];
      const isStale = existingData
        ? Date.now() - existingData.fetchedAt > 60 * 60 * 1000
        : true;

      if (!existingData || isStale) {
        await handleCommodityFetch(commodity);
      }
    },
    [selectedCommodities, multiCommodityState, handleCommodityFetch]
  );

  // Remove commodity from selection (keep data cached)
  const handleRemoveCommodity = useCallback(
    (commodity: CommodityValue) => {
      console.log(`Attempting to remove commodity: ${commodity}`);

      // Prevent removing the last selected commodity
      if (selectedCommodities.length <= 1) {
        console.log(
          "Cannot remove last commodity - at least one must remain selected"
        );
        return;
      }

      setSelectedCommodities((prev) => prev.filter((c) => c !== commodity));

      // Update selection status but keep data
      setMultiCommodityState((prev) => {
        const existing = prev[commodity];
        if (existing) {
          return {
            ...prev,
            [commodity]: {
              ...existing,
              selected: false,
            },
          };
        }
        return prev;
      });
    },
    [selectedCommodities]
  );

  // Toggle commodity selection
  const handleToggleCommodity = useCallback(
    async (commodity: CommodityValue) => {
      const isSelected = selectedCommodities.includes(commodity);

      if (isSelected) {
        // Only allow removal if more than 1 commodity is selected
        if (selectedCommodities.length > 1) {
          handleRemoveCommodity(commodity);
        } else {
          console.log(
            "Cannot deselect last commodity - at least one must remain selected"
          );
        }
      } else {
        await handleAddCommodity(commodity);
      }
    },
    [selectedCommodities, handleAddCommodity, handleRemoveCommodity]
  );

  // Auto-fetch initial commodity on component mount
  useEffect(() => {
    console.log("StocksMain mounted - auto-fetching WTI");
    handleCommodityFetch("WTI");
  }, [handleCommodityFetch]);

  console.log("multiCommodityState in StocksMain:", multiCommodityState);
  console.log("selectedCommodities in StocksMain:", selectedCommodities);
  console.log("activeFetches in StocksMain:", activeFetches);

  // Check if we have any loading states
  const isLoading = activeFetches.size > 0;
  const hasData = Object.keys(multiCommodityState).length > 0;
  const showInitialLoading = !hasInitialLoad && isLoading;

  return (
    <div
      className="h-full w-full overflow-auto"
      style={{
        backgroundColor: bgColorPrimary,
        color: textColorPrimary,
      }}
    >
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h2
            className="text-3xl font-bold"
            style={{ color: textColorPrimary }}
          >
            Commodity Data Center
          </h2>
          <p className="text-lg" style={{ color: textColorSecondary }}>
            Real-time commodity prices from Alpha Vantage API
          </p>
        </div>

        {/* Initial Loading State */}
        {showInitialLoading ? (
          <div
            className="p-12 rounded-lg border text-center"
            style={{
              backgroundColor: theme.colors[currentTheme].background.secondary,
              borderColor: theme.colors[currentTheme].border.primary,
            }}
          >
            <LoadingSpinner />
            <p className="mt-4 text-lg" style={{ color: textColorSecondary }}>
              Loading commodity data...
            </p>
          </div>
        ) : (
          <>
            {/* Selector */}
            <CommodityIconSelector
              onToggleCommodity={handleToggleCommodity}
              selectedCommodities={selectedCommodities}
              activeFetches={activeFetches}
              loading={isLoading}
            />

            {/* Chart Visualization */}
            {hasData && (
              <div className="space-y-4">
                <h2
                  className="text-2xl font-semibold"
                  style={{ color: textColorPrimary }}
                >
                  Price Chart{" "}
                  {selectedCommodities.length > 1 &&
                    `(${selectedCommodities.length} commodities)`}
                </h2>
                <div
                  className="rounded-lg border p-4"
                  style={{
                    backgroundColor:
                      theme.colors[currentTheme].background.secondary,
                    borderColor: theme.colors[currentTheme].border.primary,
                  }}
                >
                  <Chart
                    multiCommodityData={multiCommodityState}
                    selectedCommodities={selectedCommodities}
                    error={globalError}
                  />
                </div>
              </div>
            )}

            {/* Results */}
            {hasData && (
              <CommodityResults
                multiCommodityData={multiCommodityState}
                selectedCommodities={selectedCommodities}
                error={globalError}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StocksMain;
