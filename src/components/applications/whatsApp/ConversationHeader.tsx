import React, { useState, useEffect } from "react";
import { useNewStore } from "@/hooks/useStore";
import { ArrowLeft, Phone, PhoneOff } from "lucide-react";
import { ChatOptionsMenu } from "./ChatOptionsMenu";
import type { ContactId, ConversationId } from "./types";
import { selectConversationParticipant } from "./selectors/contactSelectors";
import { selectIsTyping } from "./selectors/componentSelectors";
import { formatTimestamp } from "./whatsAppUtils";

interface ConversationHeaderProps {
  conversationId: string;
  onBack?: () => void;
  onArchive?: (contactId: ContactId) => void;
  onUnarchive?: (contactId: ContactId) => void;
  onViewProfile?: (contactId: ContactId) => void;
  onPhoneCall?: (
    avatar: string,
    name: string,
    phoneNumber: string,
    conversationId: ConversationId
  ) => void;
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  conversationId,
  onBack,
  onArchive,
  onUnarchive,
  onViewProfile,
  onPhoneCall,
}) => {
  const [lastSeenTimestamp, setLastSeenTimestamp] = useState<number | null>(
    null
  );
  const whatsApp = useNewStore((state) => state.whatsApp);
  const wifiEnabled = useNewStore((state) => state.wifiEnabled);
  const participant = selectConversationParticipant(whatsApp, conversationId);
  const isTyping = selectIsTyping(whatsApp, conversationId);

  // Track wifi state changes to update last seen timestamp
  useEffect(() => {
    if (!wifiEnabled && lastSeenTimestamp === null) {
      // WiFi just went off and we haven't set a timestamp yet
      setLastSeenTimestamp(Date.now());
    } else if (wifiEnabled) {
      // WiFi is back on, clear the last seen timestamp
      setLastSeenTimestamp(null);
    }
  }, [wifiEnabled, lastSeenTimestamp]);

  if (!participant) return null;

  const handleContactClick = () => {
    if (onViewProfile) {
      onViewProfile(conversationId);
    }
  };

  const getStatusDisplay = () => {
    if (wifiEnabled) {
      return isTyping ? "typing..." : "online";
    } else {
      return lastSeenTimestamp
        ? `last seen ${formatTimestamp(lastSeenTimestamp.toString())}`
        : "offline";
    }
  };

  return (
    <div className="bg-gray-800 text-white py-3 px-4 flex items-center border-b border-gray-700">
      {onBack && (
        <button
          onClick={onBack}
          className="mr-3 hover:text-gray-300 transition-colors"
          aria-label="Back to chat list"
        >
          <ArrowLeft size={20} />
        </button>
      )}

      <div
        className={`flex items-center flex-1 ${
          onViewProfile
            ? "cursor-pointer hover:bg-gray-700 rounded-lg p-2 -m-2 transition-colors"
            : ""
        }`}
        onClick={handleContactClick}
      >
        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-xl mr-3">
          <img
            src={participant.avatar}
            alt={participant.name}
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        <div className="flex-1">
          <h2 className="font-semibold">{participant.name}</h2>
          <div className="flex items-center gap-1">
            {wifiEnabled && !isTyping && (
              <div className="w-2 h-2 rounded-full bg-green-500" />
            )}
            <p className="text-xs text-gray-400">{getStatusDisplay()}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className="text-gray-300 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
          aria-label="Voice call"
          onClick={() =>
            onPhoneCall?.(
              participant.avatar,
              participant.name,
              participant.phoneNumber || "",
              conversationId
            )
          }
          disabled={!wifiEnabled}
        >
          {wifiEnabled ? (
            <Phone size={20} />
          ) : (
            <PhoneOff size={20} className="text-gray-400" />
          )}
        </button>
        {onArchive && onUnarchive && (
          <ChatOptionsMenu
            contactId={conversationId}
            onArchive={onArchive}
            onUnarchive={onUnarchive}
          />
        )}
      </div>
    </div>
  );
};
