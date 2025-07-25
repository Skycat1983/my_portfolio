import BankingPage from "./fake_pages/banking/BankingPage";
import { QueuePage } from "./fake_pages/QueuePage";
import { InceptionPage } from "./fake_pages/InceptionPage";
import { RickAndMorty } from "./fake_pages/rickAndMorty.tsx/RickAndMorty";

export const WEB_PAGE_REGISTRY: Record<string, React.ComponentType> = {
  "www.how-can-i-hire-heron.com": QueuePage,
  "www.banking.com": BankingPage,
  "https://incredible-taffy-f3a474.netlify.app/": InceptionPage,
  "https://rickandmortyapi.com/": RickAndMorty,
};

export const PREDEFINED_ADDRESS = "www.how-can-i-hire-heron.com";

// Bookmark metadata for the dropdown menu
export interface BookmarkItem {
  url: string;
  name: string;
  description: string;
}

export const BOOKMARKS: BookmarkItem[] = [
  {
    url: "www.how-can-i-hire-heron.com",
    name: "Hire Heron",
    description: "The official website for hiring Heron",
  },
  {
    url: "www.banking.com",
    name: "Banking",
    description: "Check your bank balance and make a transfer",
  },
  {
    url: "https://incredible-taffy-f3a474.netlify.app/",
    name: "Portfolio-hub",
    description: "Heron's Portfolio",
  },
  {
    url: "https://rickandmortyapi.com/",
    name: "Rick and Morty",
    description: "Rick and Morty API",
  },
];
