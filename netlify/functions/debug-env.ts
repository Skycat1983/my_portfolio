/**
 * Debug endpoint to check environment variables in production
 * This helps diagnose Firebase initialization issues
 *
 * Access: /api/debug-env
 */

export const handler = async () => {
  try {
    const envCheck: Record<string, any> = {
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || "unknown",
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID
        ? "✅ Present"
        : "❌ Missing",
      firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL
        ? "✅ Present"
        : "❌ Missing",
      firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY
        ? `✅ Present (${process.env.FIREBASE_PRIVATE_KEY.length} chars)`
        : "❌ Missing",
      alphaVantageApiKey: process.env.VITE_ALPHA_VANTAGE_API_KEY
        ? "✅ Present"
        : "❌ Missing",
      timestamp: new Date().toISOString(),
    };

    // Additional Firebase private key validation (without exposing content)
    if (process.env.FIREBASE_PRIVATE_KEY) {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
      envCheck.privateKeyValidation = {
        hasBeginMarker: privateKey.includes("BEGIN PRIVATE KEY") ? "✅" : "❌",
        hasEndMarker: privateKey.includes("END PRIVATE KEY") ? "✅" : "❌",
        lengthAfterProcessing: privateKey.length,
        startsWithDashes: privateKey.startsWith("-----") ? "✅" : "❌",
        endsWithDashes: privateKey.endsWith("-----") ? "✅" : "❌",
      };
    }

    console.log("🔍 Environment debug check:", envCheck);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(
        {
          status: "Environment Debug Check",
          ...envCheck,
        },
        null,
        2
      ),
    };
  } catch (error) {
    console.error("❌ Debug endpoint error:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Debug check failed",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
