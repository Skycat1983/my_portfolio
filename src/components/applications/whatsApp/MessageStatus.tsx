import React from "react";
import { Check, CheckCheck, Clock } from "lucide-react";
import type { DeliveryStatus } from "./types";

interface MessageStatusProps {
  status: DeliveryStatus;
  isUser: boolean;
}

export const MessageStatus: React.FC<MessageStatusProps> = ({
  status,
  isUser,
}) => {
  if (!isUser) return null;

  switch (status) {
    case "read":
      return (
        <CheckCheck
          className="w-4 h-4 text-blue-400"
          aria-label="Message read"
        />
      );
    case "delivered":
      return <CheckCheck className="w-4 h-4" aria-label="Message delivered" />;
    case "sent":
      return <Check className="w-4 h-4" aria-label="Message sent" />;
    case "pending":
      return <Clock className="w-4 h-4" aria-label="Message pending" />;

    default:
      return null;
  }
};
