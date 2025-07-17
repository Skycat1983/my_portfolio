import { useEffect, useRef } from "react";
import { useNewStore } from "@/hooks/useStore";
import {
  selectConversationsWithSentAIMessages,
  selectSentAIMessagesByConversation,
} from "../selectors/messageSelectors";

/**
 * Custom hook to handle staggered message delivery when WiFi comes back online.
 * Automatically processes pending and sent messages with realistic timing and typing indicators.
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
        // Step 1: Instantly deliver all pending user messages
        markUserMessagesAsDelivered();

        // Step 2: Get current state of conversations with sent AI messages
        const conversationsWithSentAI =
          selectConversationsWithSentAIMessages(whatsApp);

        if (conversationsWithSentAI.length === 0) {
          console.log("No sent AI messages to process");
          return;
        }

        // Step 3: Process each conversation with staggered timing
        const sentAIMessagesByConv =
          selectSentAIMessagesByConversation(whatsApp);

        for (const conversationId of conversationsWithSentAI) {
          const sentMessages = sentAIMessagesByConv[conversationId] || [];

          for (const message of sentMessages) {
            // Start typing indicator
            setTyping(conversationId, true);

            // Wait 2-3 seconds to simulate AI thinking
            await new Promise((resolve) =>
              setTimeout(resolve, 2000 + Math.random() * 1000)
            );

            // Deliver the message and stop typing
            markAIMessageAsDelivered(message.id);
            setTyping(conversationId, false);

            // Brief pause between messages in same conversation
            await new Promise((resolve) => setTimeout(resolve, 500));
          }

          // Longer pause between different conversations
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error("Error in staggered delivery processing:", error);
      } finally {
        processingRef.current = false;
      }
    };

    // Handle offline → online transition (existing logic)
    if (!prevWifiEnabled && wifiEnabled) {
      // Use setTimeout to ensure state updates have been processed
      setTimeout(() => {
        processStaggeredDelivery();
      }, 100);
    }

    // Handle online → offline transition (new logic)
    if (prevWifiEnabled && !wifiEnabled) {
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
