import type { CSSProperties } from "react";

export const terminalStyles = {
  container: {
    fontFamily:
      "SF Mono, Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
    fontSize: "13px",
    lineHeight: "1.4",
    padding: "20px",
    overflowY: "auto" as const,
  } as CSSProperties,

  prompt: {
    display: "flex",
    alignItems: "center",
    color: "#00ff00",
    fontFamily:
      "SF Mono, Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
    fontSize: "13px",
    lineHeight: "1.4",
  } as CSSProperties,

  input: {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#00ff00",
    fontFamily: "inherit",
    fontSize: "inherit",
    flex: 1,
    marginLeft: "8px",
  } as CSSProperties,

  line: {
    marginBottom: "2px",
    whiteSpace: "pre-wrap" as const,
    wordBreak: "break-word" as const,
  } as CSSProperties,
};

export const getLineColor = (type: "command" | "output" | "error"): string => {
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
