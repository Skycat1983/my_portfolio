interface ModernLoaderProps {
  loadingProgress: number;
  isLoadingPaused: boolean;
}

export const ModernLoader = ({
  loadingProgress,
  isLoadingPaused,
}: ModernLoaderProps) => (
  <div className="absolute bottom-16 left-6 right-6">
    <div className="bg-black bg-opacity-80 backdrop-blur-sm p-6 rounded-2xl border border-gray-700">
      <div className="text-white text-xl font-bold mb-6 text-center">
        Loading GTAVI
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
        <div
          className={`bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 h-full rounded-full transition-all duration-300 ${
            isLoadingPaused
              ? "animate-pulse bg-gradient-to-r from-red-500 to-orange-500"
              : ""
          }`}
          style={{ width: `${loadingProgress}%` }}
        />
      </div>
      <div className="text-gray-300 text-sm mt-4 text-center">
        {isLoadingPaused ? (
          <span className="text-red-400 animate-pulse">
            Performance issues detected...
          </span>
        ) : (
          `${Math.round(loadingProgress)}% • Optimizing shaders and textures`
        )}
      </div>
    </div>
  </div>
);
