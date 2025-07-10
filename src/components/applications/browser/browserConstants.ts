import { CaptchaPage } from "./fake_pages/CaptchaPage";
import { QueuePage } from "./fake_pages/QueuePage";

export const WEB_PAGE_REGISTRY: Record<string, React.ComponentType> = {
  "www.how-is-he-still-unemployed.com": QueuePage,
  "www.captcha.com": CaptchaPage,
};

export const PREDEFINED_ADDRESS = "www.how-is-he-still-unemployed.com";

// Bookmark metadata for the dropdown menu
export interface BookmarkItem {
  url: string;
  name: string;
  description: string;
}

export const BOOKMARKS: BookmarkItem[] = [
  {
    url: "www.how-is-he-still-unemployed.com",
    name: "Job Queue",
    description: "Check your position in the hiring queue",
  },
  {
    url: "www.captcha.com",
    name: "CAPTCHA Test",
    description: "Verify you are human with interactive challenges",
  },
];
