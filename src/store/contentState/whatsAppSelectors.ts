import type { WhatsAppState } from "./whatsAppSlice";
import type {
  Contact,
  Message,
  Conversation,
  AIContact,
  ConversationId,
  ContactId,
  MessageId,
} from "@/components/applications/whatsApp/types";
import { isAIContact } from "@/components/applications/whatsApp/types";
import type { ApplicationState } from "@/types/storeTypes";

// Contact Selectors
export const selectActiveContacts = (state: WhatsAppState): Contact[] => {
  const nonArchivedIds = state.contacts.allIds.filter(
    (id: ContactId) => !state.contacts.archived.has(id)
  );
  console.log("WhatsApp selectActiveContacts nonArchivedIds", nonArchivedIds);
  return nonArchivedIds
    .map((id: ContactId) => state.contacts.byId[id])
    .filter((contact: Contact | undefined): contact is Contact =>
      Boolean(contact)
    );
};

export const selectArchivedContacts = (
  state: ApplicationState
): AIContact[] => {
  const archivedIds = Array.from(state.whatsApp.contacts.archived);
  return archivedIds
    .map((id: ContactId) => state.whatsApp.contacts.byId[id])
    .filter(
      (contact: Contact | undefined): contact is AIContact =>
        !contact || isAIContact(contact)
    );
};

export const selectContact = (
  state: WhatsAppState,
  contactId: ContactId
): Contact | undefined => state.contacts.byId[contactId];

// Message Selectors
export const selectConversationMessages = (
  state: WhatsAppState,
  conversationId: ConversationId
): Message[] => {
  const messageIds = state.messages.byConversation[conversationId] || [];
  return messageIds
    .map((id: MessageId) => state.messages.byId[id])
    .filter((message: Message | undefined): message is Message => !!message);
};

export const selectConversationAvatars = (
  state: WhatsAppState,
  conversationId: ConversationId
): ContactId[] => {
  const conversation = state.conversations.byId[conversationId];
  return conversation?.participants || [];
};

export const selectConversationDetails = (
  state: WhatsAppState,
  conversationId: ConversationId
) => {
  const messages = selectConversationMessages(state, conversationId);
  // const participants = messages
  console.log("WhatsApp: getConversation messages", messages);
  return messages;
  // return state.conversations.byId[conversationId];
};

export const selectLastMessage = (
  state: WhatsAppState,
  conversationId: ConversationId
): Message | undefined => {
  const messageIds = state.messages.byConversation[conversationId] || [];
  const lastMessageId = messageIds[messageIds.length - 1];
  return lastMessageId ? state.messages.byId[lastMessageId] : undefined;
};

export const selectUnreadCount = (
  state: WhatsAppState,
  conversationId: ConversationId
): number => {
  const messageIds = state.messages.byConversation[conversationId] || [];
  const conversation = state.conversations.byId[conversationId];

  if (!conversation?.lastSeenMessageId) return messageIds.length;

  const lastSeenIndex = messageIds.indexOf(conversation.lastSeenMessageId);
  return lastSeenIndex === -1 ? 0 : messageIds.length - lastSeenIndex - 1;
};

// UI Selectors
export const selectCurrentConversation = (
  state: WhatsAppState
): ConversationId | null => state.ui.currentConversation;

export const selectCurrentConversationDetails = (
  state: WhatsAppState
): Conversation | undefined =>
  state.ui.currentConversation
    ? state.conversations.byId[state.ui.currentConversation]
    : undefined;

export const selectIsTyping = (
  state: WhatsAppState,
  conversationId: ConversationId
): boolean => !!state.ui.typing[conversationId];

export const selectView = (state: WhatsAppState): WhatsAppState["ui"]["view"] =>
  state.ui.view;

// Network Selectors
export const selectIsOnline = (state: WhatsAppState): boolean =>
  state.network.isOnline;

export const selectPendingMessages = (state: WhatsAppState): Message[] =>
  state.messages.pending
    .map((id: MessageId) => state.messages.byId[id])
    .filter((message: Message | undefined): message is Message => !!message);

export const selectFailedMessages = (state: WhatsAppState): Message[] =>
  state.messages.failed
    .map((id: MessageId) => state.messages.byId[id])
    .filter((message: Message | undefined): message is Message => !!message);

// Computed Selectors
export const selectConversationPreview = (
  state: WhatsAppState,
  conversationId: ConversationId
) => {
  const conversation = state.conversations.byId[conversationId];
  if (!conversation) return null;

  const lastMessage = selectLastMessage(state, conversationId);
  const unreadCount = selectUnreadCount(state, conversationId);
  const isTyping = selectIsTyping(state, conversationId);

  // Find the AI contact in the conversation
  const aiContactId = conversation.participants.find((id: ContactId) => {
    const contact = state.contacts.byId[id];
    return contact && isAIContact(contact);
  });

  const aiContact = aiContactId ? state.contacts.byId[aiContactId] : undefined;

  if (!aiContact || !isAIContact(aiContact)) return null;

  return {
    id: conversationId,
    name: aiContact.name,
    avatar: aiContact.avatar,
    systemInstruction: aiContact.systemInstruction,
    archived: aiContact.archived,
    lastMessage: lastMessage?.content || "",
    lastMessageTime: lastMessage?.timestamp || "",
    unreadCount,
    isTyping,
  };
};

// Message Status Selectors
export const selectMessageStatus = (
  state: WhatsAppState,
  messageId: MessageId
): Message["deliveryStatus"] => {
  const message = state.messages.byId[messageId];
  if (!message) return "failed";

  if (state.messages.failed.includes(messageId)) return "failed";
  if (state.messages.pending.includes(messageId)) return "pending";
  return message.deliveryStatus;
};

// Network Status Selectors
export const selectSyncStatus = (state: WhatsAppState) => ({
  isPending: state.network.pendingSync,
  lastSync: state.network.lastSyncTime,
});

// Get non-archived conversations
// ! in use
export const selectActiveConversations = (
  state: WhatsAppState
): ConversationId[] => {
  // Get all conversations where none of the participants are archived
  return state.conversations.allIds.filter((convId) => {
    const conversation = state.conversations.byId[convId];
    if (!conversation) return false;

    // Check if any participant is archived
    return !conversation.participants.some((participantId) =>
      state.contacts.archived.has(participantId)
    );
  });
};

// ! in use
export const selectArchivedConversations = (state: WhatsAppState) => {
  return state.conversations.allIds.filter((convId) => {
    const conversation = state.conversations.byId[convId];
    if (!conversation) return false;
    return conversation.participants.some((participantId) =>
      state.contacts.archived.has(participantId)
    );
  });
};

// Get all active conversation previews
export const selectActiveConversationPreviews = (state: WhatsAppState) => {
  const activeConversations = selectActiveConversations(state);
  return activeConversations
    .map((convId) => selectConversationPreview(state, convId))
    .filter(
      (preview): preview is NonNullable<typeof preview> => preview !== null
    );
};

export const selectArchivedConversationPreviews = (state: WhatsAppState) => {
  const archivedConversations = selectArchivedConversations(state);
  return archivedConversations
    .map((convId) => selectConversationPreview(state, convId))
    .filter(
      (preview): preview is NonNullable<typeof preview> => preview !== null
    );
};
