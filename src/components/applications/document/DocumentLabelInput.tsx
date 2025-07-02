import React from "react";
import { Input } from "@/components/ui/input";

interface DocumentLabelInputProps {
  label: string;
  onLabelChange: (label: string) => void;
  onModified: () => void;
}

export const DocumentLabelInput = ({
  label,
  onLabelChange,
  onModified,
}: DocumentLabelInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onLabelChange(e.target.value);
    onModified();
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
        Name:
      </label>
      <Input
        value={label}
        onChange={handleChange}
        placeholder="Document name"
        className="w-[140px] text-gray-700 bg-white border-gray-300"
        title="Document name"
      />
    </div>
  );
};
