import React from "react";
import { ArrowLeft } from "lucide-react";
import type { Chat } from "./types";

interface ArchiveScreenProps {
  onBack: () => void;
  onChatSelect: (chat: Chat) => void;
  chats?: Chat[];
}

export const ArchiveScreen: React.FC<ArchiveScreenProps> = ({
  onBack,
  onChatSelect,
  chats = [],
}) => {
  const archivedChats = chats.filter((chat) => chat.isArchived);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 flex items-center">
        <button
          onClick={onBack}
          className="mr-3 hover:text-gray-200"
          aria-label="Back to chats"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-semibold">Archived</h2>
      </div>

      {/* Archived Chat List */}
      <div className="flex-1 overflow-y-auto">
        {archivedChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-lg">No archived chats</p>
            <p className="text-sm text-gray-400 mt-2">
              Archived chats will appear here
            </p>
          </div>
        ) : (
          archivedChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat)}
              className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-2xl mr-3">
                {chat.avatar}
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {chat.name}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {chat.lastMessageTime}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-600 truncate">
                    {chat.lastMessage}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
