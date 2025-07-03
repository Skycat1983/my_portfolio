import { useRef, useEffect } from "react";
import { useNewStore } from "@/hooks/useStore";
import { useTerminalState } from "./hooks/useTerminalState";
import { useTerminalHistory } from "./hooks/useTerminalHistory";
import { useTerminalKeyboard } from "./hooks/useTerminalKeyboard";
import { terminalStyles, getLineColor } from "./Terminal.styles";
import { createTerminalCommands } from "./terminalCommands";
import type { WindowContentProps } from "@/types/storeTypes";

export const TerminalContent = ({ windowId }: WindowContentProps) => {
  const {
    lines,
    currentInput,
    setCurrentInput,
    clearLines,
    addCommandLine,
    addOutputLine,
  } = useTerminalState();

  const { addCommand, navigateHistory, clearHistory } =
    useTerminalHistory(windowId);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Store hooks
  const currentWorkingDirectory = useNewStore((s) => s.currentWorkingDirectory);
  const setCurrentWorkingDirectory = useNewStore(
    (s) => s.setCurrentWorkingDirectory
  );
  const terminalLs = useNewStore((s) => s.terminalLs);
  const terminalCd = useNewStore((s) => s.terminalCd);
  const terminalPwd = useNewStore((s) => s.terminalPwd);
  const terminalCat = useNewStore((s) => s.terminalCat);
  const rootId = useNewStore((s) => s.rootId);
  const getNodeById = useNewStore((s) => s.getNodeByID);

  // Initialize working directory to root if not set
  useEffect(() => {
    if (!currentWorkingDirectory && rootId) {
      console.log(
        "TerminalContent: initializing working directory to root",
        rootId
      );
      setCurrentWorkingDirectory(rootId);
    }
  }, [currentWorkingDirectory, rootId, setCurrentWorkingDirectory]);

  // Create commands with current state
  const commands = createTerminalCommands({
    currentWorkingDirectory,
    setCurrentWorkingDirectory,
    terminalLs,
    terminalCd,
    terminalPwd,
    terminalCat,
    clearLines,
    clearHistory,
  });

  const executeCommand = (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Add to history
    addCommand(trimmed);

    // Add command line to terminal
    addCommandLine(trimmed);

    // Parse command and arguments
    const parts = trimmed.split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Execute command
    if (command in commands) {
      const result = commands[command](args);
      if (result) {
        addOutputLine(result);
      }
    } else {
      addOutputLine(`zsh: command not found: ${command}`, "error");
    }
  };

  const { handleKeyDown } = useTerminalKeyboard({
    currentInput,
    setCurrentInput,
    executeCommand,
    navigateHistory,
  });

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  // Auto-scroll to bottom when new content is added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      ref={terminalRef}
      onClick={handleTerminalClick}
      className="h-full w-full cursor-text bg-neutral-900"
      style={terminalStyles.container}
    >
      {/* Terminal output */}
      {lines.map((line, index) => (
        <div
          key={index}
          style={{
            ...terminalStyles.line,
            color: getLineColor(line.type),
          }}
        >
          {line.content}
        </div>
      ))}

      {/* Current input line */}
      <div style={terminalStyles.prompt}>
        <span>
          {currentWorkingDirectory
            ? getNodeById(currentWorkingDirectory)?.label || "~"
            : "~"}
          $
        </span>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={terminalStyles.input}
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
};
