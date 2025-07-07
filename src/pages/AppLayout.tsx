import {
  BACKGROUND_IPHONE,
  BACKGROUND_MAC,
  BACKGROUND_WIN,
} from "../constants/images";
import { ResizableWindow } from "../components/window/ResizableWindow";
import { useNewStore } from "../hooks/useStore";
import { useScreenMonitor } from "../hooks/useScreenSize";
import Dock from "../components/dock/Dock";
import { MenubarLayout } from "../components/menubar/MenubarLayout";
import { Widgets } from "../components/widgets/WidgetsLayout";
import { DirectoryContent } from "../components/applications/directory/DirectoryContent";
import { desktopRootId } from "../constants/nodes";
import { useEffect, useRef } from "react";

import {
  processAIResponse,
  createMessage,
} from "../components/applications/whatsApp/messageUtils";
import { buildSystemInstruction } from "../components/applications/whatsApp/utils";

export const AppLayout = () => {
  const nodeMap = useNewStore((s) => s.nodeMap);
  console.log("DO NOT DELETE THIS LOG: nodeMap", nodeMap);
  const unlockClickOnSomethingAchievement = useNewStore(
    (s) => s.unlockClickOnSomethingAchievement
  );
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  const customWallpaper = useNewStore((s) => s.customWallpaper);
  const openWindows = useNewStore((s) => s.openWindows);

  // Wifi state management
  const wifiEnabled = useNewStore((s) => s.wifiEnabled);
  const whatsApp = useNewStore((s) => s.whatsApp);
  const markPendingMessagesAsDelivered = useNewStore(
    (s) => s.markPendingMessagesAsDelivered
  );
  const addMessage = useNewStore((s) => s.addMessage);
  const setTyping = useNewStore((s) => s.setTyping);
  const prevWifiEnabledRef = useRef<boolean>(wifiEnabled);

  // Monitor screen dimensions and update store
  const screenInfo = useScreenMonitor();

  const { isMobile } = screenInfo;

  // Function to process AI responses for newly delivered user messages

  // Global wifi state management - process pending messages when wifi comes back online
  useEffect(() => {
    const prevWifiEnabled = prevWifiEnabledRef.current;

    // Check if wifi has changed from false to true (coming back online)
    if (!prevWifiEnabled && wifiEnabled) {
      console.log("WiFi came back online - processing pending messages");

      // First, mark all pending messages as delivered
      markPendingMessagesAsDelivered();

      const processDelayedAIResponses = async () => {
        console.log("Processing delayed AI responses...");

        // Get user messages that just became delivered and need AI responses
        const userMessagesToProcess = whatsApp.messages.allIds
          .map((id) => whatsApp.messages.byId[id])
          .filter((message) => {
            if (
              !message ||
              message.sender !== "user_self" ||
              message.deliveryStatus !== "delivered"
            ) {
              return false;
            }

            // Get conversation ID - user messages have receiver as the AI contact
            const conversationId = `user_self_${message.receiver}`;
            const conversationMessages =
              whatsApp.messages.byConversation[conversationId] || [];

            const messageIndex = conversationMessages.indexOf(message.id);
            const nextMessage = conversationMessages[messageIndex + 1];

            // If there's no next message or the next message is from the same sender, we need AI response
            if (!nextMessage) return true;

            const nextMessageData = whatsApp.messages.byId[nextMessage];
            return nextMessageData?.sender === "user_self";
          });

        console.log(
          "User messages needing AI responses:",
          userMessagesToProcess
        );

        // Process each message with error handling
        for (const userMessage of userMessagesToProcess) {
          const aiContactId = userMessage.receiver;
          const aiContact = whatsApp.contacts.byId[aiContactId];

          if (!aiContact || aiContact.type !== "ai") continue;

          const conversationId = `user_self_${aiContactId}`;

          try {
            setTyping(conversationId, true);

            const conversationMessages =
              whatsApp.messages.byConversation[conversationId] || [];
            const messages = conversationMessages
              .map((id) => whatsApp.messages.byId[id])
              .filter(Boolean);

            const enhancedInstruction = buildSystemInstruction(
              aiContact.systemInstruction,
              messages
            );

            await processAIResponse(
              userMessage.content,
              enhancedInstruction,
              (response) => {
                setTyping(conversationId, false);
                const botMessage = createMessage(
                  response,
                  aiContactId,
                  "user_self",
                  "delivered",
                  true
                );
                addMessage(conversationId, botMessage);
              },
              (error) => {
                setTyping(conversationId, false);
                console.error("Error processing delayed AI response:", error);
              },
              true
            );

            // Add small delay between processing to avoid overwhelming the API
            await new Promise((resolve) => setTimeout(resolve, 1000));
          } catch (error) {
            console.error(
              "Error processing delayed AI response for message:",
              userMessage.id,
              error
            );
            setTyping(conversationId, false);
          }
        }
      };

      // Then, process AI responses for newly delivered user messages
      // Use setTimeout to ensure state updates have been processed
      setTimeout(() => {
        processDelayedAIResponses();
      }, 100);
    }

    // Update the ref for next comparison
    prevWifiEnabledRef.current = wifiEnabled;
  }, [
    wifiEnabled,
    markPendingMessagesAsDelivered,
    addMessage,
    setTyping,
    whatsApp.messages.allIds,
    whatsApp.contacts.byId,
    whatsApp.messages.byConversation,
    whatsApp.messages.byId,
  ]); // Simplified dependencies - functions are stable from store

  const background =
    customWallpaper ||
    (isMobile
      ? BACKGROUND_IPHONE
      : operatingSystem === "mac"
      ? BACKGROUND_MAC
      : BACKGROUND_WIN);

  const padding = operatingSystem === "mac" ? "md:pt-10" : "md:pb-10";

  return (
    <div
      className={`w-screen h-screen bg-gray-900 relative overflow-hidden bg-cover bg-center bg-no-repeat ${padding}`}
      style={{
        backgroundImage: `url(${background})`,
      }}
      onClick={() => {
        console.log("clicked");
        unlockClickOnSomethingAchievement();
      }}
    >
      <MenubarLayout />

      {/* MAIN CONTENT  mobile = col, tablet = row , desktop = row*/}
      <div className="flex flex-col md:flex-row h-full w-full gap-10 p-10">
        {/* WIDGETS */}
        <Widgets />

        {/* DESKTOP NODES */}
        <div className="flex-1 min-h-0 w-full">
          <DirectoryContent windowId={desktopRootId} nodeId={desktopRootId} />
          {/* <ListView nodes={nodes} /> */}
        </div>

        {openWindows.map((window) => (
          <ResizableWindow key={window.windowId} window={window} />
        ))}

        <Dock />
      </div>
    </div>
  );
};
