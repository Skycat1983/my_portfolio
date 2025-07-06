import type { WhatsAppState } from "@/store/contentState/whatsAppSlice";
import type {
  Contact,
  Conversation,
  DeliveryStatus,
  WhatsAppView,
} from "./types";
import {
  BILLGATES,
  ELONMUSK,
  EMILY,
  ME,
  SCAM,
  TIMCOOK,
  WORK,
} from "@/constants/images";
const AI_CONTACTS = [
  {
    id: "ai_emily",
    type: "ai" as const,
    name: "Emily",
    avatar: EMILY,
    phoneNumber: "+1 (555) 0123",
    systemInstruction:
      "You are Emily, former co-worker and friend of the user at Code Academy Berlin. You've been asked by the user to give feedback on their portfolio hub, and are impressed by the user's work, especially the Whatsapp app feature, which you have just found.",
    archived: false,
  },
  {
    id: "ai_tim",
    type: "ai" as const,
    name: "Tim Cook",
    avatar: TIMCOOK,
    phoneNumber: "+1 (555) 0124",
    systemInstruction:
      "You are Tim Cook, CEO of Apple. You're interested in hiring the user and speak professionally but enthusiastically about the opportunity to work together at Apple.",
    archived: false,
  },
  {
    id: "ai_elon",
    type: "ai" as const,
    name: "Elon Musk",
    avatar: ELONMUSK,
    phoneNumber: "+1 (555) 0125",
    systemInstruction:
      "You are Elon Musk. You're interested in hiring the user to work at X, and are also trying desperately hard to be friends with the user, but in a really cringe way. You're also a bit of a jerk and make up stories about your gaming accomplishments that are so farfetched that they are obviously untrue.",
    archived: true,
  },
  {
    id: "ai_bill",
    type: "ai" as const,
    name: "Bill",
    avatar: BILLGATES,
    phoneNumber: "+1 (555) 0126",
    systemInstruction:
      "You are Bill Gates. You're interested in hiring the user to work at Microsoft. You are aware they probably have other offers, and are trying to outbid the competition..",
    archived: false,
  },
  {
    id: "ai_work",
    type: "ai" as const,
    name: "Work",
    avatar: WORK,
    phoneNumber: "+49 (0)1512 8791278",
    systemInstruction:
      "You are the user's previous employer. You are sad that you had to let the user go, but it wasn't because of their performance. You were very happy with their work as web development mentor at Code Academy Berlin, and have nothing but good things to say about them. You wish them the best of luck in their future endeavours.",
    archived: false,
  },
  {
    id: "ai_scam",
    type: "ai" as const,
    name: "+1 (555) 0526",
    phoneNumber: "+1 (555) 0526",
    avatar: SCAM,
    systemInstruction:
      "You are a scammer. You are trying to get the user to send you money the offer of work, promising them a large sums of money for little work. However, ultimately you need their bank account details and passport details in order to proceed, and should invent increasingly obscure reasons for why you need them.",
    archived: true,
  },
  {
    id: "user_self",
    type: "user" as const,
    name: "Me",
    avatar: ME,
    phoneNumber: "+1 (555) 0125",
  },
] as const;

const USER_CONTACT = {
  id: "user_self",
  type: "user" as const,
  name: "Me",
  avatar: ME,
  phoneNumber: "+1 (555) 0125",
};

const CONTACTS = [...AI_CONTACTS, USER_CONTACT] as const;
type UserId = (typeof USER_CONTACT)["id"];
type AiId = (typeof AI_CONTACTS)[number]["id"];
type ConversationId = `${UserId}_${AiId}`;

interface WhatsAppConversation {
  id: ConversationId;
  participants: [UserId, AiId];
  messages: WhatsAppMessage[];
}

interface UserMessage {
  id: string;
  content: string;
  sender: UserId;
  receiver: AiId;
  timestamp: string;
  deliveryStatus: DeliveryStatus;
  type: "user";
}

interface AiMessage {
  id: string;
  content: string;
  sender: AiId;
  receiver: UserId;
  timestamp: string;
  deliveryStatus: DeliveryStatus;
  type: "ai";
}

type WhatsAppMessage = UserMessage | AiMessage;

// THEORYCRAFTING ABOVE ^^^

// Initial contacts data
const contacts = [
  {
    id: "ai_emily",
    type: "ai" as const,
    name: "Emily",
    avatar: EMILY,
    phoneNumber: "+1 (555) 0123",
    systemInstruction:
      "You are Emily, former co-worker and friend of the user at Code Academy Berlin. You've been asked by the user to give feedback on their portfolio hub, and are impressed by the user's work, especially the Whatsapp app feature, which you have just found.",
    archived: false,
  },
  {
    id: "ai_tim",
    type: "ai" as const,
    name: "Tim Cook",
    avatar: TIMCOOK,
    phoneNumber: "+1 (555) 0124",
    systemInstruction:
      "You are Tim Cook, CEO of Apple. You're interested in hiring the user and speak professionally but enthusiastically about the opportunity to work together at Apple.",
    archived: false,
  },
  {
    id: "ai_elon",
    type: "ai" as const,
    name: "Elon Musk",
    avatar: ELONMUSK,
    phoneNumber: "+1 (555) 0125",
    systemInstruction:
      "You are Elon Musk. You're interested in hiring the user to work at X, and are also trying desperately hard to be friends with the user, but in a really cringe way. You're also a bit of a jerk and make up stories about your gaming accomplishments that are so farfetched that they are obviously untrue.",
    archived: true,
  },
  {
    id: "ai_bill",
    type: "ai" as const,
    name: "Bill",
    avatar: BILLGATES,
    phoneNumber: "+1 (555) 0126",
    systemInstruction:
      "You are Bill Gates. You're interested in hiring the user to work at Microsoft. You are aware they probably have other offers, and are trying to outbid the competition..",
    archived: false,
  },
  {
    id: "ai_work",
    type: "ai" as const,
    name: "Work",
    avatar: WORK,
    phoneNumber: "+49 (0)1512 8791278",
    systemInstruction:
      "You are the user's previous employer. You are sad that you had to let the user go, but it wasn't because of their performance. You were very happy with their work as web development mentor at Code Academy Berlin, and have nothing but good things to say about them. You wish them the best of luck in their future endeavours.",
    archived: false,
  },
  {
    id: "ai_scam",
    type: "ai" as const,
    name: "+1 (555) 0526",
    phoneNumber: "+1 (555) 0526",
    avatar: SCAM,
    systemInstruction:
      "You are a scammer. You are trying to get the user to send you money the offer of work, promising them a large sums of money for little work. However, ultimately you need their bank account details and passport details in order to proceed, and should invent increasingly obscure reasons for why you need them.",
    archived: true,
  },
  {
    id: "user_self",
    type: "user" as const,
    name: "Me",
    avatar: ME,
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
  // Emily
  {
    id: "msg_1",
    content:
      "Hey Emily, sorry to bother you again, but would love a bit more feedback on my portfolio hub! I appreciate you are very busy and have left a little easter egg for you!",
    sender: "user_self",
    receiver: "ai_emily",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 24 hours ago
    deliveryStatus: "read" as const,
  },
  // Tim
  {
    id: "msg_2",
    content: "Hello Heron, this is Tim Cook from Apple",
    sender: "ai_tim",
    receiver: "user_self",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    deliveryStatus: "delivered" as const,
  },
  {
    id: "msg_3",
    content:
      "Sorry for cold calling like this, but I'd love to discuss an opportunity at Apple. Is there a good time to chat?",
    sender: "ai_tim",
    receiver: "user_self",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    deliveryStatus: "delivered" as const,
  },
  // Elon
  {
    id: "msg_4",
    content:
      "Hey Heron, this is Elon writing from my other phone. Don't think my messages are getting through to you?",
    sender: "ai_elon",
    receiver: "user_self",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    deliveryStatus: "delivered" as const,
  },
  // Bill
  {
    id: "msg_5",
    content: "Hello Heron, this is Bill Gates from Microsoft",
    sender: "ai_bill",
    receiver: "user_self",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    deliveryStatus: "delivered" as const,
  },
  {
    id: "msg_6",
    content: "But please, call me Bill",
    sender: "ai_bill",
    receiver: "user_self",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    deliveryStatus: "delivered" as const,
  },
  {
    id: "msg_7",
    content:
      "I hear you have been in contact with Tim- did you sign anything yet? If not, please hold off until we have had a chance to speak",
    sender: "ai_bill",
    receiver: "user_self",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    deliveryStatus: "delivered" as const,
  },
  // Work
  {
    id: "msg_8",
    content:
      "Hey Heron, it was great to have you working here during those 18 months. Keep in touch! Let us know if you need anything like references etc",
    sender: "ai_work",
    receiver: "user_self",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    deliveryStatus: "delivered" as const,
  },
  {
    id: "msg_9",
    content:
      "Hey, yea i'm sorry to be leaving! Had such a great time working with you all, and will definitely stop by for the after work drinks sometime soon. Thanks for everything!",
    sender: "user_self",
    receiver: "ai_work",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    deliveryStatus: "delivered" as const,
  },
  // Scam
  {
    id: "msg_10",
    content:
      "Dear sir, are you interested in earning $400 per hour? Answer YES to this message, and i will share with you the trick that made me $96,000 last month! ",
    sender: "ai_scam",
    receiver: "user_self",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    deliveryStatus: "delivered" as const,
  },
  // {
  //   id: "msg_4",
  //   content:
  //     "Hello, this is Elon Musk. I'd love to discuss an opportunity at Tesla",
  //   sender: "ai_elon",
  //   receiver: "user_self",
  //   timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  //   deliveryStatus: "delivered" as const,
  // },
  // {
  //   id: "msg_5",
  //   content: "Are you there?",
  //   sender: "ai_elon",
  //   receiver: "user_self",
  //   timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
  //   deliveryStatus: "delivered" as const,
  // },
] as const;

// Initial conversations data - using deterministic IDs
const conversationParticipants = [
  {
    participants: ["user_self", "ai_emily"] as const,
    lastSeenMessageId: "msg_2",
  },
  {
    participants: ["user_self", "ai_tim"] as const,
    lastSeenMessageId: null,
  },
  {
    participants: ["user_self", "ai_elon"] as const,
    lastSeenMessageId: "msg_5",
  },
  {
    participants: ["user_self", "ai_bill"] as const,
    lastSeenMessageId: "msg_7",
  },
  {
    participants: ["user_self", "ai_work"] as const,
    lastSeenMessageId: "msg_9",
  },
  {
    participants: ["user_self", "ai_scam"] as const,
    lastSeenMessageId: "msg_10",
  },
] as const;

// Utility function to generate deterministic conversation IDs
const createConversationId = (participantIds: readonly string[]): string => {
  // Always put user_self first, then sort others
  const userSelf = "user_self";
  const others = participantIds.filter((id) => id !== userSelf).sort();
  return [userSelf, ...others].join("_");
};

// Generate conversations with deterministic IDs
const conversations = conversationParticipants.map((conv) => ({
  id: createConversationId(conv.participants),
  participants: conv.participants,
  lastSeenMessageId: conv.lastSeenMessageId,
}));

// Helper function to normalize an array of items by ID

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
    const convId = createConversationId([message.sender, message.receiver]);

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
