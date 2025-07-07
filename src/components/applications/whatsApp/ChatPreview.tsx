import { selectIsTyping } from "./selectors/componentSelectors";

export const ChatPreview = ({
  preview,
  index,
  onSelectConversation,
  formatTimestamp,
  whatsApp,
}: {
  preview: ConversationPreview;
  index: number;
  onSelectConversation: (conversationId: string) => void;
  formatTimestamp: (timestamp: string) => string;
  whatsApp: WhatsAppState;
}) => {
  return (
    <div
      key={index}
      className="flex items-center p-3 hover:bg-gray-700 cursor-pointer"
      onClick={() => onSelectConversation(preview.id)}
    >
      {/* <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
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
            {selectIsTyping(whatsApp, preview.id)
              ? "Typing..."
              : preview.lastMessage}
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
      </div> */}
    </div>
  );
};
