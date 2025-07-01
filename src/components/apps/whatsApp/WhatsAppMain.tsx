import React, { useState } from "react";
import { ChatListScreen } from "./ChatListScreen";
import { ChatScreen } from "./ChatScreen";
import { ArchiveScreen } from "./ArchiveScreen";
import type { Chat } from "./types";
import { mockChats } from "./data";

export const WhatsAppMain: React.FC = () => {
  const [currentView, setCurrentView] = useState<
    "chatList" | "chat" | "archive"
  >("chatList");
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>(mockChats);

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
    setCurrentView("chat");
  };

  const handleBackToList = () => {
    setCurrentView("chatList");
    setSelectedChat(null);
  };

  const handleArchiveView = () => {
    setCurrentView("archive");
  };

  const handleBackToListFromArchive = () => {
    setCurrentView("chatList");
  };

  const handleArchiveChat = (chatId: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, isArchived: true } : chat
      )
    );
  };

  const handleUnarchiveChat = (chatId: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, isArchived: false } : chat
      )
    );
  };

  return (
    <div className="h-full w-full bg-gray-100 flex flex-col pt-5">
      {currentView === "chatList" ? (
        <ChatListScreen
          chats={chats}
          onChatSelect={handleChatSelect}
          onArchiveView={handleArchiveView}
        />
      ) : currentView === "archive" ? (
        <ArchiveScreen
          chats={chats}
          onBack={handleBackToListFromArchive}
          onChatSelect={handleChatSelect}
        />
      ) : (
        selectedChat && (
          <ChatScreen
            chat={selectedChat}
            onBack={handleBackToList}
            onArchive={handleArchiveChat}
            onUnarchive={handleUnarchiveChat}
          />
        )
      )}
    </div>
  );
};
