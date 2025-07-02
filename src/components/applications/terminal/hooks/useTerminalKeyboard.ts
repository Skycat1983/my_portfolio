import { useCallback } from "react";

interface UseTerminalKeyboardProps {
  currentInput: string;
  setCurrentInput: (value: string) => void;
  executeCommand: (command: string) => void;
  navigateHistory: (direction: "up" | "down") => string;
}

export const useTerminalKeyboard = ({
  currentInput,
  setCurrentInput,
  executeCommand,
  navigateHistory,
}: UseTerminalKeyboardProps) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        executeCommand(currentInput);
        setCurrentInput("");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const historyCommand = navigateHistory("up");
        if (historyCommand !== "") {
          setCurrentInput(historyCommand);
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const historyCommand = navigateHistory("down");
        setCurrentInput(historyCommand);
      }
    },
    [currentInput, setCurrentInput, executeCommand, navigateHistory]
  );

  return {
    handleKeyDown,
  };
};
