import type { WhatsAppState } from "@/store/contentState/whatsAppSlice";
import type {
  Contact,
  Conversation,
  DeliveryStatus,
  WhatsAppView,
} from "./types";

// Initial contacts data
const contacts = [
  {
    id: "ai_emily",
    type: "ai" as const,
    name: "Emily",
    avatar: "👩‍💻",
    phoneNumber: "+1 (555) 0123",
    systemInstruction:
      "You are Emily, a tech enthusiast and software developer. You're passionate about coding, especially React and TypeScript. You often share tips about best practices and new features in web development.",
    archived: true,
  },
  {
    id: "ai_tim",
    type: "ai" as const,
    name: "Tim Cook",
    avatar: "👨‍💼",
    phoneNumber: "+1 (555) 0124",
    systemInstruction:
      "You are Tim Cook, CEO of Apple. You're interested in hiring the user and speak professionally but enthusiastically about the opportunity to work together at Apple.",
    archived: false,
  },
  {
    id: "ai_elon",
    type: "ai" as const,
    name: "Elon Musk",
    avatar: "👨‍🚀",
    phoneNumber: "+1 (555) 0125",
    systemInstruction:
      "You are Elon Musk, CEO of Tesla. You're interested in hiring the user and speak professionally but enthusiastically about the opportunity to work together at Tesla.",
    archived: false,
  },
  {
    id: "user_self",
    type: "user" as const,
    name: "Me",
    avatar: "👤",
    phoneNumber: "+1 (555) 0125",
  },
] as const;

interface Message {
  id: string;
  sender: Contact["id"];
  receiver: Contact["id"];
  content: string;
  timestamp: string;
  deliveryStatus: DeliveryStatus;
}

const messages = [
  {
    id: "msg_1",
    content:
      "Hey! I saw your portfolio and I'm really impressed with your React work",
    sender: "ai_emily",
    receiver: "user_self",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 24 hours ago
    deliveryStatus: "read" as const,
  },
  {
    id: "msg_2",
    content: "Thanks! I've been working hard on improving my TypeScript skills",
    sender: "user_self",
    receiver: "ai_emily",
    timestamp: new Date(Date.now() - 85400000).toISOString(),
    deliveryStatus: "read" as const,
  },
  {
    id: "msg_3",
    content:
      "Hello, this is Tim Cook. I'd love to discuss an opportunity at Apple",
    sender: "ai_tim",
    receiver: "user_self",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    deliveryStatus: "delivered" as const,
  },
  {
    id: "msg_4",
    content:
      "Hello, this is Elon Musk. I'd love to discuss an opportunity at Tesla",
    sender: "ai_elon",
    receiver: "user_self",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    deliveryStatus: "delivered" as const,
  },
  {
    id: "msg_5",
    content: "Are you there?",
    sender: "ai_elon",
    receiver: "user_self",
    timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    deliveryStatus: "delivered" as const,
  },
] as const;

// Initial conversations data
const conversations = [
  {
    id: "conv_emily",
    participants: ["user_self", "ai_emily"] as const,
    lastSeenMessageId: "msg_2",
  },
  {
    id: "conv_tim",
    participants: ["user_self", "ai_tim"] as const,
    lastSeenMessageId: null,
  },
  {
    id: "conv_elon",
    participants: ["user_self", "ai_elon"] as const,
    lastSeenMessageId: "msg_5",
  },
] as const;

// Helper function to normalize an array of items by ID
/*
converts:

const contacts = [
  { id: "ai_emily", name: "Emily", … },
  { id: "ai_tim",   name: "Tim Cook", … },
  { id: "user_self", name: "Me", … },
]

to look like this:

const contacts = {
  byId: {
    ai_emily: { id: "ai_emily", name: "Emily", … },
    ai_tim: { id: "ai_tim", name: "Tim Cook", … },
    user_self: { id: "user_self", name: "Me", … },
  },
  allIds: ["ai_emily", "ai_tim", "user_self"],
}
*/
const normalizeById = <T extends { id: string }>(items: readonly T[]) => {
  const byId: Record<string, T> = {};
  const allIds: string[] = [];

  items.forEach((item) => {
    byId[item.id] = item;
    allIds.push(item.id);
  });

  return { byId, allIds };
};

const groupMessagesByConversation = (messages: readonly Message[]) => {
  const byConversation: Record<string, string[]> = {};

  messages.forEach((message) => {
    // pick the ID of whoever isn’t you
    const otherId =
      message.sender === "user_self" ? message.receiver : message.sender;

    const convId = `conv_${otherId.split("_")[1]}`;

    if (!byConversation[convId]) {
      byConversation[convId] = [];
    }
    byConversation[convId].push(message.id);
  });

  return byConversation;
};

// Create normalized initial state
export const createInitialState = (): WhatsAppState => {
  const normalizedContacts = normalizeById(contacts);
  const normalizedMessages = normalizeById(messages);
  const normalizedConversations = normalizeById(conversations);
  const messagesByConversation = groupMessagesByConversation(messages);

  return {
    contacts: {
      ...normalizedContacts,
      archived: new Set(
        contacts
          .filter(
            (c): c is (typeof contacts)[0] => c.type === "ai" && c.archived
          )
          .map((c) => c.id)
      ),
    },
    messages: {
      ...normalizedMessages,
      byConversation: messagesByConversation,
      pending: [],
      failed: [],
    },
    conversations: {
      ...normalizedConversations,
      byId: normalizedConversations.byId as Record<string, Conversation>,
    },
    ui: {
      currentConversation: null as string | null,
      view: "chatList" as WhatsAppView,
      typing: {},
    },
    network: {
      isOnline: true,
      lastSyncTime: Date.now(),
      pendingSync: false,
    },
    isInitialized: true,
  };
};
