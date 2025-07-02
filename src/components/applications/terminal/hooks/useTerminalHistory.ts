import { useState } from "react";
import { useNewStore } from "@/hooks/useStore";

export const useTerminalHistory = () => {
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const addToHistory = useNewStore((s) => s.addToHistory);

  const addCommand = (command: string) => {
    setCommandHistory((prev) => [...prev, command]);
    addToHistory(command);
    setHistoryIndex(-1);
  };

  const navigateHistory = (direction: "up" | "down"): string => {
    if (direction === "up" && commandHistory.length > 0) {
      const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
      setHistoryIndex(newIndex);
      return commandHistory[commandHistory.length - 1 - newIndex];
    } else if (direction === "down") {
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        return commandHistory[commandHistory.length - 1 - newIndex];
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        return "";
      }
    }
    return "";
  };

  return {
    commandHistory,
    historyIndex,
    addCommand,
    navigateHistory,
  };
};
