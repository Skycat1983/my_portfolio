import type { SetState } from "../hooks/useNewStore";

interface BrowserState {
  isBrowserOpen: boolean;
  browserZIndex: number;
  url: string;
  lastNavigatedUrl: string;
  addressPosition: number;
  completeUrl: boolean;
  currentPage: "start" | "incomplete" | "complete";
  predefinedAddress: string;
}

interface BrowserActions {
  openBrowser: () => void;
  closeBrowser: () => void;
  focusBrowser: () => void;
  setUrl: (url: string) => void;
  setAddressPosition: (position: number) => void;
  setCompleteUrl: (complete: boolean) => void;
  setCurrentPage: (page: "start" | "incomplete" | "complete") => void;
  updateUrl: (inputLength: number) => void;
  resetBrowser: () => void;
  navigateToUrl: () => void;
  prevUrl: () => void;
}

export type BrowserSlice = BrowserState & BrowserActions;

export const createBrowserSlice = (set: SetState): BrowserSlice => ({
  // Browser state
  isBrowserOpen: false,
  browserZIndex: 1000,
  url: "",
  lastNavigatedUrl: "",
  addressPosition: 0,
  completeUrl: false,
  currentPage: "start",
  predefinedAddress: "www.how-is-he-still-unemployed.com",

  // Browser actions
  openBrowser: () => {
    console.log("openBrowser in browserSlice: opening browser");
    set((state) => ({
      isBrowserOpen: true,
      currentPage: "start",
      browserZIndex: state.nextZIndex,
      nextZIndex: state.nextZIndex + 1,
    }));
  },

  focusBrowser: () => {
    console.log("focusBrowser in browserSlice: focusing browser");
    set((state) => ({
      browserZIndex: state.nextZIndex,
      nextZIndex: state.nextZIndex + 1,
    }));
  },

  closeBrowser: () => {
    console.log("closeBrowser in browserSlice: closing browser");
    set({
      isBrowserOpen: false,
      url: "",
      lastNavigatedUrl: "",
      addressPosition: 0,
      completeUrl: false,
      currentPage: "start",
    });
  },

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

  setCompleteUrl: (complete: boolean) => {
    console.log(
      "setCompleteUrl in browserSlice: setting complete to",
      complete
    );
    set({ completeUrl: complete });
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
      lastNavigatedUrl: "",
      addressPosition: 0,
      completeUrl: false,
      currentPage: "start",
    });
  },

  navigateToUrl: () => {
    console.log(
      "navigateToUrl in browserSlice: navigating based on URL completeness"
    );
    set((state) => {
      // Store the current URL as the last navigated URL
      const lastNavigatedUrl = state.url;

      // If URL is empty, show start page
      if (state.addressPosition === 0 || state.url === "") {
        return {
          completeUrl: false,
          currentPage: "start",
          lastNavigatedUrl: "",
        };
      }

      // If URL is complete, show complete page
      const isComplete =
        state.addressPosition >= state.predefinedAddress.length;
      return {
        completeUrl: isComplete,
        currentPage: isComplete ? "complete" : "incomplete",
        lastNavigatedUrl,
      };
    });
  },

  prevUrl: () => {
    console.log("goBack in browserSlice: going back to previous page");
    set((state) => {
      // If on incomplete page, go back to start
      if (state.currentPage === "incomplete") {
        return {
          currentPage: "start",
          url: "",
          lastNavigatedUrl: "",
          addressPosition: 0,
          completeUrl: false,
        };
      }
      // Add more back navigation logic as needed
      return {};
    });
  },
});
