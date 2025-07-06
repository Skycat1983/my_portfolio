import React from "react";
import type { ContactId } from "./types";
import { useNewStore } from "@/hooks/useStore";
import { selectArchivedConversationPreviews } from "@/store/contentState/whatsAppSelectors";
import { ArrowLeft } from "lucide-react";

interface ArchiveScreenProps {
  onBack: () => void;
  onSelectContact: (contactId: ContactId) => void;
  onUnarchive: (contactId: ContactId) => void;
}

export const ArchiveScreen: React.FC<ArchiveScreenProps> = ({
  onBack,
  onSelectContact,
  onUnarchive,
}) => {
  const whatsApp = useNewStore((state) => state.whatsApp);
  const archivedContacts = selectArchivedConversationPreviews(whatsApp);
  // const archivedContacts = useNewStore((state) =>
  //   selectArchivedContacts(state)
  // );

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-900 text-white py-3 px-4 flex items-center">
        <button
          onClick={onBack}
          className="mr-3 hover:text-gray-300 transition-colors"
          aria-label="Back to chat list"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-semibold">Archived</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {archivedContacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center p-4 hover:bg-gray-700 cursor-pointer border-b border-gray-700"
            onClick={() => onSelectContact(contact.id)}
          >
            <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-xl mr-3">
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-semibold text-white">{contact.name}</h3>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-400">
                  {contact.systemInstruction.slice(0, 50)}...
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUnarchive(contact.id);
                  }}
                  className="text-green-500 hover:text-green-400 text-sm transition-colors"
                >
                  Unarchive
                </button>
              </div>
            </div>
          </div>
        ))}

        {archivedContacts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="text-4xl mb-4">📦</div>
            <p>No archived chats</p>
          </div>
        )}
      </div>
    </div>
  );
};
