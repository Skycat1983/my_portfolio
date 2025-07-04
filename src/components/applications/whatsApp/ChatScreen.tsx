import React, { useState, useRef, useEffect } from "react";
import type { Chat, Message } from "./types";
import { mockMessages } from "./data";
import { whatsApp } from "./whatsApp";
import { MessageComponent } from "./MessageComponent";
import { TypingIndicator } from "./TypingIndicator";
import { ChatOptionsMenu } from "./ChatOptionsMenu";
import { buildSystemInstruction } from "./utils";
import { useNewStore } from "@/hooks/useStore";
import theme from "@/styles/theme";

interface ChatScreenProps {
  chat: Chat;
  onBack: () => void;
  onArchive: (chatId: string) => void;
  onUnarchive: (chatId: string) => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  chat,
  onBack,
  onArchive,
  onUnarchive,
}) => {
  const currentTheme = useNewStore((s) => s.theme);
  const bgColor = theme.colors[currentTheme].background.primary;
  const borderColor = theme.colors[currentTheme].border.primary;
  // const textColor = theme.colors[currentTheme].text.primary;

  const [messages, setMessages] = useState<Message[]>(
    mockMessages[chat.id] || []
  );
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      content: inputText,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      // Build system instruction with conversation history
      const enhancedInstruction = buildSystemInstruction(
        chat.systemInstruction,
        messages
      );

      const response = await whatsApp({
        contents: inputText,
        systemInstruction: enhancedInstruction,
      });

      setIsTyping(false);

      if (response) {
        const botMessage: Message = {
          id: `msg_${Date.now() + 1}`,
          content: response,
          sender: "contact",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Error sending message in ChatScreen:", error);
      setIsTyping(false);

      const errorMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        content: "Sorry, I had trouble responding. Please try again.",
        sender: "contact",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className="h-full flex flex-col"
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
      }}
    >
      {/* Header */}
      <div className="bg-green-800 text-white py-2 flex items-center">
        <button
          onClick={onBack}
          className="mr-3 hover:text-gray-200"
          aria-label="Back to chat list"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xl mr-3">
          {chat.avatar}
        </div>

        <div className="flex-1">
          <h2 className="font-semibold">{chat.name}</h2>
          <p className="text-xs text-green-100">online</p>
        </div>

        <div className="flex">
          <button className="text-white hover:text-gray-200">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
          </button>
          <ChatOptionsMenu
            chat={chat}
            onArchive={onArchive}
            onUnarchive={onUnarchive}
          />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message) => (
          <MessageComponent key={message.id} message={message} />
        ))}

        {isTyping && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-end space-x-2">
          <div className="flex-1 flex items-end space-x-2">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 max-h-32 p-3 pl-10 border border-gray-300 text-black rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={1}
              style={{
                minHeight: "48px",
                height: "auto",
              }}
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className={`p-3 rounded-full ${
              inputText.trim()
                ? "bg-green-500 hover:bg-green-800 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            aria-label="Send message"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
