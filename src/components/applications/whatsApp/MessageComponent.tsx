import React from "react";
import type { Message } from "./types";
import { MessageStatus } from "./MessageStatus";
import { useNewStore } from "@/hooks/useStore";
import theme from "@/styles/theme";

interface MessageComponentProps {
  message: Message;
}

export const MessageComponent: React.FC<MessageComponentProps> = ({
  message,
}) => {
  // const currentTheme = useNewStore((s) => s.theme);
  // const textColor = theme.colors[currentTheme].text.primary;
  // const bgColor = theme.colors[currentTheme].background.primary;
  const isUser = message.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isUser
            ? "bg-green-700 text-white rounded-br-none"
            : `bg-white text-gray-800 rounded-bl-none shadow-sm `
        }`}
        // style={{
        //   color: textColor,
        // }}
      >
        <p className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </p>
        <div
          className={`flex items-center justify-between text-xs mt-1 ${
            isUser ? "text-green-100" : "text-gray-500"
          }`}
        >
          <span>{message.timestamp}</span>
          <MessageStatus status={message.status} isUser={isUser} />
        </div>
      </div>
    </div>
  );
};
