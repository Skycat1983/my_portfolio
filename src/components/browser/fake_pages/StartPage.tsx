import { Globe, Search, Star, Download } from "lucide-react";

export const StartPage = () => (
  <div className="max-w-4xl mx-auto">
    {/* Header */}
    <header className="mb-8 text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Globe className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to Example.com
        </h1>
      </div>
      <p className="text-lg text-gray-600">
        Your gateway to the internet - Explore, Learn, Discover
      </p>
    </header>

    {/* Navigation cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 hover:shadow-md transition-shadow cursor-pointer">
        <Search className="w-8 h-8 text-blue-600 mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Search</h3>
        <p className="text-gray-600 text-sm">
          Find anything you're looking for with our powerful search engine
        </p>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200 hover:shadow-md transition-shadow cursor-pointer">
        <Star className="w-8 h-8 text-green-600 mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Featured</h3>
        <p className="text-gray-600 text-sm">
          Discover trending topics and featured content curated for you
        </p>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200 hover:shadow-md transition-shadow cursor-pointer">
        <Download className="w-8 h-8 text-purple-600 mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Downloads</h3>
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
            Technology Update: New Features Released
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            We're excited to announce several new features that will enhance
            your browsing experience. These updates include improved security,
            faster loading times, and a more intuitive interface.
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>2 hours ago</span>
            <span>Tech News</span>
          </div>
        </article>

        <article className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            User Guide: Making the Most of Your Browser
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            Learn about keyboard shortcuts, extension management, and privacy
            settings to get the most out of your browsing experience.
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>1 day ago</span>
            <span>Tutorials</span>
          </div>
        </article>

        <article className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Privacy & Security: Your Data Matters
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            Understanding our commitment to your privacy and the measures we
            take to keep your data secure while browsing.
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>3 days ago</span>
            <span>Security</span>
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
