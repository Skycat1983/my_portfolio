import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `VITE_GEMINI_API_KEY`.
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

interface GeminiInput {
  contents: string;
  systemInstruction: string;
}

const WORD_LIMIT = 50;

export async function whatsApp(input: GeminiInput): Promise<string> {
  try {
    // Log the enhanced system instruction for debugging
    console.log("Enhanced system instruction:", input.systemInstruction);
    console.log("Contents:", input);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: input.contents,
      config: {
        systemInstruction:
          input.systemInstruction +
          `\n\nThe response should be no more than ${WORD_LIMIT} words.`,
      },
    });
    console.log("AI response in whatsApp function:", response.text);
    return response.text || "I'm having trouble responding right now.";
  } catch (error) {
    console.error("Error in whatsApp function:", error);
    throw new Error("Failed to get AI response");
  }
}
