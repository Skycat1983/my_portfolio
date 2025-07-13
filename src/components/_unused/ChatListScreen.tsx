import React from "react";
import { useNewStore } from "@/hooks/useStore";
import { selectArchivedConversations } from "../applications/whatsApp/selectors/componentSelectors";
import { Separator } from "@/components/ui/separator";
import { Archive } from "lucide-react";
import { selectActiveConversationPreviews } from "../applications/whatsApp/selectors/conversationSelectors";
import { formatTimestamp } from "../applications/whatsApp/whatsAppUtils";

interface ChatListScreenProps {
  onSelectConversation: (conversationId: string) => void;
  onViewArchived: () => void;
  searchQuery: string;
}

export const ChatListScreen: React.FC<ChatListScreenProps> = ({
  onSelectConversation,
  onViewArchived,
}) => {
  const whatsApp = useNewStore((state) => state.whatsApp);
  const typing = whatsApp.ui.typing;
  console.log("WhatsApp: ChatListScreen typing state:", typing);
  console.log("WhatsApp: ChatListScreen whatsAppState", whatsApp);

  const archivedConversations = selectArchivedConversations(whatsApp);
  const archiveConversationCount = archivedConversations.length;

  const wifiEnabled = useNewStore((state) => state.wifiEnabled);
  console.log("WhatsApp: ChatListScreen wifiEnabled", wifiEnabled);

  const conversationPreviews = selectActiveConversationPreviews(whatsApp);
  console.log(
    "WhatsApp: ChatListScreen conversationPreviews",
    conversationPreviews
  );

  const isTyping = (conversationId: string) => {
    const typingValue = typing[conversationId] ?? false;
    console.log(
      `WhatsApp: ChatListScreen isTyping for ${conversationId}:`,
      typingValue
    );
    return typingValue;
  };

  return (
    <div className="h-full flex flex-col">
      <button
        onClick={onViewArchived}
        className="flex items-center hover:bg-gray-700 border-b border-gray-700"
      >
        <div className=" w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-xl mr-3 flex-shrink-0">
          <Archive size={20} />
        </div>
        <span className="text-gray-300 mr-auto">Archived</span>
        {archiveConversationCount > 0 && (
          <span className="text-sm text-gray-400 pr-3">
            {archiveConversationCount}
          </span>
        )}
      </button>
      <Separator className=" bg-gray-700 shadow-lg" />

      <div className="flex-1 overflow-y-auto">
        {conversationPreviews.map((preview, index) => {
          const isCurrentlyTyping = isTyping(preview.id);
          const previewIsTyping = preview.isTyping;

          console.log(`WhatsApp: ChatListScreen Conversation ${preview.id}:`, {
            isCurrentlyTyping,
            previewIsTyping,
            lastMessage: preview.lastMessage,
            displayText: isCurrentlyTyping ? "Typing..." : preview.lastMessage,
          });

          return (
            <>
              <div
                key={index}
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
                      {isCurrentlyTyping ? "Typing..." : preview.lastMessage}
                    </p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {preview.unreadCount > 0 && (
                        <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1 min-w-5 h-5 flex items-center justify-center">
                          {preview.unreadCount}
                        </span>
                      )}
                      {(isCurrentlyTyping || previewIsTyping) && (
                        <span className="text-green-500 text-xs">
                          Typing...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <Separator className="my-2 mx-4 bg-gray-700" />
            </>
          );
        })}
      </div>
    </div>
  );
};
