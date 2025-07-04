import React from "react";
import type { WindowContentProps } from "@/types/storeTypes";
import { WhatsAppMain } from "./WhatsAppMain";

export const WhatsAppWrapper: React.FC<WindowContentProps> = ({ window }) => {
  console.log("WhatsAppWrapper: rendering for window", window?.windowId);

  return (
    <div className="h-full w-full">
      <WhatsAppMain />
    </div>
  );
};
