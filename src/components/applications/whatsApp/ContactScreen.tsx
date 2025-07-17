import React, { useState } from "react";
import { useNewStore } from "@/hooks/useStore";
import { ArrowLeft, Edit2, Save, X } from "lucide-react";
import type { ContactId } from "./types";

interface ContactScreenProps {
  contactId: ContactId;
  onBack: () => void;
  onViewProfile?: (contactId: ContactId) => void;
}

export const ContactScreen: React.FC<ContactScreenProps> = ({
  contactId,
  onBack,
}) => {
  const whatsApp = useNewStore((state) => state.whatsApp);
  const updateContact = useNewStore((state) => state.updateContact);

  const contact = whatsApp.contacts.byId[contactId];
  const isUserSelf = contactId === "user_self";

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(contact?.name || "");

  if (!contact) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-lg mb-4">Contact not found</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleStartEdit = () => {
    setEditedName(contact.name);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editedName.trim() && editedName !== contact.name) {
      updateContact(contactId, { name: editedName.trim() });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedName(contact.name);
    setIsEditing(false);
  };

  return (
    <div className="h-full bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-3 hover:text-gray-300 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-semibold">
            {isUserSelf ? "My Profile" : "Contact Info"}
          </h2>
        </div>

        {/* Edit button - only show for non-user contacts */}
        {!isUserSelf && !isEditing && (
          <button
            onClick={handleStartEdit}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Edit contact"
          >
            <Edit2 size={18} />
          </button>
        )}

        {/* Save/Cancel buttons when editing */}
        {isEditing && (
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors text-green-400"
              aria-label="Save changes"
            >
              <Save size={18} />
            </button>
            <button
              onClick={handleCancelEdit}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors text-red-400"
              aria-label="Cancel editing"
            >
              <X size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Profile Content */}
      <div className="p-6">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 rounded-full bg-gray-600 flex items-center justify-center mb-4">
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          {/* Name */}
          <div className="text-center">
            {isEditing ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="text-2xl font-semibold bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter name"
                autoFocus
              />
            ) : (
              <h1 className="text-2xl font-semibold mb-2">{contact.name}</h1>
            )}
          </div>
        </div>

        {/* Contact Details */}
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-2">
              Phone Number
            </h3>
            <p className="text-lg">{contact.phoneNumber}</p>
          </div>

          {contact.type === "ai" && (
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Type</h3>
              <p className="text-lg">AI Contact</p>
            </div>
          )}

          {contact.type === "user" && (
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Type</h3>
              <p className="text-lg">User Profile</p>
            </div>
          )}

          {contact.type === "ai" && (
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Status</h3>
              <p className="text-lg">
                {whatsApp.contacts.archived.has(contactId)
                  ? "Archived"
                  : "Active"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
