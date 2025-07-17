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
import { useDropdownZIndex } from "@/components/window/hooks/useNextWindowZIndex";
import { forwardRef, useImperativeHandle, useState } from "react";

interface BrowserBookmarksProps {
  windowId: WindowType["windowId"];
  onBookmarkSelect: (bookmark: BookmarkItem) => void;
  isMobile: boolean;
}

export interface BrowserBookmarksRef {
  openDropdown: () => void;
}

export const BrowserBookmarks = forwardRef<
  BrowserBookmarksRef,
  BrowserBookmarksProps
>(
  (
    {
      // windowId,
      onBookmarkSelect,
      isMobile,
    },
    ref
  ) => {
    const nextZIndex = useDropdownZIndex();
    const [isOpen, setIsOpen] = useState(false);

    // Expose the openDropdown function to parent components
    useImperativeHandle(ref, () => ({
      openDropdown: () => {
        setIsOpen(true);
      },
    }));

    const handleBookmarkClick = (bookmark: BookmarkItem) => {
      onBookmarkSelect(bookmark);
      setIsOpen(false); // Close dropdown after selection
    };

    const bookMarks = BOOKMARKS.filter((bookmark) => {
      if (isMobile) {
        return bookmark.name !== "Portfolio-hub";
      }
      return true;
    });

    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger
          className="p-2 hover:bg-neutral-400 rounded-md transition-colors cursor-pointer"
          style={{ zIndex: nextZIndex }}
          tabIndex={0}
          aria-label="Open bookmarks menu"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Bookmark className="h-5 w-5 text-neutral-700" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-64 bg-neutral-900"
          style={{ zIndex: nextZIndex }}
        >
          <DropdownMenuLabel>Bookmarks</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {bookMarks.map((bookmark) => (
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
  }
);

BrowserBookmarks.displayName = "BrowserBookmarks";
