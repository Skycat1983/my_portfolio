import React, { useState, useRef, useEffect } from "react";
import { Archive, ArchiveRestore, MoreVertical } from "lucide-react";
import type { Chat } from "./types";

interface ChatOptionsMenuProps {
  chat: Chat;
  onArchive: (chatId: string) => void;
  onUnarchive: (chatId: string) => void;
}

export const ChatOptionsMenu: React.FC<ChatOptionsMenuProps> = ({
  chat,
  onArchive,
  onUnarchive,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleArchiveAction = () => {
    if (chat.isArchived) {
      onUnarchive(chat.id);
    } else {
      onArchive(chat.id);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="text-white hover:text-gray-200 p-1"
        aria-label="Chat options"
      >
        <MoreVertical className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px] z-50">
          <button
            onClick={handleArchiveAction}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-3 text-gray-700"
          >
            {chat.isArchived ? (
              <>
                <ArchiveRestore className="w-4 h-4" />
                <span>Unarchive chat</span>
              </>
            ) : (
              <>
                <Archive className="w-4 h-4" />
                <span>Archive chat</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
