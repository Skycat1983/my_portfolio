import type { CommodityType, CommodityData } from "./types";
import { fetchCommodityData } from "./alphaVantageClient";
import { readCommodityData, writeCommodityData } from "./firebase";
import { isDataFresh, createFirestoreDocument } from "./dataProcessor";

/**
 * Processes a single commodity request
 * Returns either cached or fresh data
 */
export const processCommodityRequest = async (
  commodity: CommodityType,
  apiKey: string
): Promise<{
  source: "cache" | "fresh";
  commodity: CommodityType;
  lastUpdated: FirebaseFirestore.Timestamp;
  dataCount: number;
  data: CommodityData["data"];
}> => {
  console.log(`=== Processing request for ${commodity} ===`);

  // Step 1: Check if we have cached data
  const storedData = await readCommodityData(commodity);

  // Step 2: Check if data is fresh
  if (storedData && isDataFresh(storedData)) {
    console.log(`Returning cached data for ${commodity}`);
    return {
      source: "cache",
      commodity,
      lastUpdated: storedData.lastUpdated,
      dataCount: storedData.dataCount,
      data: storedData.data,
    };
  }

  // Step 3: Data is stale or doesn't exist, fetch from API
  console.log(`Fetching fresh data for ${commodity} from Alpha Vantage`);
  const apiResponse = await fetchCommodityData(commodity, apiKey);

  // Step 4: Process and store the data
  const firestoreDocument = createFirestoreDocument(apiResponse);
  await writeCommodityData(commodity, firestoreDocument);

  // Step 5: Return the fresh data
  console.log(`Returning fresh data for ${commodity}`);
  return {
    source: "fresh",
    commodity,
    lastUpdated: firestoreDocument.lastUpdated,
    dataCount: firestoreDocument.dataCount,
    data: firestoreDocument.data,
  };
};
