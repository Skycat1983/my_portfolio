import { useState, useEffect, useCallback } from "react";
import { useNewStore } from "@/hooks/useStore";
import CommodityIconSelector from "./CommodityIconSelector";
import CommodityResults from "./CommodityResults";
import Chart from "./chart/Chart";
import type {
  FetchState,
  CommodityValue,
  SingleCommodityResponse,
  AllCommoditiesResponse,
  MultiCommodityState,
  CommodityDataEntry,
} from "./types";
import theme from "@/styles/theme";

const StocksMain = () => {
  // Legacy single commodity state (for backward compatibility)
  const [fetchState, setFetchState] = useState<FetchState>({
    loading: false,
    error: null,
    data: null,
  });

  // New multi-commodity state management
  const [multiCommodityState, setMultiCommodityState] =
    useState<MultiCommodityState>({});
  const [selectedCommodities, setSelectedCommodities] = useState<
    CommodityValue[]
  >(["WTI"]);
  const [activeFetches, setActiveFetches] = useState<Set<CommodityValue>>(
    new Set()
  );
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Theme system
  const currentTheme = useNewStore((state) => state.theme);
  const bgColorPrimary = theme.colors[currentTheme].background.primary;
  const textColorPrimary = theme.colors[currentTheme].text.primary;
  const textColorSecondary = theme.colors[currentTheme].text.secondary;

  // Helper function to check if data is a SingleCommodityResponse
  const isSingleCommodityResponse = (
    data: SingleCommodityResponse | AllCommoditiesResponse
  ): data is SingleCommodityResponse => {
    return "commodity" in data;
  };

  // Legacy fetch handler (for backward compatibility)
  const handleFetch = useCallback(
    async (params: { type?: CommodityValue; all?: boolean }) => {
      try {
        setFetchState((prev) => ({ ...prev, loading: true, error: null }));

        // Build query string
        const searchParams = new URLSearchParams();
        if (params.all) {
          searchParams.set("all", "true");
        } else if (params.type) {
          searchParams.set("type", params.type);
        }

        const url = `/api/commodities${
          searchParams.toString() ? `?${searchParams.toString()}` : ""
        }`;

        console.log(`Fetching commodity data from: ${url}`);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch: ${response.status} ${response.statusText}`
          );
        }

        const data: SingleCommodityResponse | AllCommoditiesResponse =
          await response.json();

        console.log("Commodity data fetched successfully:", data);

        setFetchState({
          loading: false,
          error: null,
          data,
        });

        // Also update multi-commodity state if it's a single commodity response
        if (isSingleCommodityResponse(data) && params.type) {
          const commodityEntry: CommodityDataEntry = {
            data: data,
            fetchedAt: Date.now(),
            selected: selectedCommodities.includes(params.type),
          };

          setMultiCommodityState((prev) => ({
            ...prev,
            [params.type!]: commodityEntry,
          }));
        }
      } catch (error) {
        console.error("Error fetching commodity data:", error);

        setFetchState({
          loading: false,
          error:
            error instanceof Error ? error.message : "Unknown error occurred",
          data: null,
        });
      }
    },
    [selectedCommodities]
  );

  // New multi-commodity fetch handler
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

        console.log(
          `Commodity data fetched successfully for ${commodity}:`,
          data
        );

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

        // Update legacy state if this commodity is currently selected
        if (
          selectedCommodities.length === 1 &&
          selectedCommodities[0] === commodity
        ) {
          setFetchState({
            loading: false,
            error: null,
            data: data,
          });
        }
      } catch (error) {
        console.error(`Error fetching commodity data for ${commodity}:`, error);

        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        setGlobalError(errorMessage);

        // Update legacy state error if this is the only selected commodity
        if (
          selectedCommodities.length === 1 &&
          selectedCommodities[0] === commodity
        ) {
          setFetchState((prev) => ({
            ...prev,
            loading: false,
            error: errorMessage,
          }));
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
    [selectedCommodities]
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
  }, []); // Empty dependency array for mount-only effect

  console.log("multiCommodityState", multiCommodityState);
  console.log("selectedCommodities", selectedCommodities);
  console.log("activeFetches", activeFetches);

  // Check if we have any loading states
  const isLoading = activeFetches.size > 0 || fetchState.loading;

  // Get chart data for backward compatibility
  const getChartData = () => {
    if (selectedCommodities.length === 1) {
      const commodity = selectedCommodities[0];
      const commodityData = multiCommodityState[commodity];
      return commodityData?.data || fetchState.data;
    }
    return fetchState.data;
  };

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

        {/* Selector */}
        <CommodityIconSelector
          onFetch={handleFetch} // Legacy compatibility
          onToggleCommodity={handleToggleCommodity} // New multi-select handler
          onAddCommodity={handleAddCommodity}
          selectedCommodities={selectedCommodities}
          activeFetches={activeFetches}
          loading={isLoading}
        />

        {/* Chart Visualization */}
        {(getChartData() || Object.keys(multiCommodityState).length > 0) && (
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
                data={getChartData()}
                error={fetchState.error || globalError}
                selectedCommodity={
                  selectedCommodities.length === 1
                    ? selectedCommodities[0]
                    : undefined
                }
                // New props for multi-commodity support
                multiCommodityData={multiCommodityState}
                selectedCommodities={selectedCommodities}
              />
            </div>
          </div>
        )}

        {/* Results */}
        <CommodityResults
          data={getChartData()}
          error={fetchState.error || globalError}
          multiCommodityData={multiCommodityState}
          selectedCommodities={selectedCommodities}
        />
      </div>
    </div>
  );
};

export default StocksMain;
