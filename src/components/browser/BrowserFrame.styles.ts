export const createBrowserFrameStyles = (
  windowSize: { w: number; h: number },
  titleBarHeight: number,
  isDragging: boolean,
  hoverCursor: string
) => {
  const windowStyle: React.CSSProperties = {
    position: "relative",
    width: windowSize.w,
    height: windowSize.h,
    background: "#ffffff",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    touchAction: "none",
    cursor: isDragging ? "move" : hoverCursor,
    overflow: "hidden",
  };

  const headerStyle: React.CSSProperties = {
    height: titleBarHeight,
    background: "linear-gradient(to bottom, #f9fafb, #f3f4f6)",
    borderBottom: "1px solid #e5e7eb",
    cursor: isDragging ? "move" : "default",
    display: "flex",
    flexDirection: "column",
    userSelect: "none",
    padding: "0",
  };

  const topBarStyle: React.CSSProperties = {
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 12px",
    background: "linear-gradient(to bottom, #f9fafb, #f3f4f6)",
  };

  const addressBarStyle: React.CSSProperties = {
    height: "40px",
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    gap: "8px",
  };

  const contentStyle: React.CSSProperties = {
    height: windowSize.h - titleBarHeight,
    background: "#ffffff",
    overflow: "auto",
  };

  return {
    windowStyle,
    headerStyle,
    topBarStyle,
    addressBarStyle,
    contentStyle,
  };
};

export const browserButtonStyles: React.CSSProperties = {
  height: "24px",
  width: "24px",
  padding: "4px",
  borderRadius: "4px",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#6b7280",
};

export const urlInputStyle: React.CSSProperties = {
  flex: 1,
  height: "28px",
  padding: "0 12px 0 32px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "13px",
  background: "#ffffff",
  outline: "none",
  userSelect: "text",
  color: "#000",
};
