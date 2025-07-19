// Types for Alpha Vantage Market Status API response
interface MarketStatusData {
  endpoint: string;
  markets: Array<{
    market_type: string;
    region: string;
    primary_exchanges: string;
    local_open: string;
    local_close: string;
    current_status: string;
    notes: string;
  }>;
}

// const globalMarketOpenAndCloseStatus =
//   "https://www.alphavantage.co/query?function=MARKET_STATUS&apikey=demo";
// const topGainersAndLosers =
//   "https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=demo";
// const exchangeRates =
//   "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=JPY&apikey=demo";
// const exchangeRateIntraDay =
//   "https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=EUR&to_symbol=USD&interval=5min&apikey=demo";
// const echangeRateDaily =
//   "https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=EUR&to_symbol=USD&apikey=demo";
// const globalCoffeePriceMonthly =
//   "https://www.alphavantage.co/query?function=COFFEE&interval=monthly&apikey=demo";
// const globalPriceIndexAllCommodities =
//   "https://www.alphavantage.co/query?function=ALL_COMMODITIES&interval=monthly&apikey=demo";
// const newsSentiment =
//   "https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=demo";

// Simple in-memory cache (in production, you'd use a database or external cache)
let cache: {
  data: MarketStatusData;
  timestamp: number;
} | null = null;

const ALPHA_VANTAGE_URL =
  "https://www.alphavantage.co/query?function=MARKET_STATUS&apikey=demo";
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes for testing (change to 24 * 60 * 60 * 1000 for production)

export const handler = async () => {
  try {
    const now = Date.now();

    console.log("=== Function Called ===");
    console.log("current time in handler: ", new Date(now).toISOString());
    console.log("cache exists in handler: ", !!cache);
    if (cache) {
      const ageInMinutes = Math.floor((now - cache.timestamp) / (1000 * 60));
      console.log("cache age in minutes in handler: ", ageInMinutes);
      console.log(
        "cache expires in minutes in handler: ",
        Math.floor(CACHE_DURATION / (1000 * 60)) - ageInMinutes
      );
    }

    // Check if we have cached data that's still valid (less than 24 hours old)
    if (cache && now - cache.timestamp < CACHE_DURATION) {
      console.log(
        "✅ CACHE HIT in handler: returning cached market status data"
      );
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          source: "cache",
          cached_at: new Date(cache.timestamp).toISOString(),
          cache_age_minutes: Math.floor((now - cache.timestamp) / (1000 * 60)),
          data: cache.data,
        }),
      };
    }

    // Cache is expired or doesn't exist, fetch fresh data
    console.log("❌ CACHE MISS in handler: fetching fresh market status data");

    const response = await fetch(ALPHA_VANTAGE_URL);

    if (!response.ok) {
      throw new Error(
        `Alpha Vantage API responded with status: ${response.status}`
      );
    }

    const data: MarketStatusData = await response.json();

    // Update cache
    cache = {
      data,
      timestamp: now,
    };

    console.log("🆕 FRESH DATA fetched in handler: ", data.endpoint);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        source: "fresh",
        fetched_at: new Date(now).toISOString(),
        data: data,
      }),
    };
  } catch (error) {
    console.error("error in handler: ", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Failed to fetch market status",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
