import type { WhatsAppMessage } from "./types";
import { whatsApp } from "./whatsApp";

interface MessageOperationConfig {
  maxRetries: number;
  retryDelay: number; // milliseconds
}

const DEFAULT_CONFIG: MessageOperationConfig = {
  maxRetries: 3,
  retryDelay: 2000,
};

export const generateMessageId = (): string =>
  `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const createMessage = (
  content: string,
  sender: "user" | "contact",
  receiver: "user" | "contact",
  status: "pending" | "sent" | "delivered" | "read" | "failed" = "pending"
): WhatsAppMessage => ({
  id: generateMessageId(),
  content,
  sender,
  receiver,
  timestamp: new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
  deliveryStatus: status,
  failedAttempts: 0,
  lastAttempt: Date.now(),
});

export const shouldRetryMessage = (
  message: WhatsAppMessage,
  config: MessageOperationConfig = DEFAULT_CONFIG
): boolean => {
  if (!message.failedAttempts || !message.lastAttempt) return true;

  const timeSinceLastAttempt = Date.now() - message.lastAttempt;
  return (
    message.failedAttempts < config.maxRetries &&
    timeSinceLastAttempt >= config.retryDelay
  );
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
  systemInstruction: string,
  onSuccess: (response: string) => void,
  onError: (error: Error) => void
): Promise<void> => {
  try {
    const response = await whatsApp({
      contents: input,
      systemInstruction,
    });
    onSuccess(response);
  } catch (error) {
    console.error("Error processing AI response:", error);
    onError(error as Error);
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

export const getMessageDeliveryTime = (message: WhatsAppMessage): number => {
  if (
    message.deliveryStatus === "pending" ||
    message.deliveryStatus === "failed"
  ) {
    return 0;
  }

  const timestampDate = new Date(message.timestamp);
  return timestampDate.getTime();
};

export const sortMessagesByTimestamp = (
  messages: WhatsAppMessage[]
): WhatsAppMessage[] => {
  return [...messages].sort((a, b) => {
    const timeA = getMessageDeliveryTime(a);
    const timeB = getMessageDeliveryTime(b);
    return timeA - timeB;
  });
};
