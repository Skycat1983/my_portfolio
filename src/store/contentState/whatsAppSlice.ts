import type { SetState, ApplicationState } from "@/types/storeTypes";
import type {
  Contact,
  Message,
  Conversation,
  DeliveryStatus,
  ContactId,
  MessageId,
  ConversationId,
  WhatsAppView,
  NormalizedCollection,
  AIContact,
  UserContact,
} from "@/components/applications/whatsApp/types";
import {
  isAIContact,
  isUserContact,
} from "@/components/applications/whatsApp/types";

export interface WhatsAppState {
  contacts: NormalizedCollection<Contact> & {
    archived: Set<ContactId>;
  };
  messages: NormalizedCollection<Message> & {
    byConversation: Record<ConversationId, MessageId[]>;
  };
  conversations: NormalizedCollection<Conversation>;
  ui: {
    // ! UNUSED
    currentConversation: ConversationId | null;
    // ! UNUSED
    view: WhatsAppView;
    typing: Record<ConversationId, boolean>;
  };
  network: {
    isOnline: boolean;
    lastSyncTime: number;
    pendingSync: boolean;
  };
  isInitialized: boolean;
}

export interface WhatsAppActions {
  // Contact actions
  addContact: (contact: Contact) => void;
  removeContact: (contactId: ContactId) => void;
  updateContact: (contactId: ContactId, updates: Partial<Contact>) => void;
  archiveContact: (contactId: ContactId) => void;
  unarchiveContact: (contactId: ContactId) => void;

  // Message actions
  addMessage: (conversationId: ConversationId, message: Message) => void;
  updateMessage: (messageId: MessageId, updates: Partial<Message>) => void;
  // removeMessage: (messageId: MessageId) => void;
  markMessageStatus: (messageId: MessageId, status: DeliveryStatus) => void;

  // Bulk message status actions
  changeMessageStatusInConversation: (
    conversationId: ConversationId,
    newStatus: DeliveryStatus,
    oldStatus?: DeliveryStatus
  ) => void;
  markPendingMessagesAsDelivered: () => void;
  markConversationMessagesAsRead: (conversationId: ConversationId) => void;

  // Conversation actions
  startConversation: (userId: ContactId, aiId: ContactId) => void;
  updateConversation: (
    conversationId: ConversationId,
    updates: Partial<Conversation>
  ) => void;
  markLastSeen: (conversationId: ConversationId, messageId: MessageId) => void;
  markConversationAsRead: (conversationId: ConversationId) => void;

  // UI actions
  setCurrentConversation: (conversationId: ConversationId | null) => void;
  // setView: (view: WhatsAppView) => void;
  setTyping: (conversationId: ConversationId, isTyping: boolean) => void;

  // Network actions
  setNetworkStatus: (isOnline: boolean) => void;
  setSyncStatus: (isPending: boolean) => void;

  initializeWhatsApp: (initialState: WhatsAppState) => void;
}

export type WhatsAppSlice = WhatsAppState & WhatsAppActions;

const initialState: WhatsAppState = {
  contacts: {
    byId: {},
    allIds: [],
    archived: new Set(),
  },
  messages: {
    byId: {},
    allIds: [],
    byConversation: {},
  },
  conversations: {
    byId: {},
    allIds: [],
  },
  ui: {
    currentConversation: null,
    view: "chatList",
    typing: {},
  },
  network: {
    isOnline: true,
    lastSyncTime: Date.now(),
    pendingSync: false,
  },
  isInitialized: false,
};

export const createWhatsAppSlice = (
  set: SetState<ApplicationState>
  // get: GetState<ApplicationState>
): WhatsAppSlice => {
  const slice = {
    ...initialState,

    // Contact actions
    addContact: (contact: Contact) =>
      set((state: ApplicationState) => ({
        whatsApp: {
          ...state.whatsApp,
          contacts: {
            ...state.whatsApp.contacts,
            byId: {
              ...state.whatsApp.contacts.byId,
              [contact.id]: contact,
            },
            allIds: [...state.whatsApp.contacts.allIds, contact.id],
          },
        },
      })),

    removeContact: (contactId: ContactId) =>
      set((state: ApplicationState) => {
        const remainingContacts = Object.fromEntries(
          Object.entries(state.whatsApp.contacts.byId).filter(
            ([id]) => id !== contactId
          )
        );
        return {
          whatsApp: {
            ...state.whatsApp,
            contacts: {
              ...state.whatsApp.contacts,
              byId: remainingContacts,
              allIds: state.whatsApp.contacts.allIds.filter(
                (id) => id !== contactId
              ),
              archived: new Set(
                [...state.whatsApp.contacts.archived].filter(
                  (id) => id !== contactId
                )
              ),
            },
          },
        };
      }),

    updateContact: (contactId: ContactId, updates: Partial<Contact>) =>
      set((state: ApplicationState) => {
        const oldContact = state.whatsApp.contacts.byId[contactId];
        if (!oldContact) return {};

        let updatedContact: Contact;
        if (isAIContact(oldContact)) {
          updatedContact = {
            ...oldContact,
            ...updates,
            type: "ai" as const,
            id: contactId,
          } as AIContact;
        } else if (isUserContact(oldContact)) {
          updatedContact = {
            ...oldContact,
            ...updates,
            type: "user" as const,
            id: contactId,
          } as UserContact;
        } else {
          return {};
        }

        return {
          whatsApp: {
            ...state.whatsApp,
            contacts: {
              ...state.whatsApp.contacts,
              byId: {
                ...state.whatsApp.contacts.byId,
                [contactId]: updatedContact,
              },
            },
          },
        };
      }),

    archiveContact: (contactId: ContactId) =>
      set((state: ApplicationState) => {
        const contact = state.whatsApp.contacts.byId[contactId];
        if (!contact || !isAIContact(contact)) return {};

        return {
          whatsApp: {
            ...state.whatsApp,
            contacts: {
              ...state.whatsApp.contacts,
              archived: new Set([
                ...state.whatsApp.contacts.archived,
                contactId,
              ]),
            },
          },
        };
      }),

    unarchiveContact: (contactId: ContactId) =>
      set((state: ApplicationState) => {
        const contact = state.whatsApp.contacts.byId[contactId];
        if (!contact || !isAIContact(contact)) return {};

        const newArchived = new Set(state.whatsApp.contacts.archived);
        newArchived.delete(contactId);

        return {
          whatsApp: {
            ...state.whatsApp,
            contacts: {
              ...state.whatsApp.contacts,
              archived: newArchived,
            },
          },
        };
      }),

    // Message actions
    addMessage: (conversationId: ConversationId, message: Message) =>
      set((state: ApplicationState) => ({
        whatsApp: {
          ...state.whatsApp,
          messages: {
            ...state.whatsApp.messages,
            byId: {
              ...state.whatsApp.messages.byId,
              [message.id]: message,
            },
            allIds: [...state.whatsApp.messages.allIds, message.id],
            byConversation: {
              ...state.whatsApp.messages.byConversation,
              [conversationId]: [
                ...(state.whatsApp.messages.byConversation[conversationId] ||
                  []),
                message.id,
              ],
            },
          },
        },
      })),

    updateMessage: (messageId: MessageId, updates: Partial<Message>) =>
      set((state: ApplicationState) => {
        const message = state.whatsApp.messages.byId[messageId];
        if (!message) return {};

        return {
          whatsApp: {
            ...state.whatsApp,
            messages: {
              ...state.whatsApp.messages,
              byId: {
                ...state.whatsApp.messages.byId,
                [messageId]: { ...message, ...updates },
              },
            },
          },
        };
      }),

    markMessageStatus: (messageId: MessageId, status: DeliveryStatus) =>
      set((state: ApplicationState) => {
        const message = state.whatsApp.messages.byId[messageId];
        if (!message) return {};

        return {
          whatsApp: {
            ...state.whatsApp,
            messages: {
              ...state.whatsApp.messages,
              byId: {
                ...state.whatsApp.messages.byId,
                [messageId]: { ...message, deliveryStatus: status },
              },
            },
          },
        };
      }),

    // Bulk message status actions
    changeMessageStatusInConversation: (
      conversationId: ConversationId,
      newStatus: DeliveryStatus,
      oldStatus?: DeliveryStatus
    ) =>
      set((state: ApplicationState) => {
        const messageIds =
          state.whatsApp.messages.byConversation[conversationId] || [];
        if (messageIds.length === 0) return {};

        const updatedById = { ...state.whatsApp.messages.byId };
        let hasChanges = false;

        // Update messages in this conversation to the new status
        messageIds.forEach((messageId: MessageId) => {
          const message = updatedById[messageId];
          if (
            message &&
            (oldStatus === undefined || message.deliveryStatus === oldStatus)
          ) {
            updatedById[messageId] = {
              ...message,
              deliveryStatus: newStatus,
            };
            hasChanges = true;
          }
        });

        if (!hasChanges) return {};

        return {
          whatsApp: {
            ...state.whatsApp,
            messages: {
              ...state.whatsApp.messages,
              byId: updatedById,
            },
          },
        };
      }),

    markPendingMessagesAsDelivered: () =>
      set((state: ApplicationState) => {
        const updatedById = { ...state.whatsApp.messages.byId };
        let hasChanges = false;

        // Update all pending messages to delivered status
        Object.keys(updatedById).forEach((messageId: MessageId) => {
          const message = updatedById[messageId];
          if (message && message.deliveryStatus === "pending") {
            updatedById[messageId] = {
              ...message,
              deliveryStatus: "delivered",
            };
            hasChanges = true;
          }
        });

        if (!hasChanges) return {};

        return {
          whatsApp: {
            ...state.whatsApp,
            messages: {
              ...state.whatsApp.messages,
              byId: updatedById,
            },
          },
        };
      }),

    markConversationMessagesAsRead: (conversationId: ConversationId) =>
      set((state: ApplicationState) => {
        const messageIds =
          state.whatsApp.messages.byConversation[conversationId] || [];
        if (messageIds.length === 0) return {};

        const updatedById = { ...state.whatsApp.messages.byId };
        let hasChanges = false;

        // Update all delivered messages in this conversation to read status
        messageIds.forEach((messageId) => {
          const message = updatedById[messageId];
          if (message && message.deliveryStatus === "delivered") {
            updatedById[messageId] = {
              ...message,
              deliveryStatus: "read",
            };
            hasChanges = true;
          }
        });

        if (!hasChanges) return {};

        return {
          whatsApp: {
            ...state.whatsApp,
            messages: {
              ...state.whatsApp.messages,
              byId: updatedById,
            },
          },
        };
      }),

    // Conversation actions
    startConversation: (userId: ContactId, aiId: ContactId) =>
      set((state: ApplicationState) => {
        const conversationId = `conv_${userId}_${aiId}`;
        return {
          whatsApp: {
            ...state.whatsApp,
            conversations: {
              ...state.whatsApp.conversations,
              byId: {
                ...state.whatsApp.conversations.byId,
                [conversationId]: {
                  id: conversationId,
                  participants: [userId, aiId],
                  lastSeenMessageId: null,
                },
              },
              allIds: [...state.whatsApp.conversations.allIds, conversationId],
            },
          },
        };
      }),

    updateConversation: (
      conversationId: ConversationId,
      updates: Partial<Conversation>
    ) =>
      set((state: ApplicationState) => {
        const conversation = state.whatsApp.conversations.byId[conversationId];
        if (!conversation) return {};

        return {
          whatsApp: {
            ...state.whatsApp,
            conversations: {
              ...state.whatsApp.conversations,
              byId: {
                ...state.whatsApp.conversations.byId,
                [conversationId]: { ...conversation, ...updates },
              },
            },
          },
        };
      }),

    markLastSeen: (conversationId: ConversationId, messageId: MessageId) =>
      set((state: ApplicationState) => {
        const conversation = state.whatsApp.conversations.byId[conversationId];
        if (!conversation) return {};

        return {
          whatsApp: {
            ...state.whatsApp,
            conversations: {
              ...state.whatsApp.conversations,
              byId: {
                ...state.whatsApp.conversations.byId,
                [conversationId]: {
                  ...conversation,
                  lastSeenMessageId: messageId,
                },
              },
            },
          },
        };
      }),

    markConversationAsRead: (conversationId: ConversationId) =>
      set((state: ApplicationState) => {
        const messageIds =
          state.whatsApp.messages.byConversation[conversationId] || [];
        const lastMessageId = messageIds[messageIds.length - 1];

        if (!lastMessageId) return {};

        const conversation = state.whatsApp.conversations.byId[conversationId];
        if (!conversation) return {};

        return {
          whatsApp: {
            ...state.whatsApp,
            conversations: {
              ...state.whatsApp.conversations,
              byId: {
                ...state.whatsApp.conversations.byId,
                [conversationId]: {
                  ...conversation,
                  lastSeenMessageId: lastMessageId,
                },
              },
            },
          },
        };
      }),

    // UI actions
    setCurrentConversation: (conversationId: ConversationId | null) =>
      set((state: ApplicationState) => ({
        whatsApp: {
          ...state.whatsApp,
          ui: {
            ...state.whatsApp.ui,
            currentConversation: conversationId,
          },
        },
      })),

    setTyping: (conversationId: ConversationId, isTyping: boolean) =>
      set((state: ApplicationState) => ({
        whatsApp: {
          ...state.whatsApp,
          ui: {
            ...state.whatsApp.ui,
            typing: {
              ...state.whatsApp.ui.typing,
              [conversationId]: isTyping,
            },
          },
        },
      })),

    // Network actions
    setNetworkStatus: (isOnline: boolean) =>
      set((state: ApplicationState) => ({
        whatsApp: {
          ...state.whatsApp,
          network: {
            ...state.whatsApp.network,
            isOnline,
          },
        },
      })),

    setSyncStatus: (isPending: boolean) =>
      set((state: ApplicationState) => ({
        whatsApp: {
          ...state.whatsApp,
          network: {
            ...state.whatsApp.network,
            pendingSync: isPending,
            lastSyncTime: isPending
              ? state.whatsApp.network.lastSyncTime
              : Date.now(),
          },
        },
      })),

    initializeWhatsApp: (initialState: WhatsAppState) => {
      set((state: ApplicationState) => {
        // Only initialize if not already initialized
        if (state.whatsApp.isInitialized) {
          console.log(
            "whatsAppState already initialized, skipping initialization"
          );
          return {};
        }

        console.log("Initializing whatsAppState with state:", initialState);
        return {
          whatsApp: {
            ...initialState,
            isInitialized: true,
          },
        };
      });
    },
  };

  return slice;
};
