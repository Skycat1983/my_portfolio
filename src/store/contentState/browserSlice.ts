import type { SetState } from "../../types/storeTypes";
import type { NewDesktopStore } from "../../hooks/useStore";

interface BrowserState {
  url: string;
  addressPosition: number;
  currentPage: "start" | "incomplete" | "complete";
  predefinedAddress: string;
  browserHistory: string[];
  browserHistoryIndex: number;
}

interface BrowserActions {
  setUrl: (url: string) => void;
  setAddressPosition: (position: number) => void;
  setCurrentPage: (page: "start" | "incomplete" | "complete") => void;
  updateUrl: (inputLength: number) => void;
  resetBrowser: () => void;
  navigateToUrl: () => void;
  prevUrl: () => void;
  nextUrl: () => void;
}

export type BrowserSlice = BrowserState & BrowserActions;

export const createBrowserSlice = (
  set: SetState<NewDesktopStore>
): BrowserSlice => ({
  // Browser state
  url: "",
  addressPosition: 0,
  currentPage: "start",
  predefinedAddress: "www.how-is-he-still-unemployed.com",
  browserHistory: [],
  browserHistoryIndex: -1,

  setUrl: (url: string) => {
    console.log("setUrl in browserSlice: setting url to", url);
    set({ url });
  },

  setAddressPosition: (position: number) => {
    console.log(
      "setAddressPosition in browserSlice: setting position to",
      position
    );
    set({ addressPosition: position });
  },

  setCurrentPage: (page: "start" | "incomplete" | "complete") => {
    console.log("setCurrentPage in browserSlice: setting page to", page);
    set({ currentPage: page });
  },

  updateUrl: (inputLength: number) => {
    console.log(
      "updateUrl in browserSlice: updating url with input length",
      inputLength
    );
    set((state) => {
      const predefinedAddress = state.predefinedAddress;
      if (inputLength <= predefinedAddress.length) {
        return {
          addressPosition: inputLength,
          url: predefinedAddress.substring(0, inputLength),
        };
      }
      return {};
    });
  },

  resetBrowser: () => {
    console.log("resetBrowser in browserSlice: resetting browser state");
    set({
      url: "",
      addressPosition: 0,
      currentPage: "start",
      browserHistory: [],
      browserHistoryIndex: -1,
    });
  },

  navigateToUrl: () => {
    console.log(
      "navigateToUrl in browserSlice: navigating based on URL completeness"
    );
    set((state) => {
      const currentUrl = state.url;

      // If URL is empty, show start page and don't add to history
      if (state.addressPosition === 0 || currentUrl === "") {
        return {
          currentPage: "start",
        };
      }

      // Determine page type based on URL completeness
      const isComplete =
        state.addressPosition >= state.predefinedAddress.length;
      const newPage = isComplete ? "complete" : "incomplete";

      // Add current URL to history (remove any forward history if we're in the middle)
      const newHistory = [
        ...state.browserHistory.slice(0, state.browserHistoryIndex + 1),
        currentUrl,
      ];
      const newHistoryIndex = newHistory.length - 1;

      return {
        currentPage: newPage,
        browserHistory: newHistory,
        browserHistoryIndex: newHistoryIndex,
      };
    });
  },

  prevUrl: () => {
    console.log("prevUrl in browserSlice: going back in history");
    set((state) => {
      // Can't go back if no history or at the beginning
      if (state.browserHistory.length === 0 || state.browserHistoryIndex <= 0) {
        // If we're on incomplete/complete page and no history, go to start
        if (state.currentPage !== "start") {
          return {
            currentPage: "start",
            url: "",
            addressPosition: 0,
          };
        }
        return {};
      }

      const newHistoryIndex = state.browserHistoryIndex - 1;
      const previousUrl = state.browserHistory[newHistoryIndex];

      // Determine page type based on previous URL
      let newPage: "start" | "incomplete" | "complete" = "start";
      let newAddressPosition = 0;

      if (previousUrl) {
        const isComplete = previousUrl.length >= state.predefinedAddress.length;
        newPage = isComplete ? "complete" : "incomplete";
        newAddressPosition = previousUrl.length;
      }

      return {
        url: previousUrl || "",
        addressPosition: newAddressPosition,
        currentPage: newPage,
        browserHistoryIndex: newHistoryIndex,
      };
    });
  },

  nextUrl: () => {
    console.log("nextUrl in browserSlice: going forward in history");
    set((state) => {
      // Can't go forward if no history or at the end
      if (
        state.browserHistory.length === 0 ||
        state.browserHistoryIndex >= state.browserHistory.length - 1
      ) {
        return {};
      }

      const newHistoryIndex = state.browserHistoryIndex + 1;
      const nextUrl = state.browserHistory[newHistoryIndex];

      // Determine page type based on next URL
      let newPage: "start" | "incomplete" | "complete" = "start";
      let newAddressPosition = 0;

      if (nextUrl) {
        const isComplete = nextUrl.length >= state.predefinedAddress.length;
        newPage = isComplete ? "complete" : "incomplete";
        newAddressPosition = nextUrl.length;
      }

      return {
        url: nextUrl || "",
        addressPosition: newAddressPosition,
        currentPage: newPage,
        browserHistoryIndex: newHistoryIndex,
      };
    });
  },
});
