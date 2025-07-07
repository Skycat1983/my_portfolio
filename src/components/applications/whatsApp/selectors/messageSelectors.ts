import type { WhatsAppState } from "@/store/contentState/whatsAppSlice";
import type {
  ConversationId,
  DeliveryStatus,
  Message,
  MessageId,
} from "../types";

// Get pending AI messages
// ! in use by useStaggeredMessageDelivery.ts
export const selectPendingAIMessages = (state: WhatsAppState): Message[] => {
  return state.messages.allIds
    .map((id: MessageId) => state.messages.byId[id])
    .filter(
      (message: Message | undefined): message is Message =>
        !!message &&
        message.deliveryStatus === "pending" &&
        message.sender !== "user_self"
    );
};

// Get pending messages by sender type
export const selectPendingUserMessages = (state: WhatsAppState): Message[] => {
  return state.messages.allIds
    .map((id: MessageId) => state.messages.byId[id])
    .filter(
      (message: Message | undefined): message is Message =>
        !!message &&
        message.deliveryStatus === "pending" &&
        message.sender === "user_self"
    );
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

  // Only count AI messages (not from user) that are delivered (visible to user)
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

// Get visible messages in a conversation (excludes pending non-user messages)
// ! this is used to get messages which are not pending and not from the user
export const selectVisibleConversationMessages = (
  state: WhatsAppState,
  conversationId: ConversationId
): Message[] => {
  const messageIds = state.messages.byConversation[conversationId] || [];
  return messageIds
    .map((id: MessageId) => state.messages.byId[id])
    .filter((message: Message | undefined): message is Message => {
      if (!message) return false;
      // Show all user messages, but hide pending non-user messages
      if (message.sender === "user_self") return true;
      return message.deliveryStatus !== "pending";
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

// // Message Selectors
// export const selectConversationMessages = (
//   state: WhatsAppState,
//   conversationId: ConversationId
// ): Message[] => {
//   const messageIds = state.messages.byConversation[conversationId] || [];
//   return messageIds
//     .map((id: MessageId) => state.messages.byId[id])
//     .filter((message: Message | undefined): message is Message => !!message);
// };

// // ? not in use?
// export const selectLastMessage = (
//   state: WhatsAppState,
//   conversationId: ConversationId
// ): Message | undefined => {
//   const messageIds = state.messages.byConversation[conversationId] || [];
//   const lastMessageId = messageIds[messageIds.length - 1];
//   return lastMessageId ? state.messages.byId[lastMessageId] : undefined;
// };
// Get all pending message IDs (for bulk operations)
// export const selectPendingMessageIds = (state: WhatsAppState): MessageId[] => {
//   return state.messages.allIds.filter((id: MessageId) => {
//     const message = state.messages.byId[id];
//     return message && message.deliveryStatus === "pending";
//   });
// };
// export const selectPendingMessagesInConversation = (
//   state: WhatsAppState,
//   conversationId: ConversationId
// ): Message[] => {
//   const messageIds = state.messages.byConversation[conversationId] || [];
//   return messageIds
//     .map((id: MessageId) => state.messages.byId[id])
//     .filter(
//       (message: Message | undefined): message is Message =>
//         !!message && message.deliveryStatus === "pending"
//     );
// };

// export const selectConversationsWithPendingMessages = (
//   state: WhatsAppState
// ): ConversationId[] => {
//   return state.conversations.allIds.filter((convId) => {
//     return selectPendingMessagesInConversation(state, convId).length > 0;
//   });
// };
