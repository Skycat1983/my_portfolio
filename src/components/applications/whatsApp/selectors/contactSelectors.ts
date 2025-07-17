import type { ApplicationState } from "@/types/storeTypes";
import {
  isAIContact,
  type AIContact,
  type Contact,
  type ContactId,
  type ConversationId,
} from "../types";
import type { WhatsAppState } from "@/store/contentState/whatsAppSlice";

// Get the non-user participant in a conversation
export const selectConversationParticipant = (
  state: WhatsAppState,
  conversationId: ConversationId
): Contact | undefined => {
  const conversation = state.conversations.byId[conversationId];
  if (!conversation) return undefined;

  // Find the participant who is not the user
  const otherParticipantId = conversation.participants.find(
    (id: ContactId) => id !== "user_self"
  );

  return otherParticipantId
    ? state.contacts.byId[otherParticipantId]
    : undefined;
};

export const selectContact = (
  state: WhatsAppState,
  contactId: ContactId
): Contact | undefined => state.contacts.byId[contactId];

// Contact Selectors
export const selectActiveContacts = (state: WhatsAppState): Contact[] => {
  const nonArchivedIds = state.contacts.allIds.filter(
    (id: ContactId) => !state.contacts.archived.has(id)
  );
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
