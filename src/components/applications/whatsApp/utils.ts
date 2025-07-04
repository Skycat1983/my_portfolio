import type { Message } from "./types";

interface ConversationHistoryEntry {
  role: "user" | "assistant";
  content: string;
}

/**
 * Converts WhatsApp messages to a format suitable for conversation history
 */
export function formatMessagesForHistory(
  messages: Message[]
): ConversationHistoryEntry[] {
  return messages.map((msg) => ({
    role: msg.sender === "user" ? "user" : "assistant",
    content: msg.content,
  }));
}

/**
 * Builds a complete system instruction that includes both personality and conversation history
 */
export function buildSystemInstruction(
  baseInstruction: string,
  messages: Message[],
  maxHistoryLength: number = 10
): string {
  const recentMessages = messages.slice(-maxHistoryLength);
  const formattedHistory = formatMessagesForHistory(recentMessages)
    .map(
      (entry) =>
        `${entry.role === "user" ? "User" : "Assistant"}: ${entry.content}`
    )
    .join("\n");

  return `${baseInstruction}

${
  formattedHistory
    ? `Previous conversation history:
${formattedHistory}

Remember the above conversation and maintain character consistency in your response.`
    : ""
}`;
}
