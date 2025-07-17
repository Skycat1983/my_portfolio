import React from "react";
import type { Message } from "./types";
import { MessageStatus } from "./MessageStatus";

interface MessageComponentProps {
  message: Message;
  searchQuery?: string;
  highlightSearchText?: (
    text: string,
    query: string
  ) => string | (string | React.ReactElement)[];
}

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const MessageComponent: React.FC<MessageComponentProps> = ({
  message,
  searchQuery = "",
  highlightSearchText,
}) => {
  const deliveryStatus = message.deliveryStatus;
  const isUser = message.sender === "user_self";

  // Use highlight function if provided, otherwise show plain text
  const messageContent =
    highlightSearchText && searchQuery
      ? highlightSearchText(message.content, searchQuery)
      : message.content;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isUser
            ? "bg-green-700 text-white rounded-br-none"
            : `bg-white text-gray-800 rounded-bl-none shadow-sm`
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">
          {messageContent}
        </p>
        <div
          className={`flex items-center justify-between text-xs mt-1 ${
            isUser ? "text-green-100" : "text-gray-500"
          }`}
        >
          <span>{formatTimestamp(message.timestamp)}</span>
          <MessageStatus status={deliveryStatus} isUser={isUser} />
        </div>
      </div>
    </div>
  );
};
