import { useState, useRef, useEffect } from "react";
import { useNewStore } from "../../hooks/useStore";

interface TerminalLine {
  type: "command" | "output" | "error";
  content: string;
  timestamp?: Date;
}

export const TerminalContent = () => {
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
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Get store functions
  const {
    currentWorkingDirectory,
    setCurrentWorkingDirectory,
    addToHistory,
    terminalLs,
    terminalCd,
    terminalPwd,
    terminalCat,
    rootId,
    getNode,
  } = useNewStore();

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

  // Enhanced commands that work with the file system
  const commands: { [key: string]: (args: string[]) => string } = {
    help: () => `Available File System Commands:
  ls [path]        - List directory contents
  cd <path>        - Change directory
  pwd              - Print working directory
  cat <file>       - Display file contents
  mkdir <name>     - Create directory (coming soon)
  touch <name>     - Create file (coming soon)
  rm <name>        - Remove file/directory (coming soon)
  mv <src> <dest>  - Move/rename (coming soon)
  cp <src> <dest>  - Copy file/directory (coming soon)
  find <pattern>   - Search for files (coming soon)

System Commands:
  help     - Show this help message
  clear    - Clear the terminal
  whoami   - Display current user
  date     - Show current date and time
  echo     - Echo text back`,

    clear: () => {
      setLines([]);
      return "";
    },

    // File system commands using new store
    ls: (args: string[]) => {
      if (!currentWorkingDirectory) {
        return "Error: working directory not initialized";
      }
      const result = terminalLs(args[0], currentWorkingDirectory);
      return result.output;
    },

    cd: (args: string[]) => {
      if (args.length === 0) {
        return "cd: missing argument";
      }
      if (!currentWorkingDirectory) {
        return "Error: working directory not initialized";
      }
      const result = terminalCd(args[0], currentWorkingDirectory);
      if (result.success && result.newDir) {
        setCurrentWorkingDirectory(result.newDir);
      }
      return result.output;
    },

    pwd: () => {
      if (!currentWorkingDirectory) {
        return "Error: working directory not initialized";
      }
      const result = terminalPwd(currentWorkingDirectory);
      return result.output;
    },

    cat: (args: string[]) => {
      if (args.length === 0) {
        return "cat: missing file operand";
      }
      if (!currentWorkingDirectory) {
        return "Error: working directory not initialized";
      }
      const result = terminalCat(args[0], currentWorkingDirectory);
      return result.output;
    },

    mkdir: () => {
      return "mkdir: not implemented yet";
    },

    touch: () => {
      return "touch: not implemented yet";
    },

    rm: () => {
      return "rm: not implemented yet";
    },

    mv: () => {
      return "mv: not implemented yet";
    },

    cp: () => {
      return "cp: not implemented yet";
    },

    find: () => {
      return "find: not implemented yet";
    },

    // System commands (unchanged)
    whoami: () => "developer",

    date: () => new Date().toString(),

    echo: (args: string[]) => args.join(" "),
  };

  const executeCommand = (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Add command to history (both local and store)
    setCommandHistory((prev) => [...prev, trimmed]);
    addToHistory(trimmed);
    setHistoryIndex(-1);

    // Add command line to terminal
    const newLines: TerminalLine[] = [
      ...lines,
      {
        type: "command",
        content: `$ ${trimmed}`,
        timestamp: new Date(),
      },
    ];

    // Parse command and arguments
    const parts = trimmed.split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Execute command
    if (command in commands) {
      const result = commands[command](args);
      if (result) {
        newLines.push({
          type: "output",
          content: result,
          timestamp: new Date(),
        });
      }
    } else {
      newLines.push({
        type: "error",
        content: `zsh: command not found: ${command}`,
        timestamp: new Date(),
      });
    }

    setLines(newLines);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(currentInput);
      setCurrentInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput("");
      }
    }
  };

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

  const promptStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    color: "#00ff00",
    fontFamily:
      "SF Mono, Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
    fontSize: "13px",
    lineHeight: "1.4",
  };

  const inputStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#00ff00",
    fontFamily: "inherit",
    fontSize: "inherit",
    flex: 1,
    marginLeft: "8px",
  };

  const getLineColor = (type: TerminalLine["type"]) => {
    switch (type) {
      case "command":
        return "#00ff00"; // Green for commands
      case "error":
        return "#ff5555"; // Red for errors
      case "output":
        return "#ffffff"; // White for output
      default:
        return "#ffffff";
    }
  };

  return (
    <div
      ref={terminalRef}
      onClick={handleTerminalClick}
      className="h-full w-full cursor-text"
      style={{
        fontFamily:
          "SF Mono, Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
        fontSize: "13px",
        lineHeight: "1.4",
        padding: "8px",
        overflowY: "auto",
      }}
    >
      {/* Terminal output */}
      {lines.map((line, index) => (
        <div
          key={index}
          style={{
            color: getLineColor(line.type),
            marginBottom: "2px",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {line.content}
        </div>
      ))}

      {/* Current input line */}
      <div style={promptStyle}>
        <span>
          {currentWorkingDirectory
            ? getNode(currentWorkingDirectory)?.label || "~"
            : "~"}
          $
        </span>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={inputStyle}
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
};
