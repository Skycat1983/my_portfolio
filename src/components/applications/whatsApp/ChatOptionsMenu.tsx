import React from "react";
import type { ContactId } from "./types";
import { useNewStore } from "@/hooks/useStore";
import { selectContact } from "@/store/contentState/whatsAppSelectors";
import { isAIContact } from "./types";

interface ChatOptionsMenuProps {
  contactId: ContactId;
  onArchive: (contactId: ContactId) => void;
  onUnarchive: (contactId: ContactId) => void;
}

export const ChatOptionsMenu: React.FC<ChatOptionsMenuProps> = ({
  contactId,
  onArchive,
  onUnarchive,
}) => {
  const contact = useNewStore((state) => selectContact(state, contactId));

  if (!contact || !isAIContact(contact)) return null;

  return (
    <div className="relative">
      <button
        className="text-white hover:text-gray-200"
        aria-label="Chat options"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
        <div className="py-1">
          <button
            onClick={() =>
              (contact.archived ? onUnarchive : onArchive)(contactId)
            }
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            {contact.archived ? "Unarchive chat" : "Archive chat"}
          </button>
          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Clear chat
          </button>
          <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
            Delete chat
          </button>
        </div>
      </div>
    </div>
  );
};
