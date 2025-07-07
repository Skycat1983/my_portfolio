import React, { useState, useRef, useEffect } from "react";
import type { ContactId } from "./types";
import { MessageComponent } from "./MessageComponent";
import { TypingIndicator } from "./TypingIndicator";
import { buildSystemInstruction } from "./utils";
import { useNewStore } from "@/hooks/useStore";

import { createMessage, processAIResponse } from "./messageUtils";
import { Send, WifiOff } from "lucide-react";
import { ConversationHeader } from "./ConversationHeader";
import type { ViewState } from "./hooks/useWhatsAppHistory";
import type { WindowType } from "@/types/storeTypes";
import { selectVisibleConversationMessages } from "./selectors/messageSelectors";
import { selectConversationParticipant } from "./selectors/contactSelectors";
import { selectIsTyping } from "./selectors/componentSelectors";

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
  const whatsApp = useNewStore((state) => state.whatsApp);
  console.log("WhatsApp: ChatScreen whatsApp", whatsApp);
  const wifiEnabled = useNewStore((state) => state.wifiEnabled);
  const historyId = `whatsapp-${windowId}`;
  const whatsAppView = useNewStore((state) =>
    state.getCurrentItem(historyId)
  ) as ViewState | undefined;

  console.log("WhatsApp: ChatScreen whatsAppView", whatsAppView);

  const isViewingChat = whatsAppView?.view === "chat";
  const isViewingThisConversation =
    whatsAppView?.params?.conversationId === conversationId;
  const receivedMessageStatus =
    isViewingChat && isViewingThisConversation && wifiEnabled
      ? "read"
      : wifiEnabled
      ? "delivered"
      : "pending";

  // ! in use - Get conversation data using new visible message selectors
  const messages = selectVisibleConversationMessages(whatsApp, conversationId);
  console.log(
    "WhatsApp: ChatScreen selectVisibleConversationMessages",
    messages
  );
  const contact = selectConversationParticipant(whatsApp, conversationId);
  const contactId = contact?.id;
  const isTyping = selectIsTyping(whatsApp, conversationId);

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
    if (!inputText.trim() || !contact || contact.type !== "ai") return;

    const messageContent = inputText.trim();
    setInputText("");

    const deliveryStatus = wifiEnabled ? "delivered" : "pending";

    // Create and add user message with wifi-aware status
    const userMessage = createMessage(
      messageContent,
      "user_self", // sender: user
      contact.id, // receiver: AI contact ID (not conversation ID!)
      deliveryStatus
    );
    addMessage(conversationId, userMessage);

    // Only process AI response if wifi is enabled
    handleAIResponse(messageContent);
    // If offline, message remains pending until wifi comes back online
  };

  const handleAIResponse = async (userInput: string) => {
    if (!contact || contact.type !== "ai") return;

    if (wifiEnabled) {
      setTyping(conversationId, true);
    }

    try {
      const enhancedInstruction = buildSystemInstruction(
        contact.systemInstruction,
        messages
      );

      // Always call AI regardless of wifi status
      const response = await processAIResponse(userInput, enhancedInstruction);

      console.log("WhatsApp: ChatScreen handleAIResponse response", response);
      setTyping(conversationId, false);

      // Create AI message with wifi-aware delivery status
      const botMessage = createMessage(
        response,
        contact.id, // sender: AI contact ID (not conversation ID!)
        "user_self", // receiver: user
        receivedMessageStatus
      );
      addMessage(conversationId, botMessage);
    } catch (error) {
      setTyping(conversationId, false);
      console.error("AI response error:", error);

      // Error messages always start as pending
      const errorMessage = createMessage(
        "Sorry, I had trouble responding. Please try again.",
        contact.id, // sender: AI contact ID (not conversation ID!)
        "user_self", // receiver: user
        "pending"
      );
      addMessage(conversationId, errorMessage);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
        {/* Show offline indicator when wifi is disabled */}
        {!wifiEnabled && (
          <div className="mb-2 px-3 py-2 bg-yellow-600 text-white text-sm rounded-lg flex items-center gap-2">
            <WifiOff size={16} />
            <span>Offline - Messages will be sent when online</span>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={
                wifiEnabled
                  ? "Type a message..."
                  : "Type a message (will be sent when online)..."
              }
              className="w-full max-h-32 p-3 pl-4 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={1}
              style={
                {
                  // minHeight: "48px",
                  // height: "auto",
                }
              }
            />
          </div>

          <button
            onClick={handleSendMessage}
            // disabled={!inputText.trim() || !wifiEnabled}
            className={`p-3 rounded-full ${
              inputText.trim() && wifiEnabled
                ? !wifiEnabled
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            } transition-colors`}
            aria-label={!wifiEnabled ? "Queue message" : "Send message"}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
