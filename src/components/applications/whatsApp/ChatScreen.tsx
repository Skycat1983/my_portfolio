import React, { useState, useRef, useEffect } from "react";
import type { ContactId } from "./types";
import { MessageComponent } from "./MessageComponent";
import { TypingIndicator } from "./TypingIndicator";
import { ChatOptionsMenu } from "./ChatOptionsMenu";
import { buildSystemInstruction } from "./utils";
import { useNewStore } from "@/hooks/useStore";
import {
  selectConversationMessages,
  selectIsTyping,
  selectContact,
  selectIsOnline,
  selectConversationPreview,
  selectConversationDetails,
} from "@/store/contentState/whatsAppSelectors";
import { createMessage, processAIResponse } from "./messageUtils";
import { ArrowLeft, Phone, Send } from "lucide-react";
import { ConversationHeader } from "./ConversationHeader";

interface ChatScreenProps {
  conversationId: ContactId;
  onBack: () => void;
  onArchive: (contactId: ContactId) => void;
  onUnarchive: (contactId: ContactId) => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  conversationId,
  onBack,
  onArchive,
  onUnarchive,
}) => {
  console.log("WhatsApp: ChatScreen conversationId", conversationId);
  const whatsApp = useNewStore((state) => state.whatsApp);
  console.log("WhatsApp: ChatScreen whatsApp", whatsApp);

  const conversationDetails = selectConversationDetails(
    whatsApp,
    conversationId
  );
  //
  console.log("WhatsApp: ChatScreen conversationDetails", conversationDetails);

  // Get state and actions from store using selectors with whatsApp state
  const messages = selectConversationMessages(whatsApp, conversationId);
  // console.log("WhatsApp: ChatScreen messages", messages);
  // const contactId = messages[0].senderId;

  const contact = selectContact(whatsApp, conversationId);
  // console.log("WhatsApp: ChatScreen contact", contact);

  const isTyping = selectIsTyping(whatsApp, conversationId);
  const isOnline = selectIsOnline(whatsApp);

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
    if (!inputText.trim() || !isOnline || !contact || contact.type !== "ai")
      return;

    const userMessage = createMessage(inputText, "user", "contact", "pending");
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
          const botMessage = createMessage(
            response,
            "contact",
            "user",
            "delivered"
          );
          addMessage(conversationId, botMessage);
        },
        () => {
          setTyping(conversationId, false);
          const errorMessage = createMessage(
            "Sorry, I had trouble responding. Please try again.",
            "contact",
            "user",
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
      <ConversationHeader conversationId={conversationId} />
      {/* <div className="bg-gray-800 text-white py-3 px-4 flex items-center border-b border-gray-700">
        <button
          onClick={onBack}
          className="mr-3 hover:text-gray-300 transition-colors"
          aria-label="Back to chat list"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-xl mr-3">
          {preview.avatar}
        </div>

        <div className="flex-1">
          <h2 className="font-semibold">{preview.name}</h2>
          <p className="text-xs text-gray-400">
            {isOnline ? "online" : "offline"}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            className="text-gray-300 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
            aria-label="Voice call"
          >
            <Phone size={20} />
          </button>
          <ChatOptionsMenu
            contactId={conversationId}
            onArchive={onArchive}
            onUnarchive={onUnarchive}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 text-white">
        {messages.map((message) => (
          <MessageComponent key={message.id} message={message} />
        ))}

        {isTyping && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-gray-800 border-t border-gray-700 text-white">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={isOnline ? "Type a message..." : "You are offline"}
              disabled={!isOnline}
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
            disabled={!inputText.trim() || !isOnline}
            className={`p-3 rounded-full ${
              inputText.trim() && isOnline
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            } transition-colors`}
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      </div> */}
    </div>
  );
};
