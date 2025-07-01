import React from "react";
import { Check, CheckCheck } from "lucide-react";
import type { MessageStatus as MessageStatusType } from "./types";

interface MessageStatusProps {
  status?: MessageStatusType;
  isUser: boolean;
}

export const MessageStatus: React.FC<MessageStatusProps> = ({
  status,
  isUser,
}) => {
  // Only show status for user messages (outgoing)
  if (!isUser) return null;

  // Default to delivered if no status specified
  const messageStatus = status || "delivered";

  const getStatusIcon = () => {
    switch (messageStatus) {
      case "undelivered":
        return <Check className="w-4 h-4 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="w-4 h-4 text-gray-400" />;
      case "read":
        return <CheckCheck className="w-4 h-4 text-blue-500" />;
      default:
        return <CheckCheck className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <span className="inline-flex items-center ml-1">{getStatusIcon()}</span>
  );
};
