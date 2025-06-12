import type { DirectoryEntry } from "../../types/nodeTypes";

interface BrowserProps {
  onClose: () => void;
  nodeId: DirectoryEntry["id"];
}

export const Browser = ({ onClose, nodeId }: BrowserProps) => {
  return <div>Browser</div>;
};
