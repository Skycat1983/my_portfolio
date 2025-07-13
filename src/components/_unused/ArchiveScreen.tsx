import React from "react";
import type { ContactId } from "../applications/whatsApp/types";
import { useNewStore } from "@/hooks/useStore";
import { ArrowLeft } from "lucide-react";
import { selectArchivedConversationPreviews } from "../applications/whatsApp/selectors/componentSelectors";
import { formatTimestamp } from "../applications/whatsApp/whatsAppUtils";

interface ArchiveScreenProps {
  onBack: () => void;
  onSelectContact: (contactId: ContactId) => void;
  onUnarchive: (contactId: ContactId) => void;
  searchQuery: string;
}

export const ArchiveScreen: React.FC<ArchiveScreenProps> = ({
  onBack,
  onSelectContact,
  onUnarchive,
}) => {
  const whatsApp = useNewStore((state) => state.whatsApp);
  const archivedContacts = selectArchivedConversationPreviews(whatsApp);

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-900 text-white py-3 px-4 flex items-center">
        <button
          onClick={onBack}
          className="mr-3 hover:text-gray-300 transition-colors"
          aria-label="Back to chat list"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-semibold">Archived</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {archivedContacts.map((preview) => (
          <div
            key={preview.id}
            className="flex items-center p-3 hover:bg-gray-700 cursor-pointer"
            onClick={() => onSelectContact(preview.id)}
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (preview.aiContactId) {
                        onUnarchive(preview.aiContactId);
                      }
                    }}
                    className="text-green-500 hover:text-green-400 text-xs px-2 py-1 rounded transition-colors"
                  >
                    Unarchive
                  </button>
                </div>
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
        ))}

        {archivedContacts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="text-4xl mb-4">📦</div>
            <p>No archived chats</p>
          </div>
        )}
      </div>
    </div>
  );
};
