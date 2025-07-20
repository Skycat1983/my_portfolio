import { useState } from "react";
import { useNewStore } from "@/hooks/useStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { COMMODITY_OPTIONS, type CommodityValue } from "./types";
import theme from "@/styles/theme";

interface CommoditySelectorProps {
  onFetch: (params: { type?: CommodityValue; all?: boolean }) => void;
  loading: boolean;
}

const CommoditySelector = ({ onFetch, loading }: CommoditySelectorProps) => {
  const [selectedCommodity, setSelectedCommodity] =
    useState<CommodityValue>("WTI");
  const [fetchAll, setFetchAll] = useState(false);

  // Theme system
  const currentTheme = useNewStore((state) => state.theme);
  const bgColorSecondary = theme.colors[currentTheme].background.secondary;
  const bgColorTertiary = theme.colors[currentTheme].background.tertiary;
  const textColorPrimary = theme.colors[currentTheme].text.primary;
  const textColorSecondary = theme.colors[currentTheme].text.secondary;
  const borderColor = theme.colors[currentTheme].border.primary;
  const surfaceColor = theme.colors[currentTheme].surface.primary;

  const handleFetch = () => {
    if (fetchAll) {
      onFetch({ all: true });
    } else {
      onFetch({ type: selectedCommodity });
    }
  };

  // Group commodities by category
  const groupedCommodities = COMMODITY_OPTIONS.reduce((groups, commodity) => {
    const category = commodity.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(commodity);
    return groups;
  }, {} as Record<string, Array<{ value: CommodityValue; label: string; category: string }>>);

  return (
    <div
      className="p-6 rounded-lg border space-y-6"
      style={{
        backgroundColor: bgColorSecondary,
        borderColor: borderColor,
      }}
    >
      <h2 className="text-xl font-semibold" style={{ color: textColorPrimary }}>
        Commodity Selection
      </h2>

      {/* Fetch All Toggle */}
      <div className="flex items-center justify-between py-2">
        <div className="space-y-1">
          <Label
            className="text-base font-medium"
            style={{ color: textColorPrimary }}
          >
            Fetch All Commodities
          </Label>
          <p className="text-sm" style={{ color: textColorSecondary }}>
            ⚠️ Uses 10 API calls - be mindful of rate limits
          </p>
        </div>
        <Switch
          checked={fetchAll}
          onCheckedChange={setFetchAll}
          style={{
            backgroundColor: bgColorTertiary,
          }}
          className="data-[state=checked]:bg-blue-600"
        />
      </div>

      {/* Individual Commodity Selector */}
      {!fetchAll && (
        <div className="space-y-3">
          <Label style={{ color: textColorPrimary }}>Select Commodity</Label>
          <Select
            value={selectedCommodity}
            onValueChange={(value: CommodityValue) =>
              setSelectedCommodity(value)
            }
          >
            <SelectTrigger
              style={{
                backgroundColor: surfaceColor,
                borderColor: borderColor,
                color: textColorPrimary,
              }}
            >
              <SelectValue placeholder="Choose a commodity" />
            </SelectTrigger>
            <SelectContent
              style={{
                backgroundColor: surfaceColor,
                borderColor: borderColor,
                color: textColorPrimary,
              }}
            >
              {Object.entries(groupedCommodities).map(
                ([category, commodities]) => (
                  <div key={category}>
                    <div
                      className="px-2 py-1.5 text-sm font-semibold"
                      style={{ color: textColorSecondary }}
                    >
                      {category}
                    </div>
                    {commodities.map((commodity) => (
                      <SelectItem
                        key={commodity.value}
                        value={commodity.value}
                        style={{ color: textColorPrimary }}
                        className="pl-6"
                      >
                        {commodity.label}
                      </SelectItem>
                    ))}
                  </div>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Fetch Button */}
      <div className="pt-2">
        <Button
          onClick={handleFetch}
          disabled={loading}
          className="w-full"
          style={{
            backgroundColor: theme.colors.status.info[currentTheme],
            color: "#ffffff",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading
            ? "Fetching..."
            : fetchAll
            ? "Fetch All Commodities"
            : `Fetch ${
                COMMODITY_OPTIONS.find((c) => c.value === selectedCommodity)
                  ?.label
              }`}
        </Button>
      </div>

      {/* Info Text */}
      <div className="text-sm space-y-1" style={{ color: textColorSecondary }}>
        <p>
          <strong>Cache:</strong> Data is cached for the current month
        </p>
        <p>
          <strong>Source:</strong> Alpha Vantage API (monthly data, 5 years
          retention)
        </p>
      </div>
    </div>
  );
};

export default CommoditySelector;
