import React from "react";
import { Check, CheckCheck, Clock, XCircle } from "lucide-react";

type DeliveryStatus = "pending" | "sent" | "delivered" | "read" | "failed";

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
    case "failed":
      return (
        <XCircle
          className="w-4 h-4 text-red-500"
          aria-label="Message failed to send"
        />
      );
    default:
      return null;
  }
};
