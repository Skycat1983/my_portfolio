// Central theme configuration for consistent styling across the app
export const theme = {
  colors: {
    // Base colors
    white: "#ffffff",
    black: "#000000",

    // Gray scale
    gray: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
    },

    // Status colors
    red: {
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626",
    },

    green: {
      400: "#4ade80",
      500: "#10b981",
      600: "#059669",
    },

    blue: {
      500: "#3b82f6",
      600: "#2563eb",
    },

    yellow: {
      500: "#eab308",
    },
  },

  // Component-specific styles
  button: {
    base: {
      transition: "all 0.2s ease",
      cursor: "pointer",
      outline: "none",
      border: "none",
    },

    // Window control buttons
    windowControl: {
      mobile: {
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        backgroundColor: "#ffffff",
        border: "1px solid #d1d5db",
        color: "#374151",
        fontSize: "0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      },

      navigation: {
        backgroundColor: "#ffffff",
        border: "1px solid #d1d5db",
        color: "#374151",
        padding: "8px",
        borderRadius: "4px",
      },

      navigationDisabled: {
        backgroundColor: "#f3f4f6",
        border: "1px solid #e5e7eb",
        color: "#9ca3af",
      },
    },

    // Browser toolbar buttons
    browserToolbar: {
      base: {
        padding: "8px",
        backgroundColor: "#ffffff",
        border: "1px solid #d1d5db",
        color: "#374151",
        borderRadius: "8px",
        fontSize: "0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },

      hover: {
        backgroundColor: "#f3f4f6",
      },
    },

    // Hover states
    hover: {
      close: {
        backgroundColor: "#ef4444",
        borderColor: "#ef4444",
        color: "#ffffff",
      },

      navigation: {
        backgroundColor: "#f3f4f6",
      },
    },
  },

  // Input styles
  input: {
    base: {
      backgroundColor: "#ffffff",
      border: "1px solid #d1d5db",
      color: "#374151",
      borderRadius: "4px",
      outline: "none",
    },
  },

  // Icon styles
  icon: {
    base: {
      color: "inherit",
    },
  },
} as const;

// CSS-in-JS helper function
export const createButtonStyle = (
  variant: "mobile" | "navigation",
  state: "normal" | "disabled" | "hover" = "normal"
) => {
  const base = theme.button.base;

  if (variant === "mobile") {
    return {
      ...base,
      ...theme.button.windowControl.mobile,
    };
  }

  if (variant === "navigation") {
    const navigationStyle =
      state === "disabled"
        ? theme.button.windowControl.navigationDisabled
        : theme.button.windowControl.navigation;

    return {
      ...base,
      ...navigationStyle,
    };
  }

  return base;
};

// Browser toolbar button helper
export const createBrowserToolbarStyle = (isMobile: boolean = false) => {
  const base = theme.button.browserToolbar.base;

  if (isMobile) {
    return {
      ...base,
      width: "44px",
      height: "44px",
    };
  }

  return base;
};

// Browser toolbar hover class (for CSS)
export const browserToolbarHoverClass = "hover:bg-theme-gray-100";

export default theme;
