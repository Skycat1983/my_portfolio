const baseUrl = "https://www.alphavantage.co/query";
const interval = "monthly";
const apiKey = "demo";

const commodities = {
  crudeOilWTI: "WTI",
  crudeOilBrent: "BRENT",
  naturalGas: "NATURAL_GAS",
  copper: "COPPER",
  aluminium: "ALUMINUM",
  wheat: "WHEAT",
  corn: "CORN",
  sugar: "SUGAR",
  coffee: "COFFEE",
  all: "ALL_COMMODITIES",
};

//https://console.firebase.google.com/u/0/project/portfolio-hub-a1376/firestore/databases/-default-/data

// Builds the full URL for a given commodity function name
const buildUrl = (func: string) =>
  `${baseUrl}?function=${func}&interval=${interval}&apikey=${apiKey}`;

// Example handler fetching just WTI for now
export const handler = async () => {
  const url = buildUrl(commodities.crudeOilWTI);
  try {
    const response = await fetch(url);
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Error fetching commodities data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch commodities data" }),
    };
  }
};
