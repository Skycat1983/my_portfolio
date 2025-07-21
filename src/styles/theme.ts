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

interface CommodityColors {
  WTI: {
    light: ColorValue;
    dark: ColorValue;
  };
  BRENT: {
    light: ColorValue;
    dark: ColorValue;
  };
  NATURAL_GAS: {
    light: ColorValue;
    dark: ColorValue;
  };
  COPPER: {
    light: ColorValue;
    dark: ColorValue;
  };
  ALUMINUM: {
    light: ColorValue;
    dark: ColorValue;
  };
  CORN: {
    light: ColorValue;
    dark: ColorValue;
  };
  WHEAT: {
    light: ColorValue;
    dark: ColorValue;
  };
  SUGAR: {
    light: ColorValue;
    dark: ColorValue;
  };
  COFFEE: {
    light: ColorValue;
    dark: ColorValue;
  };
  ALL_COMMODITIES: {
    light: ColorValue;
    dark: ColorValue;
  };
}

interface ThemeConfig {
  colors: {
    gray: {
      50: ColorValue;
      100: ColorValue;
      200: ColorValue;
      300: ColorValue;
      400: ColorValue;
      500: ColorValue;
      600: ColorValue;
    };
    light: ThemeColors;
    dark: ThemeColors;
    status: StatusColors;
    commodities: CommodityColors;
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
    gray: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
    },
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

    // Commodity-specific colors (theme-aware)
    commodities: {
      WTI: {
        light: "#4a5568", // Dark gray for light mode
        dark: "#a0aec0", // Light gray for dark mode
      },
      BRENT: {
        light: "#2d3748", // Darker gray for light mode
        dark: "#cbd5e0", // Lighter gray for dark mode
      },
      NATURAL_GAS: {
        light: "#2c5282", // Dark blue for light mode
        dark: "#63b3ed", // Light blue for dark mode
      },
      COPPER: {
        light: "#c05621", // Dark orange for light mode
        dark: "#fed7aa", // Light orange for dark mode
      },
      ALUMINUM: {
        light: "#718096", // Medium gray for light mode
        dark: "#e2e8f0", // Very light gray for dark mode
      },
      CORN: {
        light: "#d69e2e", // Dark yellow for light mode
        dark: "#faf089", // Light yellow for dark mode
      },
      WHEAT: {
        light: "#92400e", // Dark brown for light mode
        dark: "#fcd34d", // Light golden for dark mode
      },
      SUGAR: {
        light: "#9ca3af", // Medium gray for light mode
        dark: "#f9fafb", // Almost white for dark mode
      },
      COFFEE: {
        light: "#744210", // Dark brown for light mode
        dark: "#d2b48c", // Light tan for dark mode
      },
      ALL_COMMODITIES: {
        light: "#059669", // Use success color for light mode
        dark: "#10b981", // Use success color for dark mode
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
export type CommodityType = keyof CommodityColors;

// Helper function to get theme-aware color
export const getThemeColor = (
  mode: ThemeMode,
  category: ThemeCategory,
  subcategory: ThemeSubCategory
): ColorValue => {
  return theme.colors[mode][category][subcategory];
};

// Helper function to get commodity color for current theme
export const getCommodityColor = (
  mode: ThemeMode,
  commodity: CommodityType
): ColorValue => {
  return theme.colors.commodities[commodity][mode];
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
