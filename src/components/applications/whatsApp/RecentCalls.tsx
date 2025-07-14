import { Separator } from "@/components/ui/separator";
import type { CallHistoryItem } from "@/constants/whatsAppData";
import { useNewStore } from "@/hooks/useStore";
import { Phone, PhoneMissed } from "lucide-react";
import type { ConversationId } from "./types";

interface RecentCallsProps {
  onPhoneCall: (
    avatar: string,
    name: string,
    phoneNumber: string,
    conversationId: ConversationId
  ) => void;
}

export const RecentCalls: React.FC<RecentCallsProps> = ({ onPhoneCall }) => {
  const callHistory = useNewStore((state) => state.whatsApp.callHistory);
  const getTextColour = (historyItem: CallHistoryItem) => {
    if (historyItem.duration > 0) {
      return "text-gray-500";
    } else {
      return "text-red-500";
    }
  };
  return (
    <div className="flex flex-col gap-4 p-4">
      {callHistory.map((call) => (
        <>
          <div
            key={call.id}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() =>
              onPhoneCall(
                call.avatar,
                call.caller.name,
                call.caller.phoneNumber,
                call.conversationId
              )
            }
          >
            <div className="w-10 h-10 rounded-full bg-gray-200">
              <img
                src={call.avatar}
                alt={call.caller.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <div className={`text-md font-medium ${getTextColour(call)}`}>
                {call.caller.name}
              </div>
              <div className="text-xs text-gray-500">{call.timestamp}</div>
            </div>
            <div className="ml-auto">
              {call.duration > 0 ? (
                <Phone className="text-green-500" />
              ) : (
                <PhoneMissed className="text-red-500" />
              )}
            </div>
          </div>
          <Separator className="my-2 mx-4 bg-gray-700" />
        </>
      ))}
    </div>
  );
};
