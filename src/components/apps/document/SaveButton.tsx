import React from "react";
import { Save } from "lucide-react";
import { Button } from "../../ui/button";

interface SaveButtonProps {
  isModified: boolean;
  onSave: () => void;
  windowWidth: number;
}

export const SaveButton = ({
  isModified,
  onSave,
  windowWidth,
}: SaveButtonProps) => {
  return (
    <Button
      onClick={onSave}
      disabled={!isModified}
      size="sm"
      className={
        isModified
          ? "bg-blue-500 text-white hover:bg-blue-600"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }
      title="Save Document"
    >
      <Save size={16} className="" />
      <span className={`${windowWidth > 1000 ? "block" : "hidden"}`}>Save</span>
    </Button>
  );
};
