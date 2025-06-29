import type { BaseStoreState, SetState } from "../../types/storeTypes";

export type OperatingSystem = "mac" | "windows";

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

export interface ScreenDimensions {
  width: number;
  height: number;
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export interface SystemState {
  operatingSystem: OperatingSystem;
  wifiEnabled: boolean;
  screenDimensions: ScreenDimensions;
}

interface SystemActions {
  toggleOS: () => void;
  toggleWifi: () => void;
  setScreenDimensions: (width: number, height: number) => void;
}

export type SystemSlice = SystemState & SystemActions;

// Breakpoint constants - following common conventions
const BREAKPOINTS = {
  sm: 640, // Mobile landscape / small tablet
  md: 768, // Tablet portrait
  lg: 1024, // Tablet landscape / small laptop
  xl: 1280, // Desktop
} as const;

const getBreakpoint = (width: number): Breakpoint => {
  if (width < BREAKPOINTS.sm) return "xs";
  if (width < BREAKPOINTS.md) return "sm";
  if (width < BREAKPOINTS.lg) return "md";
  if (width < BREAKPOINTS.xl) return "lg";
  return "xl";
};

const getDeviceTypes = (_width: number, breakpoint: Breakpoint) => ({
  isMobile: breakpoint === "xs" || breakpoint === "sm",
  isTablet: breakpoint === "md",
  isDesktop: breakpoint === "lg" || breakpoint === "xl",
});

export const createSystemSlice = (
  set: SetState<BaseStoreState>
): SystemSlice => ({
  operatingSystem: "mac",
  wifiEnabled: true,
  screenDimensions: {
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
    breakpoint:
      typeof window !== "undefined" && window.innerWidth < 640 ? "xs" : "xl",
    isMobile: typeof window !== "undefined" ? window.innerWidth < 640 : false,
    isTablet:
      typeof window !== "undefined"
        ? window.innerWidth >= 640 && window.innerWidth < 1024
        : false,
    isDesktop: typeof window !== "undefined" ? window.innerWidth >= 1024 : true,
  },
  toggleOS: () =>
    set((state) => ({
      operatingSystem: state.operatingSystem === "mac" ? "windows" : "mac",
    })),
  toggleWifi: () =>
    set((state) => ({
      wifiEnabled: !state.wifiEnabled,
    })),
  setScreenDimensions: (width: number, height: number) => {
    const breakpoint = getBreakpoint(width);
    const deviceTypes = getDeviceTypes(width, breakpoint);

    set({
      screenDimensions: {
        width,
        height,
        breakpoint,
        ...deviceTypes,
      },
    });
  },
});
