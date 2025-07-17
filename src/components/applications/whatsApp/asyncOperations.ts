import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

interface GeminiInput {
  contents: string;
  systemInstruction: string;
}

const WORD_LIMIT = 50;

export async function whatsApp(input: GeminiInput): Promise<string> {
  try {
    // Log the enhanced system instruction for debugging
    console.log(
      "whatsApp function: API key is",
      apiKey ? "defined" : "undefined"
    );

    // Check if API key exists
    if (!apiKey || apiKey === "undefined") {
      console.log("whatsApp function: API key not found or undefined");
      throw new Error("Gemini API key not configured");
    }

    // Initialize the client only when needed and after key validation
    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: input.contents,
      config: {
        systemInstruction:
          input.systemInstruction +
          `\n\nThe response should be no more than ${WORD_LIMIT} words.`,
      },
    });
    return response.text || "I'm having trouble responding right now.";
  } catch (error) {
    console.error("Error in whatsApp function:", error);
    throw new Error("Failed to get AI response");
  }
}
