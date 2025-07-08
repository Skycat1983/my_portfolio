import type { WhatsAppState } from "@/store/contentState/whatsAppSlice";
import type {
  ConversationId,
  DeliveryStatus,
  Message,
  MessageId,
} from "../types";

// Get sent AI messages (replaces selectPendingAIMessages)
// ! in use by useStaggeredMessageDelivery.ts
export const selectSentMessages = (state: WhatsAppState): Message[] => {
  return state.messages.allIds
    .map((id: MessageId) => state.messages.byId[id])
    .filter(
      (message: Message | undefined): message is Message =>
        !!message &&
        message.deliveryStatus === "sent" &&
        message.sender !== "user_self"
    );
};

// Get pending user messages (renamed from selectPendingUserMessages for clarity)
export const selectPendingMessages = (state: WhatsAppState): Message[] => {
  return state.messages.allIds
    .map((id: MessageId) => state.messages.byId[id])
    .filter(
      (message: Message | undefined): message is Message =>
        !!message &&
        message.deliveryStatus === "pending" &&
        message.sender === "user_self"
    );
};

// Get sent AI messages grouped by conversation (replaces selectPendingAIMessagesByConversation)
export const selectSentAIMessagesByConversation = (
  state: WhatsAppState
): Record<ConversationId, Message[]> => {
  const sentAIMessages = selectSentMessages(state);
  const grouped: Record<ConversationId, Message[]> = {};

  sentAIMessages.forEach((message) => {
    // For AI messages, the conversation ID is constructed from the AI sender and user receiver
    const conversationId = `user_self_${message.sender}`;

    if (!grouped[conversationId]) {
      grouped[conversationId] = [];
    }
    grouped[conversationId].push(message);
  });

  // Sort messages within each conversation by timestamp
  Object.keys(grouped).forEach((convId) => {
    grouped[convId].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  });

  return grouped;
};

// Get conversations that have sent AI messages
export const selectConversationsWithSentAIMessages = (
  state: WhatsAppState
): ConversationId[] => {
  return Object.keys(selectSentAIMessagesByConversation(state));
};

export const selectedConversationMessagesByStatus = (
  state: WhatsAppState,
  conversationId: ConversationId,
  status: DeliveryStatus
): Message[] => {
  const messageIds = state.messages.byConversation[conversationId] || [];
  return messageIds
    .map((id: MessageId) => state.messages.byId[id])
    .filter(
      (message: Message | undefined): message is Message =>
        !!message && message.deliveryStatus === status
    );
};

// export const selectPendingConversationMessages = (state: WhatsAppState, conversationId: ConversationId): Message[] => {
//   const messageIds = state.messages.byConversation[conversationId] || [];
//   return messageIds
//     .map((id: MessageId) => state.messages.byId[id])
//     .filter((message: Message | undefined): message is Message => !!message && message.deliveryStatus === "pending");
// };

//   export const selectPendingContactMessages = (state: WhatsAppState, contactId: ContactId): Message[] => {}

//! in use
export const selectUnreadMessageCount = (
  state: WhatsAppState,
  conversationId: ConversationId
): number => {
  const messageIds = state.messages.byConversation[conversationId] || [];

  // Only count AI messages (not from user) that are delivered but not yet read
  const unreadAIMessages = messageIds.filter((id: MessageId) => {
    const message = state.messages.byId[id];
    return (
      message &&
      message.sender !== "user_self" &&
      message.deliveryStatus === "delivered"
    );
  });

  console.log(
    "WhatsApp: selectUnreadCount unreadAIMessages for conversation",
    conversationId,
    unreadAIMessages.length
  );

  return unreadAIMessages.length;
};

// Get the last visible message for conversation previews
export const selectVisibleLastMessage = (
  state: WhatsAppState,
  conversationId: ConversationId
): Message | undefined => {
  const visibleMessages = selectVisibleConversationMessages(
    state,
    conversationId
  );
  return visibleMessages[visibleMessages.length - 1];
};

// Get visible messages in a conversation (excludes sent non-user messages)
// ! this is used to get messages which are not sent and not from the user
export const selectVisibleConversationMessages = (
  state: WhatsAppState,
  conversationId: ConversationId
): Message[] => {
  const messageIds = state.messages.byConversation[conversationId] || [];
  return messageIds
    .map((id: MessageId) => state.messages.byId[id])
    .filter((message: Message | undefined): message is Message => {
      if (!message) return false;
      // Show all user messages, but hide sent non-user messages
      if (message.sender === "user_self") return true;
      return message.deliveryStatus !== "sent";
    });
};

// Message Status Selectors
export const selectMessageStatus = (
  state: WhatsAppState,
  messageId: MessageId
): Message["deliveryStatus"] => {
  const message = state.messages.byId[messageId];
  if (!message) return "pending";

  return message.deliveryStatus;
};

// Get message status information for a conversation
export const selectConversationMessageStatus = (
  state: WhatsAppState,
  conversationId: ConversationId
) => {
  const allMessageIds = state.messages.byConversation[conversationId] || [];
  const messages = allMessageIds
    .map((id) => state.messages.byId[id])
    .filter(Boolean);

  const pendingCount = messages.filter(
    (msg) => msg.deliveryStatus === "pending"
  ).length;

  return {
    totalMessages: allMessageIds.length,
    pendingCount,
    hasPending: pendingCount > 0,
  };
};
