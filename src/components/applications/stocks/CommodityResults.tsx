import { useNewStore } from "@/hooks/useStore";
import { Label } from "@/components/ui/label";
import type { MultiCommodityState, CommodityValue } from "./types";
import { COMMODITY_OPTIONS } from "./types";
import theme from "@/styles/theme";

interface CommodityResultsProps {
  multiCommodityData: MultiCommodityState;
  selectedCommodities: CommodityValue[];
  error: string | null;
}

const CommodityResults = ({
  multiCommodityData,
  selectedCommodities,
  error,
}: CommodityResultsProps) => {
  // Theme system
  const currentTheme = useNewStore((state) => state.theme);
  const bgColorSecondary = theme.colors[currentTheme].background.secondary;
  const textColorPrimary = theme.colors[currentTheme].text.primary;
  const textColorSecondary = theme.colors[currentTheme].text.secondary;
  const borderColor = theme.colors[currentTheme].border.primary;
  const surfaceColor = theme.colors[currentTheme].surface.primary;

  if (error) {
    return (
      <div
        className="p-6 rounded-lg border"
        style={{
          backgroundColor: theme.colors.status.error[currentTheme],
          borderColor: theme.colors.status.error[currentTheme],
          color: "#ffffff",
        }}
      >
        <h3 className="text-lg font-semibold mb-2">Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (Object.keys(multiCommodityData).length === 0) {
    return (
      <div
        className="p-6 rounded-lg border text-center"
        style={{
          backgroundColor: bgColorSecondary,
          borderColor: borderColor,
          color: textColorSecondary,
        }}
      >
        <p>No data to display. Select and fetch a commodity to get started.</p>
      </div>
    );
  }

  const formatTimestamp = (timestamp: {
    _seconds: number;
    _nanoseconds: number;
  }) => {
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleString();
  };

  const getCommodityLabel = (commodityValue: string) => {
    const option = COMMODITY_OPTIONS.find(
      (opt) => opt.value === commodityValue
    );
    return option?.label || commodityValue;
  };

  const selectedEntries = selectedCommodities
    .map((commodity) => ({
      commodity,
      entry: multiCommodityData[commodity],
    }))
    .filter(({ entry }) => entry?.data);

  // Single commodity view (1 selected)
  if (selectedCommodities.length === 1 && selectedEntries.length === 1) {
    const { commodity, entry } = selectedEntries[0];
    const singleData = entry.data;
    const latestPrice = singleData.data[0];

    return (
      <div className="space-y-4">
        {/* Header */}
        <div
          className="p-6 rounded-lg border"
          style={{
            backgroundColor: bgColorSecondary,
            borderColor: borderColor,
          }}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3
                className="text-xl font-semibold"
                style={{ color: textColorPrimary }}
              >
                {getCommodityLabel(commodity)}
              </h3>
              <p style={{ color: textColorSecondary }}>
                Monthly Data • {singleData.dataCount} data points
              </p>
            </div>
            <div className="text-right">
              <div
                className="text-2xl font-bold"
                style={{ color: theme.colors.status.success[currentTheme] }}
              >
                ${latestPrice?.value}
              </div>
              <p className="text-sm" style={{ color: textColorSecondary }}>
                {latestPrice?.date}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label style={{ color: textColorSecondary }}>Source</Label>
              <p style={{ color: textColorPrimary }}>
                {singleData.source === "cache" ? "📦 Cache" : "🆕 Fresh API"}
              </p>
            </div>
            <div>
              <Label style={{ color: textColorSecondary }}>Last Updated</Label>
              <p style={{ color: textColorPrimary }}>
                {formatTimestamp(singleData.lastUpdated)}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Data Preview */}
        <div
          className="p-6 rounded-lg border"
          style={{
            backgroundColor: bgColorSecondary,
            borderColor: borderColor,
          }}
        >
          <h4
            className="text-lg font-semibold mb-4"
            style={{ color: textColorPrimary }}
          >
            Recent Data (Last 6 months)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {singleData.data.slice(0, 6).map((point) => (
              <div
                key={point.date}
                className="p-3 rounded border"
                style={{
                  backgroundColor: surfaceColor,
                  borderColor: borderColor,
                }}
              >
                <p
                  className="text-sm font-medium"
                  style={{ color: textColorSecondary }}
                >
                  {new Date(point.date).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p
                  className="text-lg font-semibold"
                  style={{ color: textColorPrimary }}
                >
                  ${point.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Multi-commodity view (2+ selected)
  return (
    <div className="space-y-6">
      {/* Multi-commodity header */}
      <div
        className="p-6 rounded-lg border"
        style={{
          backgroundColor: bgColorSecondary,
          borderColor: borderColor,
        }}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3
              className="text-xl font-semibold"
              style={{ color: textColorPrimary }}
            >
              Commodity Comparison
            </h3>
            <p style={{ color: textColorSecondary }}>
              {selectedCommodities.length} commodities selected •
              Multi-commodity view
            </p>
          </div>
          <div className="text-right">
            <div
              className="text-lg font-semibold"
              style={{ color: theme.colors.status.info[currentTheme] }}
            >
              {selectedEntries.length} loaded
            </div>
            <p className="text-sm" style={{ color: textColorSecondary }}>
              {selectedCommodities.length - selectedEntries.length} pending
            </p>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {selectedEntries.map(({ commodity, entry }) => {
            const latestPrice = entry?.data?.data?.[0];
            const commodityColor =
              theme.colors.commodities[
                commodity as keyof typeof theme.colors.commodities
              ]?.[currentTheme] || theme.colors.status.success[currentTheme];

            return (
              <div key={commodity} className="text-center">
                <p
                  className="text-xs font-medium"
                  style={{ color: textColorSecondary }}
                >
                  {getCommodityLabel(commodity)}
                </p>
                <p
                  className="text-lg font-bold"
                  style={{ color: commodityColor }}
                >
                  ${latestPrice?.value || "N/A"}
                </p>
                <p className="text-xs" style={{ color: textColorSecondary }}>
                  {entry?.data?.dataCount || 0} pts
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual commodity cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedEntries.map(({ commodity, entry }) => {
          if (!entry?.data) return null;

          const latestPrice = entry.data.data[0];
          const commodityColor =
            theme.colors.commodities[
              commodity as keyof typeof theme.colors.commodities
            ]?.[currentTheme] || theme.colors.status.success[currentTheme];

          return (
            <div
              key={commodity}
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: bgColorSecondary,
                borderColor: borderColor,
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4
                    className="font-semibold"
                    style={{ color: textColorPrimary }}
                  >
                    {getCommodityLabel(commodity)}
                  </h4>
                  <p className="text-xs" style={{ color: textColorSecondary }}>
                    {entry.data.source === "cache" ? "📦 Cache" : "🆕 Fresh"} •{" "}
                    {entry.data.dataCount} data points
                  </p>
                </div>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: commodityColor }}
                  title={`${getCommodityLabel(commodity)} color indicator`}
                />
              </div>

              <div className="text-center mb-3">
                <div
                  className="text-xl font-bold"
                  style={{ color: commodityColor }}
                >
                  ${latestPrice?.value || "N/A"}
                </div>
                <p className="text-xs" style={{ color: textColorSecondary }}>
                  {latestPrice?.date || "No date"}
                </p>
              </div>

              {/* Recent data mini-preview */}
              <div className="space-y-1">
                <p
                  className="text-xs font-medium"
                  style={{ color: textColorSecondary }}
                >
                  Recent Trend (Last 3 months)
                </p>
                <div className="flex gap-1">
                  {entry.data.data.slice(0, 3).map((point) => (
                    <div
                      key={point.date}
                      className="flex-1 text-center text-xs p-1 rounded"
                      style={{
                        backgroundColor: surfaceColor,
                        color: textColorSecondary,
                      }}
                    >
                      <div style={{ color: textColorPrimary }}>
                        ${point.value}
                      </div>
                      <div>
                        {new Date(point.date).toLocaleDateString("en-US", {
                          month: "short",
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="mt-3 text-xs"
                style={{ color: textColorSecondary }}
              >
                <p>Updated: {formatTimestamp(entry.data.lastUpdated)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending commodities indicator */}
      {selectedCommodities.length > selectedEntries.length && (
        <div
          className="p-4 rounded-lg border text-center"
          style={{
            backgroundColor: theme.colors[currentTheme].background.tertiary,
            borderColor: borderColor,
            color: textColorSecondary,
          }}
        >
          <p>
            Loading {selectedCommodities.length - selectedEntries.length}{" "}
            additional commodities...
          </p>
        </div>
      )}
    </div>
  );
};

export default CommodityResults;
