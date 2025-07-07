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

// export type MessageStatus = "undelivered" | "delivered" | "read";

export type DeliveryStatus = "pending" | "sent" | "delivered" | "read";
// | "failed";

export interface BaseContact {
  id: string;
  name: string;
  avatar: string;
  phoneNumber: string;
}

export interface AIContact extends BaseContact {
  type: "ai";
  systemInstruction: string;
  archived: boolean;
}

export interface UserContact extends BaseContact {
  type: "user";
}

// Type guard functions
export const isAIContact = (contact: Contact): contact is AIContact =>
  contact.type === "ai";

export const isUserContact = (contact: Contact): contact is UserContact =>
  contact.type === "user";

export type Contact = AIContact | UserContact;

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: Contact["id"];
  receiver: Contact["id"];
  deliveryStatus: DeliveryStatus;
}

export interface Conversation {
  id: string;
  participants: [Contact["id"], Contact["id"]]; // [userId, aiId]
  lastSeenMessageId: Message["id"] | null;
}

// Type helpers for ID lookups
export type ContactId = Contact["id"];
export type MessageId = Message["id"];
export type ConversationId = Conversation["id"];

// Type helper for normalized collections
export type NormalizedCollection<T extends { id: string }> = {
  byId: Record<T["id"], T>;
  allIds: Array<T["id"]>;
};

// Type helper for conversation participants
export type ConversationParticipants = [ContactId, ContactId];

// Type helper for UI views
export type WhatsAppView = "chatList" | "chat" | "archive" | "contact";

export interface WhatsAppMessage extends Message {
  deliveryStatus: DeliveryStatus;
  failedAttempts?: number;
  lastAttempt?: number;
}
