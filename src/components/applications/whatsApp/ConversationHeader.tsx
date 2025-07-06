import { Phone } from "lucide-react";

interface ConversationHeaderProps {
  conversationId: string;
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  conversationId,
}) => {
  //   const conversationDetails = selectConversationDetails(whatsApp, conversationId);
  //   console.log("WhatsApp: ConversationHeader conversationDetails", conversationDetails);
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center">
        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-xl mr-3">
          {/* {preview.avatar} */}
          <Phone size={20} />
        </div>
      </div>
    </div>
  );
};
