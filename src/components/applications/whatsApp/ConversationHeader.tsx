import React from "react";
import { useNewStore } from "@/hooks/useStore";
import { selectConversationHeader } from "@/store/contentState/whatsAppSelectors";
import { ArrowLeft, Phone } from "lucide-react";
import { ChatOptionsMenu } from "./ChatOptionsMenu";
import type { ContactId } from "./types";

interface ConversationHeaderProps {
  conversationId: string;
  onBack?: () => void;
  onArchive?: (contactId: ContactId) => void;
  onUnarchive?: (contactId: ContactId) => void;
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  conversationId,
  onBack,
  onArchive,
  onUnarchive,
}) => {
  // ! in use
  const whatsApp = useNewStore((state) => state.whatsApp);
  const headerData = selectConversationHeader(whatsApp, conversationId);

  if (!headerData) return null;

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

      <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-xl mr-3">
        <img
          src={headerData.avatar}
          alt={headerData.name}
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      <div className="flex-1">
        <h2 className="font-semibold">{headerData.name}</h2>
        <p className="text-xs text-gray-400">
          {headerData.isOnline ? "online" : "offline"}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          className="text-gray-300 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
          aria-label="Voice call"
        >
          <Phone size={20} />
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
