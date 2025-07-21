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

// New multi-commodity state management types
export interface CommodityDataEntry {
  data: SingleCommodityResponse;
  fetchedAt: number;
  selected: boolean;
}

export interface MultiCommodityState {
  [commodityType: string]: CommodityDataEntry;
}

// Enhanced fetch state for multi-commodity management
export interface EnhancedFetchState {
  loading: boolean;
  error: string | null;
  activeFetches: Set<CommodityValue>; // Track ongoing fetches per commodity
  data: MultiCommodityState; // Replace single data with multi-commodity map
}

// Multi-commodity chart data interface
export interface MultiTimeUnit {
  name: string; // Date formatted as "Jan 2024"
  date: string; // Raw date for sorting
  [commodityKey: string]: string | number | null; // Allow null for missing data points
}

export interface MultiCommodityChartData {
  timeUnits: MultiTimeUnit[];
  selectedCommodities: CommodityValue[];
  commodityColors: Partial<Record<CommodityValue, string>>; // Make this partial to allow empty state
}

// Enhanced chart props for multi-commodity support
export interface MultiCommodityChartProps {
  data: MultiCommodityState;
  selectedCommodities: CommodityValue[];
  error: string | null;
}

// Legacy single commodity fetch interface (for backward compatibility)
export interface FetchParams {
  type?: CommodityValue;
  all?: boolean;
}

// New multi-commodity fetch interface
export interface MultiCommodityFetchParams {
  add?: CommodityValue; // Add commodity to selection
  remove?: CommodityValue; // Remove commodity from selection
  toggle?: CommodityValue; // Toggle commodity selection
  clear?: boolean; // Clear all selections
}

// UI State types
export interface FetchState {
  loading: boolean;
  error: string | null;
  data: SingleCommodityResponse | AllCommoditiesResponse | null;
}
