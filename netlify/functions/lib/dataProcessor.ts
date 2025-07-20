import admin from "firebase-admin";
import type {
  AlphaVantageResponse,
  CommodityData,
  AlphaVantageDataPoint,
} from "./types";
import { DATA_RETENTION_MONTHS, CACHE_FRESHNESS_DAYS } from "./types";

/**
 * Trims data array to keep only the newest N months
 * Alpha Vantage returns data in newest-first order
 */
export const trimDataToRetentionLimit = (
  data: AlphaVantageDataPoint[],
  maxMonths: number = DATA_RETENTION_MONTHS
): AlphaVantageDataPoint[] => {
  if (data.length <= maxMonths) {
    return data;
  }

  const trimmedData = data.slice(0, maxMonths);
  console.log(
    `Trimmed data from ${data.length} to ${trimmedData.length} months`
  );

  return trimmedData;
};

/**
 * Converts Alpha Vantage response to our Firestore format
 */
export const formatForFirestore = (
  apiResponse: AlphaVantageResponse
): Omit<CommodityData, "lastUpdated"> => {
  const trimmedData = trimDataToRetentionLimit(apiResponse.data);

  return {
    name: apiResponse.name,
    unit: apiResponse.unit,
    interval: "monthly" as const,
    dataSource: "alpha_vantage" as const,
    dataCount: trimmedData.length,
    data: trimmedData,
  };
};

/**
 * Checks if stored data is fresh (fetched recently, regardless of data month)
 * This accounts for Alpha Vantage data being 1-2 months behind current date
 */
export const isDataFresh = (storedData: CommodityData | null): boolean => {
  if (!storedData || !storedData.data || storedData.data.length === 0) {
    console.log("No stored data found - data is stale");
    return false;
  }

  // Check when we last fetched, not the data month
  const now = Date.now();
  const lastFetchTime = storedData.lastUpdated.toMillis();
  const daysSinceLastFetch = Math.floor(
    (now - lastFetchTime) / (1000 * 60 * 60 * 24)
  );

  // Consider data fresh if fetched within last N days
  // Monthly data doesn't change frequently, so this is reasonable
  const isFresh = daysSinceLastFetch < CACHE_FRESHNESS_DAYS;

  console.log(
    `Data freshness check: last_fetch=${new Date(
      lastFetchTime
    ).toISOString()}, days_ago=${daysSinceLastFetch}, fresh=${isFresh}`
  );
  console.log(
    `Latest data month: ${storedData.data[0]?.date}, data_count=${storedData.dataCount}`
  );

  return isFresh;
};

/**
 * Creates a complete CommodityData object ready for Firestore
 */
export const createFirestoreDocument = (
  apiResponse: AlphaVantageResponse
): CommodityData => {
  const baseData = formatForFirestore(apiResponse);

  return {
    ...baseData,
    lastUpdated: admin.firestore.Timestamp.now(),
  };
};
