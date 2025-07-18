import { useState } from "react";

interface MarketData {
  source: "cache" | "fresh";
  cached_at?: string;
  fetched_at?: string;
  cache_age_minutes?: number;
  data: {
    endpoint: string;
    markets: Array<{
      market_type: string;
      region: string;
      current_status: string;
      local_open: string;
      local_close: string;
    }>;
  };
}

const MarketStatusExample = () => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchMarketStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ Use relative path - works in both dev and production
      const response = await fetch("/api/hello-world");

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data: MarketData = await response.json();
      setMarketData(data);

      console.log("market data fetched from serverless function: ", data);
    } catch (error) {
      console.error("error fetching market data: ", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Market Status Example</h1>

      <button
        onClick={handleFetchMarketStatus}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded mb-4"
      >
        {loading ? "Loading..." : "Fetch Market Status"}
      </button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      {marketData && (
        <div className="bg-gray-100 p-4 rounded">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Data Source Info:</h2>
            <p>
              <strong>Source:</strong> {marketData.source}
            </p>
            {marketData.source === "cache" && (
              <p>
                <strong>Cache Age:</strong> {marketData.cache_age_minutes}{" "}
                minutes
              </p>
            )}
            <p>
              <strong>Timestamp:</strong>{" "}
              {marketData.cached_at || marketData.fetched_at}
            </p>
          </div>

          <h2 className="text-lg font-semibold mb-2">Market Status:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketData.data.markets.slice(0, 6).map((market, index) => (
              <div key={index} className="bg-white p-3 rounded border">
                <h3 className="font-medium">{market.region}</h3>
                <p className="text-sm text-gray-600">{market.market_type}</p>
                <p
                  className={`font-semibold ${
                    market.current_status === "open"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {market.current_status.toUpperCase()}
                </p>
                <p className="text-xs text-gray-500">
                  {market.local_open} - {market.local_close}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketStatusExample;
