import React from "react";
import { Archive } from "lucide-react";
import type { Chat } from "./types";

interface ChatListScreenProps {
  chats: Chat[];
  onChatSelect: (chat: Chat) => void;
  onArchiveView: () => void;
}

export const ChatListScreen: React.FC<ChatListScreenProps> = ({
  chats,
  onChatSelect,
  onArchiveView,
}) => {
  const activeChats = chats.filter((chat) => !chat.isArchived);
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Chats</h2>
        <div className="flex space-x-4">
          <button className="text-white hover:text-gray-200">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button className="text-white hover:text-gray-200">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Archive Button */}
      <button
        onClick={onArchiveView}
        className="flex items-center space-x-2 p-4 hover:bg-gray-50 border-b border-gray-200"
      >
        <Archive className="w-5 h-5 text-gray-600" />
        <span className="text-gray-700">Archived</span>
      </button>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {activeChats.map((chat) => (
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
        ))}
      </div>
    </div>
  );
};
