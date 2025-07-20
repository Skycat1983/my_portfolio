// Types for Alpha Vantage API responses
export interface AlphaVantageDataPoint {
  date: string; // "2025-06-01"
  value: string; // "68.17"
}

export interface AlphaVantageResponse {
  name: string; // "Crude Oil Prices WTI"
  interval: string; // "monthly"
  unit: string; // "dollars per barrel"
  data: AlphaVantageDataPoint[];
}

// Types for our Firestore storage
export interface CommodityData {
  name: string;
  unit: string;
  interval: "monthly" | "daily";
  lastUpdated: FirebaseFirestore.Timestamp;
  dataSource: "alpha_vantage";
  dataCount: number; // Number of data points stored
  data: AlphaVantageDataPoint[];
}

// Supported commodities
export type CommodityType =
  | "WTI"
  | "BRENT"
  | "NATURAL_GAS"
  | "COPPER"
  | "ALUMINUM"
  | "WHEAT"
  | "CORN"
  | "SUGAR"
  | "COFFEE"
  | "ALL_COMMODITIES";

// Configuration for each commodity
export interface CommodityConfig {
  apiFunction: CommodityType;
  firestoreKey: string;
  displayName: string;
}

// Commodity configurations
export const COMMODITY_CONFIGS: Record<CommodityType, CommodityConfig> = {
  WTI: {
    apiFunction: "WTI",
    firestoreKey: "WTI",
    displayName: "Crude Oil (WTI)",
  },
  BRENT: {
    apiFunction: "BRENT",
    firestoreKey: "BRENT",
    displayName: "Crude Oil (Brent)",
  },
  NATURAL_GAS: {
    apiFunction: "NATURAL_GAS",
    firestoreKey: "NATURAL_GAS",
    displayName: "Natural Gas",
  },
  COPPER: {
    apiFunction: "COPPER",
    firestoreKey: "COPPER",
    displayName: "Copper",
  },
  ALUMINUM: {
    apiFunction: "ALUMINUM",
    firestoreKey: "ALUMINUM",
    displayName: "Aluminum",
  },
  WHEAT: {
    apiFunction: "WHEAT",
    firestoreKey: "WHEAT",
    displayName: "Wheat",
  },
  CORN: {
    apiFunction: "CORN",
    firestoreKey: "CORN",
    displayName: "Corn",
  },
  SUGAR: {
    apiFunction: "SUGAR",
    firestoreKey: "SUGAR",
    displayName: "Sugar",
  },
  COFFEE: {
    apiFunction: "COFFEE",
    firestoreKey: "COFFEE",
    displayName: "Coffee",
  },
  ALL_COMMODITIES: {
    apiFunction: "ALL_COMMODITIES",
    firestoreKey: "ALL_COMMODITIES",
    displayName: "All Commodities Index",
  },
};

// Constants
export const DATA_RETENTION_MONTHS = 60; // 5 years
export const COLLECTION_NAME = "commodities";
export const INTERVAL = "monthly";
export const CACHE_FRESHNESS_DAYS = 7; // Consider cached data fresh for 7 days
