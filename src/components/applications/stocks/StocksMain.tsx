import { useState, useEffect, useCallback } from "react";
import { useNewStore } from "@/hooks/useStore";
import CommodityIconSelector from "./CommodityIconSelector";
import CommodityResults from "./CommodityResults";
import Chart from "./chart/Chart";
import CommodityChartSelector from "./chart/CommodityChartSelector";
import type {
  FetchState,
  CommodityValue,
  SingleCommodityResponse,
  AllCommoditiesResponse,
} from "./types";
import theme from "@/styles/theme";

const StocksMain = () => {
  const [fetchState, setFetchState] = useState<FetchState>({
    loading: false,
    error: null,
    data: null,
  });

  const [selectedChartCommodity, setSelectedChartCommodity] = useState<
    string | undefined
  >();

  // Theme system
  const currentTheme = useNewStore((state) => state.theme);
  const bgColorPrimary = theme.colors[currentTheme].background.primary;
  const textColorPrimary = theme.colors[currentTheme].text.primary;
  const textColorSecondary = theme.colors[currentTheme].text.secondary;

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
    []
  ); // No dependencies needed since it only uses setFetchState

  // Auto-fetch all commodities on component mount
  useEffect(() => {
    console.log("StocksMain mounted - auto-fetching all commodities");
    handleFetch({ all: true });
  }, [handleFetch]); // Include handleFetch in dependencies

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
          onFetch={handleFetch}
          loading={fetchState.loading}
        />

        {/* Chart Visualization */}
        {fetchState.data && (
          <div className="space-y-4">
            <h2
              className="text-2xl font-semibold"
              style={{ color: textColorPrimary }}
            >
              Price Chart
            </h2>
            <div
              className="rounded-lg border p-4"
              style={{
                backgroundColor:
                  theme.colors[currentTheme].background.secondary,
                borderColor: theme.colors[currentTheme].border.primary,
              }}
            >
              <CommodityChartSelector
                data={fetchState.data}
                selectedCommodity={selectedChartCommodity}
                onCommodityChange={setSelectedChartCommodity}
              />
              <Chart
                data={fetchState.data}
                error={fetchState.error}
                selectedCommodity={selectedChartCommodity}
              />
            </div>
          </div>
        )}

        {/* Results */}
        <CommodityResults data={fetchState.data} error={fetchState.error} />
      </div>
    </div>
  );
};

export default StocksMain;
