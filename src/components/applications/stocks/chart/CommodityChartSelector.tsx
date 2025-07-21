import { useNewStore } from "@/hooks/useStore";
import theme from "@/styles/theme";
import type { AllCommoditiesResponse, SingleCommodityResponse } from "../types";
import { COMMODITY_OPTIONS } from "../types";

interface CommodityChartSelectorProps {
  data: SingleCommodityResponse | AllCommoditiesResponse;
  selectedCommodity?: string;
  // onCommodityChange: (commodity: string) => void;
}

// ! unused
const CommodityChartSelector = ({
  data,
  selectedCommodity,
}: // onCommodityChange,
CommodityChartSelectorProps) => {
  const currentTheme = useNewStore((state) => state.theme);

  // Get available commodities from the data
  const availableCommodities = (() => {
    if ("data" in data) {
      // Single commodity response
      return [data.commodity];
    } else {
      // Multiple commodities response - get successful ones
      return data.results
        .filter((result): result is SingleCommodityResponse => "data" in result)
        .map((result) => result.commodity);
    }
  })();

  // If only one commodity, don't show selector
  if (availableCommodities.length <= 1) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 mb-4">
      <label
        className="text-sm font-medium"
        style={{ color: theme.colors[currentTheme].text.primary }}
      >
        Chart Commodity:
      </label>
      <select
        value={selectedCommodity || availableCommodities[0]}
        // onChange={(e) => onCommodityChange(e.target.value)}
        className="px-3 py-1.5 rounded-md border text-sm min-w-32"
        style={{
          backgroundColor: theme.colors[currentTheme].background.primary,
          borderColor: theme.colors[currentTheme].border.primary,
          color: theme.colors[currentTheme].text.primary,
        }}
      >
        {availableCommodities.map((commodity) => {
          const option = COMMODITY_OPTIONS.find(
            (opt) => opt.value === commodity
          );
          return (
            <option key={commodity} value={commodity}>
              {option?.label || commodity}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default CommodityChartSelector;
