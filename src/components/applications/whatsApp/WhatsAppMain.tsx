import React, { useEffect, useState } from "react";
import { useWhatsAppHistory } from "./hooks/useWhatsAppHistory";
import { ChatListScreen } from "./ChatListScreen";
import { ChatScreen } from "./ChatScreen";
import { ArchiveScreen } from "./ArchiveScreen";
import { ContactScreen } from "./ContactScreen";
import { CircleUserRound } from "lucide-react";
import { useNewStore } from "@/hooks/useStore";
import type { Conversation, ConversationId } from "./types";
import { PhoneCallScreen } from "./PhoneCallScreen";
import { buildSystemInstruction } from "./utils";
import { createMessage, processAIResponse } from "./messageUtils";
import { selectConversationParticipant } from "./selectors/contactSelectors";
import { selectVisibleConversationMessages } from "./selectors/messageSelectors";
import { motion, AnimatePresence } from "framer-motion";
import type { WindowId } from "@/constants/applicationRegistry";
import { Input } from "@/components/ui/input";

interface WhatsAppMainProps {
  windowId: WindowId;
}

export const WhatsAppMain: React.FC<WhatsAppMainProps> = ({ windowId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isPhoneCall, setIsPhoneCall] = useState<{
    avatar: string;
    name: string;
    phoneNumber: string;
    conversationId: ConversationId;
  } | null>(null);

  // Track navigation direction for animations
  const [navigationDirection, setNavigationDirection] = useState<
    "forward" | "backward" | "initial"
  >("initial");

  const { whatsAppView, navigateToView, goBack, cleanup } =
    useWhatsAppHistory(windowId);

  // Set direction to forward after initial load
  useEffect(() => {
    if (navigationDirection === "initial" && whatsAppView) {
      // Small delay to let initial animation complete
      const timer = setTimeout(() => {
        setNavigationDirection("forward");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [navigationDirection, whatsAppView]);

  const whatsApp = useNewStore((state) => state.whatsApp);
  const archiveContact = useNewStore((state) => state.archiveContact);
  const unarchiveContact = useNewStore((state) => state.unarchiveContact);
  const markConversationMessagesAsRead = useNewStore(
    (state) => state.markConversationMessagesAsRead
  );
  const addMessage = useNewStore((state) => state.addMessage);
  const wifiEnabled = useNewStore((state) => state.wifiEnabled);
  const setTyping = useNewStore((state) => state.setTyping);
  console.log("WhatsAppMain: whatsApp", whatsApp);

  // Animation variants with improved synchronization
  const slideVariants = {
    initial: (direction: "forward" | "backward" | "initial") => {
      if (direction === "initial") {
        return { y: "-100%", opacity: 0 }; // Enter from top
      }
      return {
        x: direction === "forward" ? "100%" : "-100%", // forward: from right, backward: from left
        opacity: 0,
      };
    },
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
    },
    exit: (direction: "forward" | "backward" | "initial") => {
      if (direction === "initial") {
        return { y: "100%", opacity: 0 }; // Exit to bottom (shouldn't happen)
      }
      return {
        x: direction === "forward" ? "-100%" : "100%", // forward: to left, backward: to right
        opacity: 0,
      };
    },
  };

  const transition = {
    duration: 0.3,
  };

  // Generate unique key for AnimatePresence
  const getViewKey = () => {
    if (!whatsAppView) return "loading";

    const baseKey = whatsAppView.view;
    const params = whatsAppView.params;

    if (params?.conversationId) return `${baseKey}-${params.conversationId}`;
    if (params?.contactId) return `${baseKey}-${params.contactId}`;

    return baseKey;
  };

  // Handle cleanup when window closes
  useEffect(() => {
    return () => {
      console.log("WhatsAppMain: cleaning up");
      cleanup();
    };
  }, [cleanup]);

  const handlePhoneCallAIResponse = async (
    phoneCallConversationId: ConversationId
  ) => {
    console.log(
      "WhatsApp: WhatsAppMain handlePhoneCallAIResponse",
      phoneCallConversationId
    );

    // Get the contact for this conversation
    const contact = selectConversationParticipant(
      whatsApp,
      phoneCallConversationId
    );

    // Only respond if contact exists and is an AI
    if (!contact || contact.type !== "ai") {
      return;
    }

    try {
      // Get conversation messages for context using existing selector
      const conversationMessages = selectVisibleConversationMessages(
        whatsApp,
        phoneCallConversationId
      );

      // Create special system instruction for missed calls
      const missedCallInstruction = `${contact.systemInstruction}

IMPORTANT: The user just tried to call you but you couldn't answer the phone. Respond with a brief, character-appropriate reason why you're not available to take calls right now. Keep it natural and in-character. Do not mention that this is a simulation or that you're an AI.`;

      const enhancedInstruction = buildSystemInstruction(
        missedCallInstruction,
        conversationMessages
      );

      if (wifiEnabled) {
        setTyping(phoneCallConversationId, true);
      }

      // Call AI for missed call response
      const response = await processAIResponse(
        "User attempted to call but call could not be completed",
        enhancedInstruction
      );

      console.log(
        "WhatsApp: WhatsAppMain handlePhoneCallAIResponse response",
        response
      );

      // Determine delivery status based on wifi and viewing state
      const isViewingChat = whatsAppView?.view === "chat";
      const isViewingThisConversation =
        whatsAppView?.params?.conversationId === phoneCallConversationId;

      const receivedMessageStatus =
        isViewingChat && isViewingThisConversation && wifiEnabled
          ? "read"
          : wifiEnabled
          ? "delivered"
          : "sent";

      // Create AI message with wifi-aware delivery status
      const missedCallMessage = createMessage(
        response,
        contact.id, // sender: AI contact ID
        "user_self", // receiver: user
        receivedMessageStatus
      );

      addMessage(phoneCallConversationId, missedCallMessage);
    } catch (error) {
      console.error("Phone call AI response error:", error);

      // Fallback message on error
      const errorMessage = createMessage(
        "Sorry, I missed your call and can't respond right now.",
        contact.id,
        "user_self",
        "pending"
      );
      addMessage(phoneCallConversationId, errorMessage);
    } finally {
      setTyping(phoneCallConversationId, false);
    }
  };

  const handleConversationClick = React.useCallback(
    (conversationId: Conversation["id"]) => {
      setNavigationDirection("forward");
      markConversationMessagesAsRead(conversationId);
      navigateToView("chat", { conversationId });
    },
    [markConversationMessagesAsRead, navigateToView]
  );

  const handlePhoneCallClick = React.useCallback(
    (
      avatar: string,
      name: string,
      phoneNumber: string,
      conversationId: ConversationId
    ) => {
      // navigateToView("phoneCall", { conversationId });
      setIsPhoneCall({ avatar, name, phoneNumber, conversationId });
    },
    []
  );

  const handleArchiveClick = React.useCallback(() => {
    setNavigationDirection("forward");
    navigateToView("archive");
  }, [navigateToView]);

  const handleArchiveContact = React.useCallback(
    (contactId: string) => {
      archiveContact(contactId);
      setNavigationDirection("backward");
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
      setNavigationDirection("forward");
      navigateToView("contact", { contactId });
    },
    [navigateToView]
  );

  const handleAccountClick = React.useCallback(() => {
    setNavigationDirection("forward");
    navigateToView("contact", { contactId: "user_self" });
  }, [navigateToView]);

  const handleGoBack = React.useCallback(() => {
    setNavigationDirection("backward");
    goBack();
  }, [goBack]);

  return (
    <div className="h-full w-full bg-gray-800">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white">
          {isPhoneCall
            ? "Calling..."
            : whatsAppView?.view === "chatList"
            ? "Chats"
            : whatsAppView?.view === "chat"
            ? "Chat"
            : whatsAppView?.view === "archive"
            ? "Archive"
            : whatsAppView?.view === "contact"
            ? "Contact"
            : "WhatsApp"}
        </h2>
        <div className="w-full px-8">
          <Input
            placeholder="Search"
            className="w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
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
      <div className="h-[calc(100%-4rem)] relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={getViewKey()}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={slideVariants}
            custom={navigationDirection}
            transition={transition}
            className="absolute inset-0 w-full h-full"
          >
            {whatsAppView?.view === "chatList" && !isPhoneCall && (
              <ChatListScreen
                onSelectConversation={handleConversationClick}
                onViewArchived={handleArchiveClick}
                searchQuery={searchQuery}
              />
            )}
            {whatsAppView?.view === "chat" &&
              whatsAppView.params?.conversationId &&
              !isPhoneCall && (
                <ChatScreen
                  windowId={windowId}
                  conversationId={whatsAppView.params.conversationId}
                  onBack={handleGoBack}
                  onArchive={handleArchiveContact}
                  onUnarchive={handleUnarchiveContact}
                  onViewProfile={handleViewProfile}
                  onPhoneCall={handlePhoneCallClick}
                />
              )}
            {whatsAppView?.view === "archive" && !isPhoneCall && (
              <ArchiveScreen
                onBack={handleGoBack}
                onSelectContact={handleConversationClick}
                onUnarchive={handleUnarchiveContact}
                searchQuery={searchQuery}
              />
            )}
            {whatsAppView?.view === "contact" &&
              whatsAppView.params?.contactId &&
              !isPhoneCall && (
                <ContactScreen
                  contactId={whatsAppView.params.contactId}
                  onBack={handleGoBack}
                  onViewProfile={handleViewProfile}
                />
              )}
            {isPhoneCall && (
              <PhoneCallScreen
                avatar={isPhoneCall.avatar}
                name={isPhoneCall.name}
                phoneNumber={isPhoneCall.phoneNumber}
                conversationId={isPhoneCall.conversationId}
                onHangUp={() => setIsPhoneCall(null)}
                onPhoneCallEnd={handlePhoneCallAIResponse}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
