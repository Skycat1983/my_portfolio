import { Search, Download, Bookmark } from "lucide-react";
import { useNewStore } from "@/hooks/useStore";
import { useEffect, useState } from "react";
import { theme } from "@/styles/theme";

interface StartPageProps {
  onFocusAddressBar?: () => void;
  onOpenBookmarks?: () => void;
}

export const StartPage = ({
  onFocusAddressBar,
  onOpenBookmarks,
}: StartPageProps) => {
  const themeMode = useNewStore((s) => s.theme);
  const textColor = theme.colors[themeMode].text.primary;
  const bgColor = theme.colors[themeMode].background.primary;
  const [isDownloading, setIsDownloading] = useState(false);
  // const [downloadCount, setDownloadCount] = useState(0);
  const downloadEgg = useNewStore((s) => s.downloadEgg);
  // const focusWindow = useNewStore((s) => s.focusWindow);
  const openWindow = useNewStore((s) => s.openWindow);
  const incrementEggsDownloadedAchievement = useNewStore(
    (s) => s.incrementEggsDownloadedAchievement
  );
  const getNodeByID = useNewStore((s) => s.getNodeByID);
  // const eggsDownloaded = useNewStore((s) => s.eggsDownloaded);
  // const { downloadEgg, ensureDownloadsFolder, openDirectory } = useNewStore();

  useEffect(() => {
    if (isDownloading) {
      const timer = setTimeout(() => {
        downloadEgg();
        incrementEggsDownloadedAchievement();
        // setDownloadCount((prev) => prev + 1);
        setIsDownloading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isDownloading, downloadEgg, incrementEggsDownloadedAchievement]);

  const handleDownload = () => {
    if (!isDownloading) {
      setIsDownloading(true);
    }
  };

  const handleSearchClick = () => {
    console.log("STARTPAGE_DEBUG handleSearchClick called");
    if (onFocusAddressBar) {
      onFocusAddressBar();
    }
  };

  const handleFeaturedClick = () => {
    console.log("STARTPAGE_DEBUG handleFeaturedClick called");
    if (onOpenBookmarks) {
      onOpenBookmarks();
    }
  };

  const buttonLabel = isDownloading ? "Downloading..." : `Download Egg`;

  return (
    <div
      className="max-w-4xl mx-auto p-8"
      style={{
        color: textColor,
        backgroundColor: bgColor,
      }}
    >
      {/* Header */}
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-3xl font-bold text-white">Welcome to Internet</h1>
        </div>
        <p className="text-lg text-white">
          Your gateway to explore, learn, & discover
        </p>
      </header>

      {/* Navigation cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div
          onClick={handleSearchClick}
          className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 hover:shadow-md transition-shadow cursor-pointer"
          tabIndex={0}
          aria-label="Focus on search bar"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleSearchClick();
            }
          }}
        >
          <Search className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Search</h3>
          <p className="text-gray-600 text-sm">
            Click here to focus on the search bar.
          </p>
        </div>

        <div
          onClick={handleFeaturedClick}
          className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200 hover:shadow-md transition-shadow cursor-pointer"
          tabIndex={0}
          aria-label="Open bookmarks"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleFeaturedClick();
            }
          }}
        >
          <Bookmark className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Bookmarks
          </h3>
          <p className="text-gray-600 text-sm">
            Click here to view your favourite sites.
          </p>
        </div>

        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const downloadsNode = getNodeByID("downloads");
            console.log("STARTPAGE_DEBUG downloadsNode", downloadsNode);
            if (downloadsNode && downloadsNode.type === "directory") {
              console.log("STARTPAGE_DEBUG opening window for downloadsNode");
              openWindow(downloadsNode);
            }
          }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200 hover:shadow-md transition-shadow cursor-pointer"
        >
          <Download className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Downloads
          </h3>
          <p className="text-gray-600 text-sm">
            Access your downloads and manage your files
          </p>
        </div>
      </div>

      {/* Main content */}
      <main className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Latest News</h2>

        <div className="space-y-4">
          <article className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Infinite Egg Glitch Discovered.
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Security researchers have discovered an alarming glitch in our
              desktop environment that allows users to download unlimited eggs.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>1 hour ago</span>
                <span>Easter Eggs</span>
              </div>
            </div>
          </article>
          <article className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Global Egg Market Volatility Hits All-Time High
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Trading platforms temporarily suspend shell asset transactions
              amid fears of infinite supply undermining scarcity models.
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>2 hours ago</span>
              <span>Market News</span>
            </div>
          </article>

          <article className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Storage Infrastructures Overwhelmed
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Cloud providers report unprecedented pressure as recursive egg
              generation exploits trigger uncontrolled expansion of object
              volumes, forcing priority downgrades on medical and research data
              clusters.
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>1 day ago</span>
              <span>Tech News</span>
            </div>
          </article>

          <article className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Infinite Egg FAQ
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              What We Know, What You Can Do, Where to Access It
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>1 hour ago</span>
                <span>Easter Eggs</span>
              </div>
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className={`${
                  isDownloading
                    ? "bg-blue-400"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white text-xs px-3 py-1 rounded transition-colors`}
              >
                {buttonLabel}
              </button>
            </div>
          </article>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm">
        <p>© 2024 Example.com - Your trusted web companion</p>
        <div className="flex items-center justify-center gap-4 mt-2">
          <a href="#" className="hover:text-gray-700 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-gray-700 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-gray-700 transition-colors">
            Support
          </a>
        </div>
      </footer>
    </div>
  );
};
