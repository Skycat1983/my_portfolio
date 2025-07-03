export interface CommandResult {
  output: string;
  success?: boolean;
  newDir?: string;
}

export interface TerminalCommandsProps {
  currentWorkingDirectory: string | null;
  setCurrentWorkingDirectory: (dir: string) => void;
  terminalLs: (path: string | undefined, cwd: string) => CommandResult;
  terminalCd: (path: string, cwd: string) => CommandResult;
  terminalPwd: (cwd: string) => CommandResult;
  terminalCat: (filename: string, cwd: string) => CommandResult;
  clearLines: () => void;
  clearHistory: () => boolean;
}

export const createTerminalCommands = (props: TerminalCommandsProps) => {
  const {
    currentWorkingDirectory,
    setCurrentWorkingDirectory,
    terminalLs,
    terminalCd,
    terminalPwd,
    terminalCat,
    clearLines,
    clearHistory,
  } = props;

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
  history  - Show command history (use -c to clear)
  whoami   - Display current user
  date     - Show current date and time
  echo     - Echo text back`,

    clear: () => {
      clearLines();
      return "";
    },

    history: (args: string[]) => {
      if (args.includes("-c") || args.includes("--clear")) {
        clearHistory();
        return "Command history cleared.";
      }
      return "Command history functionality integrated with terminal history system.";
    },

    // File system commands using store
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

    // System commands
    whoami: () => "developer",

    date: () => new Date().toString(),

    echo: (args: string[]) => args.join(" "),
  };

  return commands;
};
