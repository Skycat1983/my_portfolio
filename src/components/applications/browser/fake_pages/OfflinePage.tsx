import { RefreshCw, WifiOff } from "lucide-react";

export const OfflinePage: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-50 p-8">
      {/* Icon */}
      <WifiOff className="w-16 h-16 text-gray-400 mb-6" />

      {/* Headline */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">You’re Offline</h1>

      {/* Explanation */}
      <p className="text-center text-gray-600 mb-6 max-w-sm">
        You need to be connected to the internet in order to use the internet.
      </p>

      {/* Retry Button (no-op) */}
      <button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition-colors">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span>Retry</span>
      </button>
    </div>
  );
};
