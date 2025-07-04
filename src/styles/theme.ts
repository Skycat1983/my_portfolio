// Central theme configuration for consistent styling across the app

// Theme type definitions
type ColorValue = string;

interface ColorSet {
  primary: ColorValue;
  secondary: ColorValue;
  tertiary: ColorValue;
  accent: ColorValue;
}

interface ThemeColors {
  background: ColorSet;
  text: ColorSet;
  border: ColorSet;
  surface: ColorSet;
}

interface StatusColors {
  error: {
    light: ColorValue;
    dark: ColorValue;
  };
  success: {
    light: ColorValue;
    dark: ColorValue;
  };
  warning: {
    light: ColorValue;
    dark: ColorValue;
  };
  info: {
    light: ColorValue;
    dark: ColorValue;
  };
}

interface ThemeConfig {
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
    status: StatusColors;
  };
  button: {
    base: {
      transition: string;
      cursor: string;
      outline: string;
      border: string;
    };

    // Window control buttons
    windowControl: {
      mobile: {
        width: string;
        height: string;
        borderRadius: string;
        backgroundColor: string;
        border: string;
        color: string;
        fontSize: string;
        display: string;
        alignItems: string;
        justifyContent: string;
        boxShadow: string;
      };

      navigation: {
        backgroundColor: string;
        border: string;
        color: string;
        padding: string;
        borderRadius: string;
      };

      navigationDisabled: {
        backgroundColor: string;
        border: string;
        color: string;
      };
    };

    // Browser toolbar buttons
    browserToolbar: {
      base: {
        padding: string;
        backgroundColor: string;
        border: string;
        color: string;
        borderRadius: string;
        fontSize: string;
        display: string;
        alignItems: string;
        justifyContent: string;
      };

      hover: {
        backgroundColor: string;
      };
    };

    // Hover states
    hover: {
      close: {
        backgroundColor: string;
        borderColor: string;
        color: string;
      };

      navigation: {
        backgroundColor: string;
      };
    };
  };
  input: {
    base: {
      outline: string;
      borderRadius: string;
    };
  };
  icon: {
    base: {
      color: string;
    };
  };
}

export const theme: ThemeConfig = {
  colors: {
    // Semantic color tokens
    light: {
      // Background colors
      background: {
        primary: "#ffffff",
        secondary: "#f3f4f6",
        tertiary: "#e5e7eb",
        accent: "#f0f9ff",
      },
      // Text colors
      text: {
        primary: "#111827",
        secondary: "#374151",
        tertiary: "#6b7280",
        accent: "#2563eb",
      },
      // Border colors
      border: {
        primary: "#e5e7eb",
        secondary: "#d1d5db",
        tertiary: "#9ca3af",
        accent: "#93c5fd",
      },
      // Surface/Card colors
      surface: {
        primary: "#ffffff",
        secondary: "#f9fafb",
        tertiary: "#f3f4f6",
        accent: "#f0f9ff",
      },
    },
    dark: {
      // Background colors
      background: {
        primary: "#111827",
        secondary: "#1f2937",
        tertiary: "#374151",
        accent: "#1e3a8a",
      },
      // Text colors
      text: {
        primary: "#f9fafb",
        secondary: "#e5e7eb",
        tertiary: "#9ca3af",
        accent: "#60a5fa",
      },
      // Border colors
      border: {
        primary: "#374151",
        secondary: "#4b5563",
        tertiary: "#6b7280",
        accent: "#2563eb",
      },
      // Surface/Card colors
      surface: {
        primary: "#1f2937",
        secondary: "#374151",
        tertiary: "#4b5563",
        accent: "#1e3a8a",
      },
    },

    // Status colors (theme independent)
    status: {
      error: {
        light: "#ef4444",
        dark: "#dc2626",
      },
      success: {
        light: "#10b981",
        dark: "#059669",
      },
      warning: {
        light: "#f59e0b",
        dark: "#d97706",
      },
      info: {
        light: "#3b82f6",
        dark: "#2563eb",
      },
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
      outline: "none",
      borderRadius: "4px",
    },
  },

  // Icon styles
  icon: {
    base: {
      color: "inherit",
    },
  },
} as const;

// Type helpers for theme
export type ThemeMode = "light" | "dark";
export type ThemeCategory = keyof ThemeColors;
export type ThemeSubCategory = keyof ColorSet;

// Helper function to get theme-aware color
export const getThemeColor = (
  mode: ThemeMode,
  category: ThemeCategory,
  subcategory: ThemeSubCategory
): ColorValue => {
  return theme.colors[mode][category][subcategory];
};

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

// Browser toolbar hover class (for CSS)

export default theme;
