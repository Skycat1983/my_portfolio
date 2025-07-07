import { useEffect, useRef } from "react";
import { useNewStore } from "@/hooks/useStore";
import {
  selectConversationsWithPendingAIMessages,
  selectPendingAIMessagesByConversation,
} from "../selectors/conversationSelectors";

/**
 * Custom hook to handle staggered message delivery when WiFi comes back online.
 * Automatically processes pending messages with realistic timing and typing indicators.
 * Also tracks lastSeen timestamp when going offline.
 *
 * @param wifiEnabled - Current WiFi enabled state
 */
export const useStaggeredMessageDelivery = (wifiEnabled: boolean) => {
  // Track previous wifi state to detect offline → online transitions
  const prevWifiEnabledRef = useRef<boolean>(wifiEnabled);
  // Prevent concurrent processing
  const processingRef = useRef<boolean>(false);

  // WhatsApp state and actions
  const whatsApp = useNewStore((s) => s.whatsApp);
  const markUserMessagesAsDelivered = useNewStore(
    (s) => s.markUserMessagesAsDelivered
  );
  const markAIMessageAsDelivered = useNewStore(
    (s) => s.markAIMessageAsDelivered
  );
  const setTyping = useNewStore((s) => s.setTyping);
  const updateLastSeenTimestamp = useNewStore((s) => s.updateLastSeenTimestamp);

  // Handle wifi state transitions
  useEffect(() => {
    const prevWifiEnabled = prevWifiEnabledRef.current;

    // Function to process staggered AI message delivery
    const processStaggeredDelivery = async () => {
      if (processingRef.current) return; // Prevent multiple simultaneous processes
      processingRef.current = true;

      try {
        console.log("Starting staggered delivery processing...");

        // Step 1: Instantly deliver all user messages
        markUserMessagesAsDelivered();

        // Step 2: Get current state of conversations with pending AI messages
        const conversationsWithPendingAI =
          selectConversationsWithPendingAIMessages(whatsApp);
        console.log(
          "Conversations with pending AI messages:",
          conversationsWithPendingAI
        );

        if (conversationsWithPendingAI.length === 0) {
          console.log("No pending AI messages to process");
          return;
        }

        // Step 3: Process each conversation with staggered timing
        const pendingAIMessagesByConv =
          selectPendingAIMessagesByConversation(whatsApp);

        for (const conversationId of conversationsWithPendingAI) {
          const pendingMessages = pendingAIMessagesByConv[conversationId] || [];
          console.log(
            `Processing ${pendingMessages.length} messages for conversation ${conversationId}`
          );

          for (const message of pendingMessages) {
            // Start typing indicator
            setTyping(conversationId, true);
            console.log(`Set typing true for conversation ${conversationId}`);

            // Wait 2-3 seconds to simulate AI thinking
            await new Promise((resolve) =>
              setTimeout(resolve, 2000 + Math.random() * 1000)
            );

            // Deliver the message and stop typing
            markAIMessageAsDelivered(message.id);
            setTyping(conversationId, false);
            console.log(`Delivered message ${message.id} and set typing false`);

            // Brief pause between messages in same conversation
            await new Promise((resolve) => setTimeout(resolve, 500));
          }

          // Longer pause between different conversations
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        console.log("Staggered delivery processing completed");
      } catch (error) {
        console.error("Error in staggered delivery processing:", error);
      } finally {
        processingRef.current = false;
      }
    };

    // Handle offline → online transition (existing logic)
    if (!prevWifiEnabled && wifiEnabled) {
      console.log("WiFi came back online - starting staggered delivery");

      // Use setTimeout to ensure state updates have been processed
      setTimeout(() => {
        processStaggeredDelivery();
      }, 100);
    }

    // Handle online → offline transition (new logic)
    if (prevWifiEnabled && !wifiEnabled) {
      console.log("WiFi went offline - updating lastSeen timestamp");
      updateLastSeenTimestamp();
    }

    // Update the ref for next comparison
    prevWifiEnabledRef.current = wifiEnabled;
  }, [
    wifiEnabled,
    markUserMessagesAsDelivered,
    markAIMessageAsDelivered,
    setTyping,
    updateLastSeenTimestamp,
    whatsApp,
  ]);

  // This hook handles everything internally, no return value needed
  // Could optionally return processStaggeredDelivery for manual triggering if needed
};
