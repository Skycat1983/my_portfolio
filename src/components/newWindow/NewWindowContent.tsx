import type { Window } from "../../types/storeTypes";

export const NewWindowContent = ({ window }: { window: Window }) => {
  const className = "w-full h-full border-[10px] border-orange-500 cursor-grab";
  return <div className={className}>{window.nodeType}</div>;
};
