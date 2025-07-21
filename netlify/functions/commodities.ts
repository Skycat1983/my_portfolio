import admin from "firebase-admin";
import type { CommodityType, AlphaVantageDataPoint } from "./lib/types";
import { COMMODITY_CONFIGS } from "./lib/types";
import { processCommodityRequest } from "./lib/commodityService";

// Netlify function event type
interface NetlifyEvent {
  queryStringParameters?: Record<string, string> | null;
}

/*
COMMODITY DATA FLOW - CHAIN OF EVENTS:

1. REQUEST PARSING (commodities.ts)
   - Parse query params: ?type=BRENT or ?all=true
   - Default to WTI if no type specified
   - Check API key (production vs demo)

2. ROUTING LOGIC (commodities.ts)
   - Single commodity: Call processCommodityRequest() once
   - All commodities: Loop through all 10 types with rate limiting

3. COMMODITY PROCESSING (commodityService.ts)
   - Read existing data from Firestore (firebase.ts)
   - Check if data is fresh using time-based logic (dataProcessor.ts)
   - If fresh (< 7 days old): Return cached data with source="cache"
   - If stale/missing: Proceed to fetch fresh data

4. FRESH DATA ACQUISITION (alphaVantageClient.ts)
   - Build Alpha Vantage API URL with commodity type & API key
   - Fetch data from Alpha Vantage API
   - Validate response structure

5. DATA PROCESSING (dataProcessor.ts)
   - Trim data to 60 months retention limit (newest first)
   - Format for Firestore storage with metadata
   - Add current timestamp for future freshness checks

6. PERSISTENCE (firebase.ts)
   - Store processed data in Firestore: /commodities/{COMMODITY}_monthly
   - Include timestamp, data count, and trimmed price data

7. RESPONSE FORMATTING (commodityService.ts)
   - Return standardized response with source="fresh"
   - Include metadata: commodity type, data count, timestamp

8. ERROR HANDLING (All modules)
   - API failures, Firestore errors, invalid data
   - Graceful degradation with descriptive error messages

KEY DESIGN DECISIONS:
- Time-based caching (7 days) vs month-based (accounts for Alpha Vantage data lag)
- Stateless functions with Firestore as persistent memory
- Modular architecture for testability and maintainability
- Rate limiting for "all commodities" to respect API limits
*/

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
  console.log("🔧 Initializing Firebase Admin in commodities function");

  // Debug environment variables (without exposing secrets)
  console.log("🔍 Environment check:");
  console.log(
    "- FIREBASE_PROJECT_ID:",
    process.env.FIREBASE_PROJECT_ID ? "✅ Present" : "❌ Missing"
  );
  console.log(
    "- FIREBASE_CLIENT_EMAIL:",
    process.env.FIREBASE_CLIENT_EMAIL ? "✅ Present" : "❌ Missing"
  );
  console.log(
    "- FIREBASE_PRIVATE_KEY:",
    process.env.FIREBASE_PRIVATE_KEY
      ? `✅ Present (${process.env.FIREBASE_PRIVATE_KEY.length} chars)`
      : "❌ Missing"
  );

  // Check for required environment variables
  if (
    !process.env.FIREBASE_PROJECT_ID ||
    !process.env.FIREBASE_CLIENT_EMAIL ||
    !process.env.FIREBASE_PRIVATE_KEY
  ) {
    const missing: string[] = [];
    if (!process.env.FIREBASE_PROJECT_ID) missing.push("FIREBASE_PROJECT_ID");
    if (!process.env.FIREBASE_CLIENT_EMAIL)
      missing.push("FIREBASE_CLIENT_EMAIL");
    if (!process.env.FIREBASE_PRIVATE_KEY) missing.push("FIREBASE_PRIVATE_KEY");

    throw new Error(
      `❌ Missing required Firebase environment variables: ${missing.join(
        ", "
      )}`
    );
  }

  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");

    // Validate private key format
    if (
      !privateKey.includes("BEGIN PRIVATE KEY") ||
      !privateKey.includes("END PRIVATE KEY")
    ) {
      throw new Error(
        "❌ FIREBASE_PRIVATE_KEY does not appear to be a valid private key format"
      );
    }

    console.log("🔑 Private key format appears valid");

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
    console.error("❌ Firebase Admin initialization failed:", error);
    console.error("🔍 Error details:", {
      name: error.name,
      message: error.message,
      code: error.code,
    });
    throw new Error(`Firebase initialization failed: ${error.message}`);
  }
} else {
  console.log("♻️ Firebase Admin already initialized in commodities function");
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
      // Process all commodities in parallel (much faster for cache hits!)
      console.log(
        "🚀 Processing ALL commodities in parallel - cache hits will be fast"
      );

      const commodityTypes = Object.keys(COMMODITY_CONFIGS) as CommodityType[];

      // Use Promise.allSettled to handle mix of success/failure
      const settlementResults = await Promise.allSettled(
        commodityTypes.map((commodityType) =>
          processCommodityRequest(commodityType, apiKey)
        )
      );

      // Process results and separate successful from failed
      const results: CommodityResult[] = settlementResults.map(
        (settlement, index) => {
          const commodityType = commodityTypes[index];

          if (settlement.status === "fulfilled") {
            return settlement.value;
          } else {
            console.error(
              `❌ Failed to process ${commodityType}:`,
              settlement.reason
            );
            return {
              commodity: commodityType,
              error:
                settlement.reason instanceof Error
                  ? settlement.reason.message
                  : "Unknown error",
            };
          }
        }
      );

      const successCount = results.filter((r) => "source" in r).length;
      const cacheHits = results.filter(
        (r) => "source" in r && r.source === "cache"
      ).length;

      console.log(
        `✅ Completed all commodities: ${successCount}/${results.length} successful, ${cacheHits} cache hits`
      );

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          type: "all",
          totalCommodities: results.length,
          successfulFetches: successCount,
          cacheHits: cacheHits,
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
