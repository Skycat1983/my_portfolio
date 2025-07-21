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
  onFetch: (params: { type?: CommodityValue; all?: boolean }) => void;
  loading: boolean;
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
}: CommodityIconSelectorProps) => {
  const [selectedCommodity, setSelectedCommodity] =
    useState<CommodityValue>("ALL_COMMODITIES");

  // Theme system
  const currentTheme = useNewStore((state) => state.theme);
  const bgColorSecondary = theme.colors[currentTheme].background.secondary;
  const textColorPrimary = theme.colors[currentTheme].text.primary;
  const textColorSecondary = theme.colors[currentTheme].text.secondary;
  const borderColor = theme.colors[currentTheme].border.primary;

  const handleSelectCommodity = (commodity: CommodityValue) => {
    setSelectedCommodity(commodity);

    if (commodity === "ALL_COMMODITIES") {
      onFetch({ all: true });
    } else {
      onFetch({ type: commodity });
    }
  };

  const isSelected = (commodity: CommodityValue) => {
    return selectedCommodity === commodity;
  };

  const getIconOpacity = (commodity: CommodityValue) => {
    return isSelected(commodity) ? 1 : 0.4;
  };

  const getButtonStyle = (commodity: CommodityValue) => {
    const selected = isSelected(commodity);
    return {
      backgroundColor: selected
        ? theme.colors.status.info[currentTheme]
        : "transparent",
      borderColor: selected
        ? theme.colors.status.info[currentTheme]
        : borderColor,
      opacity: loading ? 0.6 : 1,
    };
  };

  // Get grid size based on number of commodities
  const gridCols = Math.min(5, COMMODITY_OPTIONS.length);

  return (
    <div
      className="p-6 rounded-lg border space-y-6"
      style={{
        backgroundColor: bgColorSecondary,
        borderColor: borderColor,
      }}
    >
      <div className="space-y-2">
        <h2
          className="text-xl font-semibold"
          style={{ color: textColorPrimary }}
        >
          Commodity Selection
        </h2>
        <p className="text-sm" style={{ color: textColorSecondary }}>
          Select a commodity to view its price chart and data
        </p>
      </div>

      {/* Commodity Icons Grid */}
      <div className="space-y-3">
        <Label style={{ color: textColorPrimary }}>Available Commodities</Label>
        <div
          className={`flex gap-4 w-full justify-center items-center`}

          //   className={`grid grid-cols-${gridCols} gap-4 justify-items-center`}
        >
          {COMMODITY_OPTIONS.map((commodity) => (
            <div
              key={commodity.value}
              className="flex flex-col items-center space-y-2"
            >
              <Button
                onClick={() => handleSelectCommodity(commodity.value)}
                disabled={loading}
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
                  className={`object-contain ${
                    commodity.value === "ALL_COMMODITIES"
                      ? "w-12 h-12"
                      : "w-10 h-10"
                  }`}
                  style={{ opacity: getIconOpacity(commodity.value) }}
                />
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
                {commodity.value === "ALL_COMMODITIES"
                  ? "All"
                  : commodity.label.split(" ").slice(0, 2).join(" ")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Status Info */}
      <div className="text-sm space-y-1" style={{ color: textColorSecondary }}>
        <p>
          <strong>Status:</strong>{" "}
          {loading
            ? "Fetching data..."
            : selectedCommodity === "ALL_COMMODITIES"
            ? "All commodities selected (10 API calls)"
            : `${
                COMMODITY_OPTIONS.find((c) => c.value === selectedCommodity)
                  ?.label
              } selected`}
        </p>
        <p>
          <strong>Cache:</strong> Data cached for 7 days |{" "}
          <strong>Source:</strong> Alpha Vantage API
        </p>
      </div>
    </div>
  );
};

export default CommodityIconSelector;
