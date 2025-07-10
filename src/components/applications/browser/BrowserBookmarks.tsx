import { Bookmark } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BOOKMARKS, type BookmarkItem } from "./browserConstants";
import type { WindowType } from "@/types/storeTypes";
import { useNewStore } from "@/hooks/useStore";

interface BrowserBookmarksProps {
  windowId: WindowType["windowId"];
  onBookmarkSelect: (bookmark: BookmarkItem) => void;
}

export const BrowserBookmarks = ({
  windowId,
  onBookmarkSelect,
}: BrowserBookmarksProps) => {
  const window = useNewStore((s) => s.getWindowById(windowId));
  // When maximized, we need to account for the +1000 zIndex boost
  const baseZIndex = window?.zIndex || 0;
  const menuZ = window?.isMaximized ? baseZIndex + 1001 : baseZIndex + 1;

  console.log("BROWSER_BOOKMARKS_DEBUG: Window state:", {
    windowId,
    isMaximized: window?.isMaximized,
    baseZIndex: window?.zIndex,
    calculatedMenuZ: menuZ,
  });

  const handleBookmarkClick = (bookmark: BookmarkItem) => {
    console.log(
      "BROWSER_DEBUG handleBookmarkClick in BrowserBookmarks.tsx: ",
      bookmark
    );
    onBookmarkSelect(bookmark);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="p-2 hover:bg-neutral-400 rounded-md transition-colors cursor-pointer"
        style={{ zIndex: menuZ }}
        tabIndex={0}
        aria-label="Open bookmarks menu"
        onClick={(e) => {
          console.log("BROWSER_BOOKMARKS_DEBUG: Button clicked, menuZ:", menuZ);
          e.stopPropagation();
        }}
      >
        <Bookmark className="h-5 w-5 text-neutral-700" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 bg-neutral-900"
        style={{ zIndex: menuZ }}
      >
        <DropdownMenuLabel>Bookmarks</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {BOOKMARKS.map((bookmark) => (
          <DropdownMenuItem
            key={bookmark.url}
            onClick={() => handleBookmarkClick(bookmark)}
            className="cursor-pointer p-3"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleBookmarkClick(bookmark);
              }
            }}
          >
            <div className="flex flex-col gap-1">
              <div className="font-medium text-sm">{bookmark.name}</div>
              <div className="text-xs text-neutral-500">
                {bookmark.description}
              </div>
              <div className="text-xs text-neutral-400">{bookmark.url}</div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
