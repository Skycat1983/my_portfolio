import React from "react";
import { useNewStore } from "@/hooks/useStore";
import { selectActiveConversationPreviews } from "@/store/contentState/whatsAppSelectors";
import { Separator } from "@/components/ui/separator";

interface ChatListScreenProps {
  onSelectConversation: (conversationId: string) => void;
  onViewArchived: () => void;
}

export const ChatListScreen: React.FC<ChatListScreenProps> = ({
  onSelectConversation,
  onViewArchived,
}) => {
  const whatsApp = useNewStore((state) => state.whatsApp);

  const conversationPreviews = selectActiveConversationPreviews(whatsApp);
  console.log("WhatsApp conversationPreviews", conversationPreviews);

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "now";
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col">
      <button
        onClick={onViewArchived}
        className="flex items-center p-3 hover:bg-gray-700 border-b border-gray-700"
      >
        <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-xl mr-3 flex-shrink-0">
          📦
        </div>
        <span className="text-gray-300">Archived</span>
      </button>

      <div className="flex-1 overflow-y-auto">
        <Separator className="my-2 mx-4 bg-gray-700" />

        {conversationPreviews.map((preview) => (
          <>
            <div
              key={preview.id}
              className="flex items-center p-3 hover:bg-gray-700 cursor-pointer"
              onClick={() => onSelectConversation(preview.id)}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
                <img
                  src={preview.avatar}
                  alt={preview.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-white truncate mr-2">
                    {preview.name}
                  </h3>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {formatTimestamp(preview.lastMessageTime)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400 truncate mr-2 flex-1">
                    {preview.lastMessage}
                  </p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {preview.unreadCount > 0 && (
                      <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1 min-w-5 h-5 flex items-center justify-center">
                        {preview.unreadCount}
                      </span>
                    )}
                    {preview.isTyping && (
                      <span className="text-green-500 text-xs">Typing...</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <Separator className="my-2 mx-4 bg-gray-700" />
          </>
        ))}
      </div>
    </div>
  );
};
