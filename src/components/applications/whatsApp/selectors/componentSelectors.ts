import { selectConversationParticipant } from "./contactSelectors";
import type { WhatsAppState } from "@/store/contentState/whatsAppSlice";
import type { ConversationId } from "../types";
import {
  selectConversationPreview,
  sortConversationPreviewsByTime,
} from "./conversationSelectors";

// Get all data needed for conversation header
export const selectConversationHeader = (
  state: WhatsAppState,
  conversationId: ConversationId,
  wifiEnabled: boolean
) => {
  const participant = selectConversationParticipant(state, conversationId);
  const lastSeenTimestamp = selectLastSeenTimestamp(state);

  if (!participant) return null;

  // Format lastSeen timestamp for display
  const formatLastSeen = (timestamp: number): string => {
    const now = new Date();
    const lastSeen = new Date(timestamp);
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return lastSeen.toLocaleDateString();
  };

  return {
    id: conversationId,
    name: participant.name,
    avatar: participant.avatar,
    phoneNumber: participant.phoneNumber,
    isOnline: wifiEnabled,
    lastSeen: wifiEnabled
      ? "online"
      : `last seen ${formatLastSeen(lastSeenTimestamp)}`,
  };
};

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

export const selectArchivedConversationPreviews = (state: WhatsAppState) => {
  const archivedConversations = selectArchivedConversations(state);
  const previews = archivedConversations
    .map((convId) => selectConversationPreview(state, convId))
    .filter(
      (preview): preview is NonNullable<typeof preview> => preview !== null
    );

  return sortConversationPreviewsByTime(previews);
};

export const selectLastSeenTimestamp = (state: WhatsAppState): number =>
  state.network.lastSeenTimestamp;

export const selectIsTyping = (
  state: WhatsAppState,
  conversationId: ConversationId
): boolean => !!state.ui.typing[conversationId];
