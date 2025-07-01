export interface Chat {
  id: string;
  name: string;
  avatar: string;
  systemInstruction: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isArchived?: boolean;
}

export type MessageStatus = "undelivered" | "delivered" | "read";

export interface Message {
  id: string;
  content: string;
  sender: "user" | "contact";
  timestamp: string;
  isTyping?: boolean;
  status?: MessageStatus;
}
