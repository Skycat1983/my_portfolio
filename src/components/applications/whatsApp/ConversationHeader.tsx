import React from "react";
import { useNewStore } from "@/hooks/useStore";
import { ArrowLeft, Phone, PhoneOff } from "lucide-react";
import { ChatOptionsMenu } from "./ChatOptionsMenu";
import type { ContactId, ConversationId } from "./types";
import { selectConversationHeader } from "./selectors/componentSelectors";

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
  // ! in use
  const whatsApp = useNewStore((state) => state.whatsApp);
  const wifiEnabled = useNewStore((state) => state.wifiEnabled);
  const headerData = selectConversationHeader(
    whatsApp,
    conversationId,
    wifiEnabled
  );
  console.log("WhatsApp: ConversationHeader headerData", headerData);
  // console.log("WhatsApp: ConversationHeader conversationId", conversationId);

  if (!headerData) return null;

  const handleContactClick = () => {
    if (onViewProfile) {
      onViewProfile(conversationId);
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
            src={headerData.avatar}
            alt={headerData.name}
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        <div className="flex-1">
          <h2 className="font-semibold">{headerData.name}</h2>
          <div className="flex items-center gap-1">
            {headerData.isOnline && (
              <div className="w-2 h-2 rounded-full bg-green-500" />
            )}
            <p className="text-xs text-gray-400">{headerData.lastSeen}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className="text-gray-300 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
          aria-label="Voice call"
          onClick={() =>
            onPhoneCall?.(
              headerData.avatar,
              headerData.name,
              headerData.phoneNumber,
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
