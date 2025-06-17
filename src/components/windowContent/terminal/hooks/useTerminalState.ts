import { useState } from "react";

interface TerminalLine {
  type: "command" | "output" | "error";
  content: string;
  timestamp?: Date;
}

export const useTerminalState = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      type: "output",
      content: "Last login: " + new Date().toLocaleString(),
      timestamp: new Date(),
    },
    {
      type: "output",
      content: "Welcome to Portfolio Terminal",
      timestamp: new Date(),
    },
    {
      type: "output",
      content: "Type 'help' for available commands",
      timestamp: new Date(),
    },
  ]);

  const [currentInput, setCurrentInput] = useState("");

  const addLines = (newLines: TerminalLine[]) => {
    setLines((prev) => [...prev, ...newLines]);
  };

  const clearLines = () => {
    setLines([]);
  };

  const addCommandLine = (command: string) => {
    const commandLine: TerminalLine = {
      type: "command",
      content: `$ ${command}`,
      timestamp: new Date(),
    };
    addLines([commandLine]);
    return commandLine;
  };

  const addOutputLine = (
    content: string,
    type: "output" | "error" = "output"
  ) => {
    const outputLine: TerminalLine = {
      type,
      content,
      timestamp: new Date(),
    };
    addLines([outputLine]);
    return outputLine;
  };

  return {
    lines,
    currentInput,
    setCurrentInput,
    addLines,
    clearLines,
    addCommandLine,
    addOutputLine,
  };
};

export type { TerminalLine };
