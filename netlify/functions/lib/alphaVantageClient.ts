import type { AlphaVantageResponse, CommodityType } from "./types";

const BASE_URL = "https://www.alphavantage.co/query";
const INTERVAL = "monthly";

/**
 * Builds the Alpha Vantage API URL for a given commodity
 */
const buildApiUrl = (
  commodityFunction: CommodityType,
  apiKey: string
): string => {
  return `${BASE_URL}?function=${commodityFunction}&interval=${INTERVAL}&apikey=${apiKey}`;
};

/**
 * Fetches commodity data from Alpha Vantage API
 */
export const fetchCommodityData = async (
  commodityFunction: CommodityType,
  apiKey: string = "demo"
): Promise<AlphaVantageResponse> => {
  const url = buildApiUrl(commodityFunction, apiKey);

  console.log(
    `Fetching commodity data for ${commodityFunction} from Alpha Vantage`
  );

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Alpha Vantage API responded with status: ${response.status}`
      );
    }

    const data: AlphaVantageResponse = await response.json();

    // Validate the response structure
    if (!data.name || !data.data || !Array.isArray(data.data)) {
      throw new Error("Invalid response structure from Alpha Vantage API");
    }

    console.log(
      `✅ Successfully fetched ${data.data.length} data points for ${commodityFunction}`
    );

    return data;
  } catch (error) {
    console.error(
      `❌ Failed to fetch commodity data for ${commodityFunction}:`,
      error
    );
    throw error;
  }
};
