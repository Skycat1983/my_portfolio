import React, { useEffect } from "react";
import type { WindowContentProps } from "@/types/storeTypes";
import { useNewStore } from "@/hooks/useStore";
import { createInitialState } from "../../../constants/whatsAppData";
import { WhatsAppMain } from "./WhatsAppMain";

export const WhatsAppWrapper: React.FC<WindowContentProps> = ({ windowId }) => {
  // const setNetworkStatus = useNewStore((state) => state.setNetworkStatus);
  const initialiseWhatsApp = useNewStore((state) => state.initializeWhatsApp);
  const isInitialized = useNewStore((state) => state.whatsApp.isInitialized);
  const whatsApp = useNewStore((state) => state.whatsApp);
  console.log("whatsAppState", whatsApp);

  // Initialize store with initial state if not already initialized
  useEffect(() => {
    if (!isInitialized) {
      console.log("whatsAppState not initialized, creating initial state...");
      const initialState = createInitialState();
      initialiseWhatsApp(initialState);
    } else {
      console.log("whatsAppState already initialized, skipping initialization");
    }
  }, [isInitialized, initialiseWhatsApp]);

  // Monitor network status
  // useEffect(() => {
  //   const handleOnline = () => setNetworkStatus(true);
  //   const handleOffline = () => setNetworkStatus(false);

  //   window.addEventListener("online", handleOnline);
  //   window.addEventListener("offline", handleOffline);

  //   // Set initial network status
  //   setNetworkStatus(navigator.onLine);

  //   return () => {
  //     window.removeEventListener("online", handleOnline);
  //     window.removeEventListener("offline", handleOffline);
  //   };
  // }, [setNetworkStatus]);

  return (
    <div className="h-full w-full bg-gray-100">
      {isInitialized ? (
        <WhatsAppMain windowId={windowId} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};
