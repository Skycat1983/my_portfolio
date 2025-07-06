import React, { useState, useRef, useEffect } from "react";
import type { ContactId } from "./types";
import { MessageComponent } from "./MessageComponent";
import { TypingIndicator } from "./TypingIndicator";
import { buildSystemInstruction } from "./utils";
import { useNewStore } from "@/hooks/useStore";
import {
  selectConversationMessages,
  selectIsTyping,
  selectConversationParticipant,
  selectCanSendMessage,
} from "@/store/contentState/whatsAppSelectors";
import { createMessage, processAIResponse } from "./messageUtils";
import { Send } from "lucide-react";
import { ConversationHeader } from "./ConversationHeader";
import type { ViewState } from "./hooks/useWhatsAppHistory";
import type { WindowType } from "@/types/storeTypes";

interface ChatScreenProps {
  conversationId: ContactId;
  onBack: () => void;
  onArchive: (contactId: ContactId) => void;
  onUnarchive: (contactId: ContactId) => void;
  onViewProfile?: (contactId: ContactId) => void;
  windowId: WindowType["windowId"];
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  conversationId,
  onBack,
  onArchive,
  onUnarchive,
  onViewProfile,
  windowId,
}) => {
  console.log("WhatsApp: ChatScreen conversationId", conversationId);
  const whatsApp = useNewStore((state) => state.whatsApp);
  const historyId = `whatsapp-${windowId}`;
  const whatsAppHistory = useNewStore((state) => state.getHistory(historyId));
  // console.log("WhatsApp: useWhatsAppHistory getHistory", whatsAppHistory);
  const index = whatsAppHistory?.currentIndex;
  const whatsAppView = whatsAppHistory?.items[index ?? 0] as
    | ViewState
    | undefined;

  const isOnChatView = whatsAppView?.view === "chat";
  const isViewingThisConversation =
    whatsAppView?.params?.conversationId === conversationId;
  const isActiveConversation = isOnChatView && isViewingThisConversation;

  // console.log("WhatsApp: ChatScreen whatsAppView", whatsAppView);
  // console.log(
  //   "WhatsApp: ChatScreen isActiveConversation",
  //   isActiveConversation
  // );

  // ! in use - Get conversation data using new selectors
  const messages = selectConversationMessages(whatsApp, conversationId);
  console.log("WhatsApp: ChatScreen messages", messages);
  const contact = selectConversationParticipant(whatsApp, conversationId);
  const contactId = contact?.id;
  console.log("WhatsApp: ChatScreen contact", contact);
  const isTyping = selectIsTyping(whatsApp, conversationId);
  const canSendMessage = selectCanSendMessage(whatsApp, conversationId);

  // Get actions from store
  const addMessage = useNewStore((state) => state.addMessage);
  const setTyping = useNewStore((state) => state.setTyping);

  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (
      !inputText.trim() ||
      !canSendMessage ||
      !contact ||
      contact.type !== "ai"
    )
      return;

    const userMessage = createMessage(
      inputText,
      "user_self",
      conversationId,
      "pending"
    );
    addMessage(conversationId, userMessage);
    setInputText("");
    setTyping(conversationId, true);

    try {
      const enhancedInstruction = buildSystemInstruction(
        contact.systemInstruction,
        messages
      );

      await processAIResponse(
        inputText,
        enhancedInstruction,
        (response) => {
          setTyping(conversationId, false);
          // Use isActiveConversation to determine if message should be marked as read
          const messageStatus = isActiveConversation ? "read" : "delivered";
          const botMessage = createMessage(
            response,
            conversationId,
            "user_self",
            messageStatus
          );
          addMessage(conversationId, botMessage);
        },
        () => {
          setTyping(conversationId, false);
          const errorMessage = createMessage(
            "Sorry, I had trouble responding. Please try again.",
            conversationId,
            "user_self",
            "failed"
          );
          addMessage(conversationId, errorMessage);
        }
      );
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      setTyping(conversationId, false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  // console.log("ChatScreen: contact", contact);
  // // console.log("ChatScreen: preview", preview);
  // if (!contact) return null;

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <ConversationHeader
        conversationId={conversationId}
        onBack={onBack}
        onArchive={onArchive}
        onUnarchive={onUnarchive}
        onViewProfile={
          onViewProfile ? () => onViewProfile(contactId ?? "") : undefined
        }
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-2 text-white">
        {messages.map((message) => (
          <MessageComponent key={message.id} message={message} />
        ))}

        {isTyping && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-gray-800 border-t border-gray-700 text-white">
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={
                canSendMessage ? "Type a message..." : "You are offline"
              }
              disabled={!canSendMessage}
              className="w-full max-h-32 p-3 pl-4 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={1}
              style={{
                minHeight: "48px",
                height: "auto",
              }}
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || !canSendMessage}
            className={`p-3 rounded-full ${
              inputText.trim() && canSendMessage
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            } transition-colors`}
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
