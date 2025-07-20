import admin from "firebase-admin";
import type { CommodityType, AlphaVantageDataPoint } from "./lib/types";
import { COMMODITY_CONFIGS } from "./lib/types";
import { processCommodityRequest } from "./lib/commodityService";

/*
endpoint to use later, maybe...
const topGainersAndLosers =
  "https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=demo";
const exchangeRates =
  "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=JPY&apikey=demo";
const exchangeRateIntraDay =
  "https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=EUR&to_symbol=USD&interval=5min&apikey=demo";
const echangeRateDaily =
  "https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=EUR&to_symbol=USD&apikey=demo";
const newsSentiment =
  "https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=demo";
*/

// Netlify function event type
interface NetlifyEvent {
  queryStringParameters?: Record<string, string> | null;
}

// Union type for results array
type CommodityResult =
  | {
      source: "cache" | "fresh";
      commodity: CommodityType;
      lastUpdated: FirebaseFirestore.Timestamp;
      dataCount: number;
      data: AlphaVantageDataPoint[];
    }
  | {
      commodity: CommodityType;
      error: string;
    };

// Firebase Admin initialization - only initialize if not already done
if (!admin.apps.length) {
  console.log("Initializing Firebase Admin in commodities function");

  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
    console.log(
      "✅ Firebase Admin initialized successfully in commodities function"
    );
  } catch (error) {
    console.error(
      "❌ Firebase Admin initialization failed in commodities function: ",
      error
    );
    throw error;
  }
} else {
  console.log("Firebase Admin already initialized in commodities function");
}

/**
 * Parses query parameters from the event
 */
const parseQueryParams = (
  event: NetlifyEvent
): { commodity: CommodityType; all: boolean } => {
  const queryParams = event?.queryStringParameters || {};
  const type = queryParams.type?.toUpperCase();
  const all = queryParams.all === "true";

  // Default to WTI if no type specified
  const commodity =
    type && type in COMMODITY_CONFIGS ? (type as CommodityType) : "WTI";

  console.log(
    `Query params - type: ${type}, all: ${all}, resolved commodity: ${commodity}`
  );

  return { commodity, all };
};

/**
 * Main handler for commodity data requests
 * Supports:
 * - /api/commodities (defaults to WTI)
 * - /api/commodities?type=BRENT (specific commodity)
 * - /api/commodities?all=true (all commodities - use carefully due to API limits)
 */
export const handler = async (event: NetlifyEvent) => {
  // Get API key from environment variables
  const apiKey = process.env.VITE_ALPHA_VANTAGE_API_KEY || "demo";

  if (apiKey === "demo") {
    console.log("⚠️ Using demo API key - switch to real key for production");
  } else {
    console.log("✅ Using production API key");
  }

  try {
    const { commodity, all } = parseQueryParams(event);

    if (all) {
      // Process all commodities (be careful with API limits!)
      console.log(
        "🚀 Processing ALL commodities - this will use multiple API calls"
      );

      const results: CommodityResult[] = [];
      const commodityTypes = Object.keys(COMMODITY_CONFIGS) as CommodityType[];

      for (const commodityType of commodityTypes) {
        try {
          const result = await processCommodityRequest(commodityType, apiKey);
          results.push(result);

          // Add delay between requests to avoid rate limiting
          if (commodityType !== commodityTypes[commodityTypes.length - 1]) {
            console.log("⏳ Waiting 1 second before next API call...");
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.error(`❌ Failed to process ${commodityType}:`, error);
          results.push({
            commodity: commodityType,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          type: "all",
          totalCommodities: results.length,
          results,
        }),
      };
    } else {
      // Process single commodity
      const result = await processCommodityRequest(commodity, apiKey);

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(result),
      };
    }
  } catch (error) {
    console.error("❌ Error processing commodity request:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Failed to fetch commodity data",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
