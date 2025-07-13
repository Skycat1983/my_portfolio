import { useNewStore } from "@/hooks/useStore";
import {
  selectArchivedConversations,
  selectChatlistPreviews,
} from "./selectors/componentSelectors";
import { Archive, ArrowLeft } from "lucide-react";
import { formatTimestamp } from "./whatsAppUtils";
import { Separator } from "@/components/ui/separator";
import type { ContactId } from "./types";

interface BaseChatListProps {
  searchQuery: string;
  archiveList: boolean;
  onSelectConversation: (conversationId: string) => void;
}

interface ActiveChatListProps extends BaseChatListProps {
  archiveList: false;
  onViewArchived: () => void;
}

interface ArchiveChatListProps extends BaseChatListProps {
  archiveList: true;
  onBack: () => void;
  onUnarchive: (contactId: ContactId) => void;
}

type ChatListProps = ArchiveChatListProps | ActiveChatListProps;

export const ChatList: React.FC<ChatListProps> = (props) => {
  const { archiveList, onSelectConversation } = props;
  const whatsApp = useNewStore((state) => state.whatsApp);
  const conversations = selectChatlistPreviews(whatsApp, archiveList);
  const archivedConversationCount = archiveList
    ? conversations.length
    : selectArchivedConversations(whatsApp).length;

  const typing = whatsApp.ui.typing;

  const conversationsToRender = props.searchQuery
    ? conversations.filter((conversation) =>
        conversation.name
          ?.toLowerCase()
          .includes(props.searchQuery.toLowerCase())
      )
    : conversations;

  return (
    <div className="h-full flex flex-col">
      {!archiveList && (
        <button
          onClick={props.onViewArchived}
          className="flex items-center hover:bg-gray-700 border-b border-gray-700"
        >
          <div className=" w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-xl mr-3 flex-shrink-0">
            <Archive size={20} />
          </div>
          <span className="text-gray-300 mr-auto">Archived</span>
          {archivedConversationCount > 0 && (
            <span className="text-sm text-gray-400 pr-3">
              {archivedConversationCount}
            </span>
          )}
        </button>
      )}
      {archiveList && (
        <div className="bg-gray-700 text-white py-3 px-4 flex items-center">
          <button
            onClick={props.onBack}
            className="mr-3 hover:text-gray-300 transition-colors"
            aria-label="Back to chat list"
          >
            <ArrowLeft size={20} />
          </button>
          {/* <h2 className="font-semibold">Archived</h2> */}
        </div>
      )}
      <Separator className="my-2 mx-4 bg-gray-700" />

      <div className="flex-1 overflow-y-auto">
        {conversationsToRender.map((preview, index) => {
          const isCurrentlyTyping = typing[preview.id] ?? false;
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
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-400">
                        {formatTimestamp(preview.lastMessageTime)}
                      </span>
                      {archiveList && preview.contactId && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            props.onUnarchive(preview.contactId!);
                          }}
                          className="text-green-500 hover:text-green-400 text-xs px-2 py-1 rounded transition-colors"
                        >
                          Unarchive
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-400 truncate mr-2 flex-1">
                      {isCurrentlyTyping
                        ? "Typing..."
                        : preview.lastMessage.content}
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
        {conversationsToRender.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p>No chats to show</p>
          </div>
        )}
      </div>
    </div>
  );
};
