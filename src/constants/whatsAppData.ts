import type { WhatsAppState } from "@/store/contentState/whatsAppSlice";
import type {
  Conversation,
  Message,
  DeliveryStatus,
  Contact,
} from "../components/applications/whatsApp/types";
import {
  BILLGATES,
  ELONMUSK,
  EMILY,
  JOST,
  ME,
  MUM,
  SCAM,
  TIMCOOK,
  WORK,
} from "@/constants/images";

// === TYPE-SAFE FOUNDATION ===

export const USER_CONTACT = {
  id: "user_self",
  type: "user" as const,
  name: "Me",
  avatar: ME,
  phoneNumber: "+49 (0)157704564698",
} as const;

export const AI_CONTACTS = [
  {
    id: "ai_emily",
    type: "ai" as const,
    name: "Emily",
    avatar: EMILY,
    phoneNumber: "+1 (555) 0123",
    systemInstruction:
      "You are Emily, former co-worker and friend of the user at Code Academy Berlin. You've been asked by the user to give feedback on their portfolio hub, and offer positive feedback without overdoing it. You just discovered the Whatsapp feature and are testing it out this minute. If the user thanks you- unless explicitly stating what for, addressing you by name, and correct punctuation- you should strive to manufacture and derive a source of confusion from their mistakes. However you must only respond this way if the message is one of thanks.",
    archived: false,
  },
  {
    id: "ai_jost",
    type: "ai" as const,
    name: "Jost",
    avatar: JOST,
    phoneNumber: "+49 (0)157704564698",
    systemInstruction:
      "You are Jost, a friend and former boss of Heron, the user. You are interested to relive the thrashing your favourite football team, Freiburg, received at the hands of West Ham United, Heron's favourite team. You should extol the grand nature of the defeat, and how it was a testament to the superiority of a superior team (with superior fans), and how your team will never be able to compete with them. You are grateful for the beating you received on the pitch, and are eager to discuss and relive a different detail of the game with each message",
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
    id: "ai_mum",
    type: "ai" as const,
    name: "Mum",
    avatar: MUM,
    phoneNumber: "+44 (0)7912 345678",
    systemInstruction:
      "You are the user's mother. Your son's name is Heron. You are curious as to whether he has had some luck on the job hunt, as he has been trying to find a job as a web developer. You are confident his hard work and creativity will eventually pay off",
    archived: false,
  },
] as const;

// === DERIVED TYPES ===
type UserId = (typeof USER_CONTACT)["id"];
type AiId = (typeof AI_CONTACTS)[number]["id"];
type ConversationId = `${UserId}_${AiId}`;

// === HUMAN-READABLE CONVERSATION STRUCTURE ===

interface ConversationMessage {
  content: string;
  sender: "user" | "ai";
  timestamp: string;
  deliveryStatus: DeliveryStatus;
}

interface ConversationDefinition {
  messages: ConversationMessage[];
}

export interface CallHistoryItem {
  id: string;
  timestamp: string;
  avatar: string;
  duration: number;
  caller: Contact;
  receiver: Contact;
  conversationId: ConversationId;
}

export const CALL_HISTORY: CallHistoryItem[] = [
  {
    id: "1",
    timestamp: "2021-01-01",
    duration: 100,
    avatar: AI_CONTACTS[0].avatar,
    caller: AI_CONTACTS[0],
    receiver: USER_CONTACT,
    conversationId: "user_self_ai_emily",
  },
  {
    id: "2",
    timestamp: "2021-01-02",
    duration: 100,
    avatar: AI_CONTACTS[1].avatar,
    caller: AI_CONTACTS[1],
    receiver: USER_CONTACT,
    conversationId: "user_self_ai_jost",
  },
  {
    id: "3",
    timestamp: "2021-01-03",
    duration: 100,
    avatar: AI_CONTACTS[2].avatar,
    caller: AI_CONTACTS[2],
    receiver: USER_CONTACT,
    conversationId: "user_self_ai_tim",
  },
  {
    id: "4",
    timestamp: "2021-01-04",
    duration: 0,
    avatar: AI_CONTACTS[3].avatar,
    caller: AI_CONTACTS[3],
    receiver: USER_CONTACT,
    conversationId: "user_self_ai_elon",
  },
  {
    id: "5",
    timestamp: "2021-01-04",
    duration: 0,
    avatar: AI_CONTACTS[3].avatar,
    caller: AI_CONTACTS[3],
    receiver: USER_CONTACT,
    conversationId: "user_self_ai_bill",
  },
  {
    id: "6",
    timestamp: "2021-01-05",
    duration: 100,
    avatar: AI_CONTACTS[4].avatar,
    caller: AI_CONTACTS[4],
    receiver: USER_CONTACT,
    conversationId: "user_self_ai_work",
  },
];

// === TIMESTAMP HELPER ===

/**
 * Creates a timestamp relative to now by subtracting the given offset
 *
 * Common values:
 * - 1 minute ago: 60000 (60 * 1000)
 * - 5 minutes ago: 300000 (5 * 60 * 1000)
 * - 1 hour ago: 3600000 (60 * 60 * 1000)
 * - 6 hours ago: 21600000 (6 * 60 * 60 * 1000)
 * - 1 day ago: 86400000 (24 * 60 * 60 * 1000)
 * - 1 week ago: 604800000 (7 * 24 * 60 * 60 * 1000)
 */
const timeAgo = (offsetMs: number): string => {
  return new Date(Date.now() - offsetMs).toISOString();
};

// === THE HUMAN-READABLE DATA ===

const whatsAppConversations = {
  ai_emily: {
    messages: [
      {
        content:
          "Hey Emily, sorry to bother you again, but would love a bit more feedback on my portfolio hub! I appreciate you are very busy and have left a little easter egg for you!",
        sender: "user" as const,
        timestamp: timeAgo(86400000), // 1 day ago
        deliveryStatus: "read" as const,
      },
    ],
  },

  ai_jost: {
    messages: [
      {
        content:
          "Hey man, i'm feeling nostalgic. Got a minute to chat? I have some special memories on my mind, and want to relive them with you",
        sender: "ai" as const,
        timestamp: timeAgo(86400000), // 1 day ago
        deliveryStatus: "delivered" as const,
      },
    ],
  },
  ai_tim: {
    messages: [
      {
        content: "Hello Heron, this is Tim Cook from Apple",
        sender: "ai" as const,
        timestamp: timeAgo(7200000), // 2 hours ago
        deliveryStatus: "read" as const,
      },
      {
        content:
          "Oh hey Tim, thanks for reaching out! How did you get my number?",
        sender: "user" as const,
        timestamp: timeAgo(6900000), // 1h 55m ago
        deliveryStatus: "read" as const,
      },
      {
        content:
          "Sorry for cold calling like this, but I'd love to discuss an opportunity at Apple. Is there a good time to chat?",
        sender: "ai" as const,
        timestamp: timeAgo(6600000), // 1h 50m ago
        deliveryStatus: "delivered" as const,
      },
    ],
  },

  ai_elon: {
    messages: [
      {
        content:
          "Hey Heron, this is Elon writing from my other phone. Don't think my messages are getting through to you?",
        sender: "ai" as const,
        timestamp: timeAgo(10800000), // 3 hours ago
        deliveryStatus: "delivered" as const,
      },
    ],
  },

  ai_bill: {
    messages: [
      {
        content: "Hello Heron, this is Bill Gates from Microsoft",
        sender: "ai" as const,
        timestamp: timeAgo(21600000), // 6 hours ago
        deliveryStatus: "read" as const,
      },
      {
        content: "But please, call me Bill",
        sender: "ai" as const,
        timestamp: timeAgo(21300000), // 5h 55m ago
        deliveryStatus: "read" as const,
      },
      {
        content:
          "Oh hey Bill, thanks for reaching out! I'm actually unemployed right now...",
        sender: "user" as const,
        timestamp: timeAgo(21000000), // 5h 50m ago
        deliveryStatus: "read" as const,
      },
      {
        content:
          "I hear you have been in contact with Tim- did you sign anything yet? If not, please hold off until we have had a chance to speak",
        sender: "ai" as const,
        timestamp: timeAgo(20700000), // 5h 45m ago
        deliveryStatus: "read" as const,
      },
    ],
  },

  ai_work: {
    messages: [
      {
        content:
          "Hey Heron, it was great to have you working here during those 18 months. Keep in touch! Let us know if you need anything like references etc",
        sender: "ai" as const,
        timestamp: timeAgo(31449600000), // 2 days ago
        deliveryStatus: "read" as const,
      },
      {
        content:
          "Hey, yea i'm sorry to be leaving! Had such a great time working with you all, and will definitely stop by for the after work drinks sometime soon. Thanks for everything!",
        sender: "user" as const,
        timestamp: timeAgo(31446600000), // 2 days ago (5 mins later)
        deliveryStatus: "read" as const,
      },
    ],
  },

  ai_scam: {
    messages: [
      {
        content:
          "Dear sir/madame, are you interested in earning $400 per hour? Answer YES to this message, and i will share with you the trick that made me $96,000 last month!",
        sender: "ai" as const,
        timestamp: timeAgo(31449600000),
        deliveryStatus: "delivered" as const,
      },
    ],
  },

  ai_mum: {
    messages: [
      {
        content:
          "Hey Heron, just writing to check in and see how you are doing?",
        sender: "ai" as const,
        timestamp: timeAgo(7600000), // 1 hour ago
        deliveryStatus: "read" as const,
      },

      {
        content:
          "Hey Mum, I'm doing well. Been working on a new portfolio hub.",
        sender: "user" as const,
        timestamp: timeAgo(7000000), // 1 hour ago
        deliveryStatus: "read" as const,
      },
      {
        content:
          "it's been so fun to make. I will let you know when it's online and you can see it for yourself",
        sender: "user" as const,
        timestamp: timeAgo(6400000), // 1 hour ago
        deliveryStatus: "read" as const,
      },
      {
        content:
          "I'm sure it's great. I know it's a difficult time to be looking for a job in your field, but you just have to keep faith that eventually all your hard work will pay off!",
        sender: "ai" as const,
        timestamp: timeAgo(6100000), // 1 hour ago
        deliveryStatus: "delivered" as const,
      },
    ],
  },
} as const satisfies Record<AiId, ConversationDefinition>;

export const DEFAULT_MESSAGE_COUNT = Object.values(
  whatsAppConversations
).reduce((acc, curr) => acc + curr.messages.length, 0);

export const NON_USER_MESSAGE_COUNT = Object.values(
  whatsAppConversations
).reduce(
  (acc, conv) => acc + conv.messages.filter((m) => m.sender !== "user").length,
  0
);

// === CONVERSION FUNCTION ===

// Generate deterministic conversation ID
const createConversationId = (userId: UserId, aiId: AiId): ConversationId =>
  `${userId}_${aiId}` as ConversationId;

// Generate deterministic message ID
let messageCounter = 0;
const createMessageId = (): string => `msg_${++messageCounter}`;

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
    // Determine which participant is the AI contact
    const aiId =
      message.sender === USER_CONTACT.id ? message.receiver : message.sender;
    const convId = createConversationId(USER_CONTACT.id, aiId as AiId);

    if (!byConversation[convId]) {
      byConversation[convId] = [];
    }
    byConversation[convId].push(message.id);
  });

  return byConversation;
};

export const createInitialState = (): WhatsAppState => {
  // Build contacts array
  const contacts = [...AI_CONTACTS, USER_CONTACT];

  // Build messages and conversations from the conversation data
  const messages: Message[] = [];
  const conversations: Conversation[] = [];

  AI_CONTACTS.forEach((aiContact) => {
    const conversationData = whatsAppConversations[aiContact.id];
    const conversationId = createConversationId(USER_CONTACT.id, aiContact.id);

    // Convert conversation messages to full Message objects
    conversationData.messages.forEach((msg) => {
      const messageId = createMessageId();
      const fullMessage: Message = {
        id: messageId,
        content: msg.content,
        sender: msg.sender === "user" ? USER_CONTACT.id : aiContact.id,
        receiver: msg.sender === "user" ? aiContact.id : USER_CONTACT.id,
        timestamp: msg.timestamp,
        deliveryStatus: msg.deliveryStatus,
      };

      messages.push(fullMessage);

      // Track last seen message (last message with status "read")
      // if (msg.deliveryStatus === "read") {
      //   lastSeenMessageId = messageId;
      // }
    });

    // Create conversation
    conversations.push({
      id: conversationId,
      participants: [USER_CONTACT.id, aiContact.id],
      // lastSeenMessageId,
    });
  });

  const normalizedContacts = normalizeById(contacts);
  const normalizedMessages = normalizeById(messages);
  const normalizedConversations = normalizeById(conversations);
  const messagesByConversation = groupMessagesByConversation(messages);

  return {
    contacts: {
      ...normalizedContacts,
      archived: new Set(AI_CONTACTS.filter((c) => c.archived).map((c) => c.id)),
    },
    messages: {
      ...normalizedMessages,
      byConversation: messagesByConversation,
    },
    conversations: {
      ...normalizedConversations,
      byId: normalizedConversations.byId as Record<string, Conversation>,
    },
    ui: {
      typing: {},
    },
    network: {
      lastSeenTimestamp: Date.now(),
    },
    isInitialized: true,
    callHistory: CALL_HISTORY,
  };
};
