import React, { useEffect } from "react";
import { useWhatsAppHistory } from "./hooks/useWhatsAppHistory";
import { ChatListScreen } from "./ChatListScreen";
import { ChatScreen } from "./ChatScreen";
import { ArchiveScreen } from "./ArchiveScreen";
import { ArrowLeft, ArrowRight, Settings } from "lucide-react";
import { useNewStore } from "@/hooks/useStore";
import type { WindowType } from "@/types/storeTypes";

interface WhatsAppMainProps {
  windowId: WindowType["windowId"];
}

export const WhatsAppMain: React.FC<WhatsAppMainProps> = ({ windowId }) => {
  const {
    whatsAppView,
    navigateToView,
    goBack,
    goForward,
    canGoBack,
    canGoForward,
    cleanup,
  } = useWhatsAppHistory(windowId);
  // console.log("WhatsApp: WhatsAppMain whatsAppView", whatsAppView);

  const archiveContact = useNewStore((state) => state.archiveContact);
  const unarchiveContact = useNewStore((state) => state.unarchiveContact);
  const markConversationAsRead = useNewStore(
    (state) => state.markConversationAsRead
  );

  // Handle cleanup when window closes
  useEffect(() => {
    return () => {
      console.log("WhatsAppMain: cleaning up");
      cleanup();
    };
  }, [cleanup]);

  const handleConversationClick = React.useCallback(
    (conversationId: string) => {
      markConversationAsRead(conversationId);
      navigateToView("chat", { conversationId });
    },
    [markConversationAsRead, navigateToView]
  );

  const handleArchiveClick = React.useCallback(() => {
    navigateToView("archive");
  }, [navigateToView]);

  const handleBackToList = React.useCallback(() => {
    navigateToView("chatList");
  }, [navigateToView]);

  const handleArchiveContact = React.useCallback(
    (contactId: string) => {
      archiveContact(contactId);
      navigateToView("chatList");
    },
    [archiveContact, navigateToView]
  );

  const handleUnarchiveContact = React.useCallback(
    (contactId: string) => {
      unarchiveContact(contactId);
    },
    [unarchiveContact]
  );

  return (
    <div className="h-full w-full bg-gray-800">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white">Chats</h2>
        <div className="flex gap-2">
          <button
            onClick={goBack}
            disabled={!canGoBack}
            className={`p-2 rounded-full transition-colors ${
              canGoBack
                ? "text-white hover:bg-gray-700"
                : "text-gray-500 cursor-not-allowed"
            }`}
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={goForward}
            disabled={!canGoForward}
            className={`p-2 rounded-full transition-colors ${
              canGoForward
                ? "text-white hover:bg-gray-700"
                : "text-gray-500 cursor-not-allowed"
            }`}
            aria-label="Go forward"
          >
            <ArrowRight size={20} />
          </button>
          <button>
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="h-[calc(100%-4rem)]">
        {whatsAppView?.view === "chatList" && (
          <ChatListScreen
            onSelectConversation={handleConversationClick}
            onViewArchived={handleArchiveClick}
          />
        )}
        {whatsAppView?.view === "chat" &&
          whatsAppView.params?.conversationId && (
            <ChatScreen
              windowId={windowId}
              conversationId={whatsAppView.params.conversationId}
              onBack={handleBackToList}
              onArchive={handleArchiveContact}
              onUnarchive={handleUnarchiveContact}
            />
          )}
        {whatsAppView?.view === "archive" && (
          <ArchiveScreen
            onBack={handleBackToList}
            onSelectContact={handleConversationClick}
            onUnarchive={handleUnarchiveContact}
          />
        )}
      </div>
    </div>
  );
};
