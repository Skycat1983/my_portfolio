import { useState } from "react";
import { useNewStore } from "@/hooks/useStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { COMMODITY_OPTIONS, type CommodityValue } from "./types";
import theme from "@/styles/theme";
import {
  CORN,
  WHEAT,
  SUGAR,
  OIL_DROP,
  PUMPJACK,
  COFFEE,
  GAS,
  COPPER,
  ALUMINIUM,
  GRAPH,
} from "@/constants/images";

interface CommodityIconSelectorProps {
  // Legacy props (for backward compatibility)
  onFetch: (params: { type?: CommodityValue; all?: boolean }) => void;
  loading: boolean;

  // New multi-commodity props (optional for backward compatibility)
  onToggleCommodity?: (commodity: CommodityValue) => Promise<void>;
  onAddCommodity?: (commodity: CommodityValue) => Promise<void>;
  selectedCommodities?: CommodityValue[];
  activeFetches?: Set<CommodityValue>;
}

// Map commodities to their respective icons
const COMMODITY_ICON_MAP: Record<CommodityValue, string> = {
  WTI: OIL_DROP,
  BRENT: PUMPJACK,
  NATURAL_GAS: GAS,
  COPPER: COPPER,
  ALUMINUM: ALUMINIUM,
  CORN: CORN,
  WHEAT: WHEAT,
  SUGAR: SUGAR,
  COFFEE: COFFEE,
  ALL_COMMODITIES: GRAPH,
};

const CommodityIconSelector = ({
  onFetch,
  loading,
  onToggleCommodity,
  onAddCommodity,
  selectedCommodities = [],
  activeFetches = new Set(),
}: CommodityIconSelectorProps) => {
  // Legacy single selection state (for backward compatibility)
  const [selectedCommodity, setSelectedCommodity] =
    useState<CommodityValue>("WTI");

  // Check if we're in multi-commodity mode
  const isMultiMode = Boolean(
    onToggleCommodity && selectedCommodities.length >= 0
  );

  // Get effective selected commodities (multi-mode or legacy single selection)
  const effectiveSelectedCommodities = isMultiMode
    ? selectedCommodities
    : [selectedCommodity];

  // Theme system
  const currentTheme = useNewStore((state) => state.theme);
  const bgColorSecondary = theme.colors[currentTheme].background.secondary;
  const textColorPrimary = theme.colors[currentTheme].text.primary;
  const textColorSecondary = theme.colors[currentTheme].text.secondary;
  const borderColor = theme.colors[currentTheme].border.primary;

  const handleSelectCommodity = async (commodity: CommodityValue) => {
    if (isMultiMode && onToggleCommodity) {
      // Multi-commodity mode: toggle selection
      await onToggleCommodity(commodity);
    } else {
      // Legacy single-commodity mode
      setSelectedCommodity(commodity);

      if (commodity === "ALL_COMMODITIES") {
        onFetch({ all: true });
      } else {
        onFetch({ type: commodity });
      }
    }
  };

  const isSelected = (commodity: CommodityValue) => {
    return effectiveSelectedCommodities.includes(commodity);
  };

  const isLoading = (commodity: CommodityValue) => {
    return isMultiMode ? activeFetches.has(commodity) : loading;
  };

  const getIconOpacity = (commodity: CommodityValue) => {
    if (isLoading(commodity)) return 0.5;
    return isSelected(commodity) ? 1 : 0.4;
  };

  const getButtonStyle = (commodity: CommodityValue) => {
    const selected = isSelected(commodity);
    const commodityLoading = isLoading(commodity);

    // Get commodity-specific color from theme
    const commodityColor =
      theme.colors.commodities[
        commodity as keyof typeof theme.colors.commodities
      ]?.[currentTheme] || theme.colors.status.success[currentTheme];

    return {
      backgroundColor: selected ? commodityColor : "transparent",
      borderColor: selected ? commodityColor : borderColor,
      opacity: commodityLoading ? 0.6 : 1,
      transform: commodityLoading ? "scale(0.95)" : "scale(1)",
      transition: "all 0.2s ease",
    };
  };

  // Clear all selections (multi-mode only) - REMOVED: Always keep at least 1 selected
  // const handleClearAll = () => { ... }

  // Select all commodities (multi-mode only)
  const handleSelectAll = async () => {
    if (isMultiMode && onAddCommodity) {
      const allCommodities = COMMODITY_OPTIONS.filter(
        (opt) => opt.value !== "ALL_COMMODITIES"
      );
      for (const commodity of allCommodities) {
        if (!effectiveSelectedCommodities.includes(commodity.value)) {
          await onAddCommodity(commodity.value);
        }
      }
    }
  };

  return (
    <div
      className="p-6 rounded-lg border space-y-6"
      style={{
        backgroundColor: bgColorSecondary,
        borderColor: borderColor,
      }}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2
            className="text-xl font-semibold"
            style={{ color: textColorPrimary }}
          >
            Commodity Selection
          </h2>
          {isMultiMode && (
            <div className="flex gap-2">
              <Button
                onClick={handleSelectAll}
                disabled={
                  loading ||
                  effectiveSelectedCommodities.length ===
                    COMMODITY_OPTIONS.length - 1
                } // -1 to exclude ALL_COMMODITIES
                variant="outline"
                size="sm"
                style={{
                  borderColor: borderColor,
                  color: textColorSecondary,
                }}
              >
                Select All
              </Button>
            </div>
          )}
        </div>

        <p className="text-sm" style={{ color: textColorSecondary }}>
          {isMultiMode
            ? `Select multiple commodities to compare (${effectiveSelectedCommodities.length} selected) • At least 1 required`
            : "Select a commodity to view its price chart and data"}
        </p>

        {!isMultiMode && (
          <div
            className="text-xs p-2 rounded"
            style={{
              backgroundColor: theme.colors[currentTheme].background.tertiary,
              color: textColorSecondary,
            }}
          >
            <strong>Note:</strong> "All" currently fetches individual data for
            all commodities. A true "All Commodities Index" aggregated metric is
            planned for future implementation.
          </div>
        )}
      </div>

      {/* Commodity Icons Grid */}
      <div className="space-y-3">
        <Label style={{ color: textColorPrimary }}>Available Commodities</Label>
        <div className="flex gap-4 w-full justify-start items-center flex-wrap">
          {COMMODITY_OPTIONS.map((commodity) => {
            // Skip ALL_COMMODITIES in multi-mode
            if (isMultiMode && commodity.value === "ALL_COMMODITIES") {
              return null;
            }

            return (
              <div
                key={commodity.value}
                className="flex flex-col items-center space-y-2"
              >
                <Button
                  onClick={() => handleSelectCommodity(commodity.value)}
                  disabled={isLoading(commodity.value)}
                  variant="outline"
                  className={`p-3 border-2 transition-all duration-200 ${
                    commodity.value === "ALL_COMMODITIES"
                      ? "h-20 w-20"
                      : "h-16 w-16"
                  }`}
                  style={getButtonStyle(commodity.value)}
                  title={commodity.label}
                >
                  <img
                    src={COMMODITY_ICON_MAP[commodity.value]}
                    alt={commodity.label}
                    className={`object-contain bg-white ${
                      commodity.value === "ALL_COMMODITIES"
                        ? "w-12 h-12"
                        : "w-10 h-10"
                    }`}
                    style={{ opacity: getIconOpacity(commodity.value) }}
                  />
                  {isLoading(commodity.value) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
                        style={{
                          color:
                            theme.colors.commodities[
                              commodity.value as keyof typeof theme.colors.commodities
                            ]?.[currentTheme] ||
                            theme.colors.status.info[currentTheme],
                        }}
                      />
                    </div>
                  )}
                </Button>
                <span
                  className="text-xs text-center leading-tight max-w-20"
                  style={{
                    color: isSelected(commodity.value)
                      ? textColorPrimary
                      : textColorSecondary,
                    fontWeight: isSelected(commodity.value) ? "bold" : "normal",
                  }}
                >
                  {(() => {
                    if (commodity.value === "ALL_COMMODITIES") return "All";
                    if (commodity.value === "WTI") return "WTI";
                    if (commodity.value === "BRENT") return "Brent";
                    if (commodity.value === "NATURAL_GAS") return "Natural Gas";
                    return commodity.label.split(" ").slice(0, 2).join(" ");
                  })()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Info */}
      <div className="text-sm space-y-1" style={{ color: textColorSecondary }}>
        {isMultiMode && activeFetches.size > 0 && (
          <p>
            <strong>Fetching:</strong> {Array.from(activeFetches).join(", ")}
          </p>
        )}
        <p>
          <strong>Cache:</strong> Data cached for 1 hour |{" "}
          <strong>Source:</strong> Alpha Vantage API
        </p>
      </div>
    </div>
  );
};

export default CommodityIconSelector;
