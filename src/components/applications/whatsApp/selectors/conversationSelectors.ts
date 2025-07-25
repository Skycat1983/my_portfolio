import type { WhatsAppState } from "@/store/contentState/whatsAppSlice";

import {
  isAIContact,
  type ContactId,
  type ConversationId,
  type Message,
  type MessageId,
} from "../types";
import {
  selectUnreadMessageCount,
  selectVisibleLastMessage,
} from "./messageSelectors";
import { selectIsTyping } from "./componentSelectors";

//! in use
export const sortConversationPreviewsByTime = <
  T extends { lastMessageTime: string }
>(
  previews: T[]
): T[] => {
  return previews.sort((a, b) => {
    // Sort by most recent message timestamp (newest first)
    if (!a.lastMessageTime && !b.lastMessageTime) return 0;
    if (!a.lastMessageTime) return 1;
    if (!b.lastMessageTime) return -1;
    return (
      new Date(b.lastMessageTime).getTime() -
      new Date(a.lastMessageTime).getTime()
    );
  });
};

// Computed Selectors
export const selectConversationPreview = (
  state: WhatsAppState,
  conversationId: ConversationId
) => {
  const conversation = state.conversations.byId[conversationId];
  if (!conversation) return null;

  const lastMessage = selectVisibleLastMessage(state, conversationId);
  const unreadCount = selectUnreadMessageCount(state, conversationId);
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
    aiContactId: aiContactId,
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

// Get delivered messages in a conversation (eligible for read marking)
export const selectDeliveredMessagesInConversation = (
  state: WhatsAppState,
  conversationId: ConversationId
): Message[] => {
  const messageIds = state.messages.byConversation[conversationId] || [];
  return messageIds
    .map((id: MessageId) => state.messages.byId[id])
    .filter((message: Message | undefined): message is Message => {
      if (!message) return false;
      return message.deliveryStatus === "delivered";
    });
};
