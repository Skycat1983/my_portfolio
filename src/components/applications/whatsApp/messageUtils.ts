import type { WhatsAppMessage } from "./types";
import { whatsApp } from "./asyncOperations";

export const generateMessageId = (): string =>
  `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const createMessage = (
  content: string,
  sender: string,
  receiver: string,
  status: "pending" | "sent" | "delivered" | "read"
): WhatsAppMessage => {
  return {
    id: generateMessageId(),
    content,
    sender,
    receiver,
    timestamp: new Date().toISOString(),
    deliveryStatus: status,
    failedAttempts: 0,
    lastAttempt: Date.now(),
  };
};

export const formatTimestamp = (timestamp: string | number): string => {
  if (typeof timestamp === "number") {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return timestamp;
};

export const processAIResponse = async (
  input: string,
  systemInstruction: string
): Promise<string> => {
  try {
    const response = await whatsApp({
      contents: input,
      systemInstruction,
    });

    return response;
  } catch (error) {
    console.error("Error processing AI response:", error);
    throw error; // Let the caller handle the error
  }
};

export const isValidMessage = (message: WhatsAppMessage): boolean => {
  return (
    typeof message.id === "string" &&
    typeof message.content === "string" &&
    message.content.trim().length > 0 &&
    (message.sender === "user" || message.sender === "contact") &&
    typeof message.timestamp === "string"
  );
};
