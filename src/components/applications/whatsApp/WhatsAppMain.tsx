import React, { useEffect } from "react";
import { useWhatsAppHistory } from "./hooks/useWhatsAppHistory";
import { ChatListScreen } from "./ChatListScreen";
import { ChatScreen } from "./ChatScreen";
import { ArchiveScreen } from "./ArchiveScreen";
import { ContactScreen } from "./ContactScreen";
import { CircleUserRound } from "lucide-react";
import { useNewStore } from "@/hooks/useStore";
import type { WindowType } from "@/types/storeTypes";

interface WhatsAppMainProps {
  windowId: WindowType["windowId"];
}

export const WhatsAppMain: React.FC<WhatsAppMainProps> = ({ windowId }) => {
  console.log("WhatsApp: WhatsAppMain windowId");
  const { whatsAppView, navigateToView, goBack, cleanup } =
    useWhatsAppHistory(windowId);
  // console.log("WhatsApp: WhatsAppMain whatsAppView", whatsAppView);

  const archiveContact = useNewStore((state) => state.archiveContact);
  const unarchiveContact = useNewStore((state) => state.unarchiveContact);
  const markConversationAsRead = useNewStore(
    (state) => state.markConversationAsRead
  );
  const wifiEnabled = useNewStore((state) => state.wifiEnabled);
  console.log("whatsApp: wifiEnabled", wifiEnabled);

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

  const handleViewProfile = React.useCallback(
    (contactId: string) => {
      navigateToView("contact", { contactId });
    },
    [navigateToView]
  );

  const handleAccountClick = React.useCallback(() => {
    navigateToView("contact", { contactId: "user_self" });
  }, [navigateToView]);

  return (
    <div className="h-full w-full bg-gray-800">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white">
          {whatsAppView?.view === "chatList"
            ? "Chats"
            : whatsAppView?.view === "chat"
            ? "Chat"
            : whatsAppView?.view === "archive"
            ? "Archive"
            : "Contact"}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleAccountClick}
            className="p-2 rounded-full transition-colors text-white hover:bg-gray-700"
            aria-label="Account"
          >
            <CircleUserRound size={20} />
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
              onBack={goBack}
              onArchive={handleArchiveContact}
              onUnarchive={handleUnarchiveContact}
              onViewProfile={handleViewProfile}
            />
          )}
        {whatsAppView?.view === "archive" && (
          <ArchiveScreen
            onBack={goBack}
            onSelectContact={handleConversationClick}
            onUnarchive={handleUnarchiveContact}
          />
        )}
        {whatsAppView?.view === "contact" && whatsAppView.params?.contactId && (
          <ContactScreen
            contactId={whatsAppView.params.contactId}
            onBack={goBack}
            onViewProfile={handleViewProfile}
          />
        )}
        <div className="text-white text-sm">
          {wifiEnabled ? "Wifi enabled" : "Wifi disabled"}
        </div>
      </div>
    </div>
  );
};
{
  /* <button
            onClick={handleSettingsClick}
            className="rounded-full transition-colors bg-green-800 text-white hover:bg-gray-700"
            aria-label="Settings"
          >
            <Plus size={20} />
          </button> */
}
{
  /* <button
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
          </button> */
}
