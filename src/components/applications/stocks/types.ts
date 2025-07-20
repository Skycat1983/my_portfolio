// Frontend types for commodity data
export interface CommodityDataPoint {
  date: string; // "2025-06-01"
  value: string; // "68.17"
}

export interface SingleCommodityResponse {
  source: "cache" | "fresh";
  commodity: string;
  lastUpdated: {
    _seconds: number;
    _nanoseconds: number;
  };
  dataCount: number;
  data: CommodityDataPoint[];
}

export interface AllCommoditiesResponse {
  type: "all";
  totalCommodities: number;
  results: (SingleCommodityResponse | { commodity: string; error: string })[];
}

// Available commodities for selection
export const COMMODITY_OPTIONS = [
  { value: "WTI", label: "Crude Oil (WTI)", category: "Energy" },
  { value: "BRENT", label: "Crude Oil (Brent)", category: "Energy" },
  { value: "NATURAL_GAS", label: "Natural Gas", category: "Energy" },
  { value: "COPPER", label: "Copper", category: "Metals" },
  { value: "ALUMINUM", label: "Aluminum", category: "Metals" },
  { value: "WHEAT", label: "Wheat", category: "Agriculture" },
  { value: "CORN", label: "Corn", category: "Agriculture" },
  { value: "SUGAR", label: "Sugar", category: "Agriculture" },
  { value: "COFFEE", label: "Coffee", category: "Agriculture" },
  {
    value: "ALL_COMMODITIES",
    label: "All Commodities Index",
    category: "Index",
  },
] as const;

export type CommodityValue = (typeof COMMODITY_OPTIONS)[number]["value"];

// UI State types
export interface FetchState {
  loading: boolean;
  error: string | null;
  data: SingleCommodityResponse | AllCommoditiesResponse | null;
}
