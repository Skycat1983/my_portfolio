import React from "react";
import { FinderNavigation } from "./FinderNavigation";
import { Input } from "../../ui/input";
import { FinderView } from "./FinderView";

type FinderHeaderProps = {
  zIndex: number;
  view: "icons" | "list" | "columns";
  onChangeView: (v: "icons" | "list" | "columns") => void;
};

export const FinderHeader: React.FC<FinderHeaderProps> = ({
  zIndex,
  view,
  onChangeView,
}) => {
  return (
    <div className="flex flex-row h-auto items-center justify-between gap-10 bg-black p-2">
      <FinderNavigation windowId="finder" />

      <Input placeholder="Search" />

      <FinderView view={view} onChangeView={onChangeView} zIndex={zIndex} />
    </div>
  );
};
