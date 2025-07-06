import React from "react";
import { useNewStore } from "@/hooks/useStore";
import { selectActiveConversationPreviews } from "@/store/contentState/whatsAppSelectors";

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

  return (
    <div className="h-full flex flex-col">
      <button
        onClick={onViewArchived}
        className="flex items-center p-3 hover:bg-gray-700 border-b border-gray-700"
      >
        <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-xl mr-3">
          📦
        </div>
        <span className="text-gray-300">Archived</span>
      </button>

      <div className="flex-1 overflow-y-auto">
        {conversationPreviews.map((preview) => (
          <div
            key={preview.id}
            className="flex items-center p-3 hover:bg-gray-700 cursor-pointer"
            onClick={() => onSelectConversation(preview.id)}
          >
            <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-xl mr-3">
              {preview.avatar}
            </div>

            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-semibold text-white">{preview.name}</h3>
                <span className="text-sm text-gray-400">
                  {preview.lastMessageTime}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-400 truncate max-w-[70%]">
                  {preview.lastMessage}
                </p>
                {preview.isTyping && (
                  <span className="text-green-500 text-sm">Typing...</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
