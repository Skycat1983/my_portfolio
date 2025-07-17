import { selectConversationParticipant } from "./contactSelectors";
import type { WhatsAppState } from "@/store/contentState/whatsAppSlice";
import type { ConversationId } from "../types";
import { sortConversationPreviewsByTime } from "./conversationSelectors";
import { selectMessagesByConversation } from "./messageSelectors";

// * in use
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

// * in use
export const selectArchivedConversations = (state: WhatsAppState) => {
  return state.conversations.allIds.filter((convId) => {
    const conversation = state.conversations.byId[convId];
    if (!conversation) return false;
    return conversation.participants.some((participantId) =>
      state.contacts.archived.has(participantId)
    );
  });
};

// export const selectLastSeenTimestamp = (state: WhatsAppState): number =>
//   state.network.lastSeenTimestamp;

export const selectIsTyping = (
  state: WhatsAppState,
  conversationId: ConversationId
): boolean => !!state.ui.typing[conversationId];

// export const searchConversationByQuery = (state)

//* NEW
export const selectChatlistPreviews = (
  state: WhatsAppState,
  archived: boolean
) => {
  // 1. select conversations
  const conversations = archived
    ? selectArchivedConversations(state)
    : selectActiveConversations(state);

  console.log("WhatsAppRework: ChatList conversations", conversations);

  // 2. Build preview data for each conversation
  const previews = conversations.map((convId) => {
    // all messages in the conversation
    const messages = selectMessagesByConversation(state, convId);

    // filter out 'sent' messages
    const visibleMessages = messages.filter(
      (message) => message.deliveryStatus !== "sent"
    );

    const unreadCount = visibleMessages.filter(
      (message) =>
        message.deliveryStatus === "delivered" && message.sender !== "user_self"
    ).length;

    const participant = selectConversationParticipant(state, convId);

    // Get the contact ID for unarchiving (the non-user participant)
    const conversation = state.conversations.byId[convId];
    const contactId = conversation?.participants.find(
      (id) => id !== "user_self"
    );

    return {
      id: convId,
      contactId: contactId, // Add contact ID for unarchiving
      messages: visibleMessages,
      unreadCount,
      name: participant?.name,
      avatar: participant?.avatar,
      lastMessage: visibleMessages[visibleMessages.length - 1],
      lastMessageTime: visibleMessages[visibleMessages.length - 1].timestamp,
      // TODO: Add other preview properties here
      isTyping: selectIsTyping(state, convId),
    };
  });

  console.log("WhatsAppRework: ChatList previews", previews);

  const sortedPreviews = sortConversationPreviewsByTime(previews);

  return sortedPreviews;
};
