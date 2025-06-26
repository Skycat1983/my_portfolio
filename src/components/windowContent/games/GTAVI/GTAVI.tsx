import {
  GTA6_LOADING,
  GTA6_SCREEN,
  WARNING,
  GTA6_LOGO,
} from "../../../../constants/images";
import { useEffect, useState } from "react";
import { useNewStore } from "../../../../hooks/useStore";
import type { WindowType } from "../../../../types/storeTypes";

type GamePhase = "loading" | "running" | "crashed";

const GTAVI = ({ windowId }: { windowId: WindowType["windowId"] }) => {
  const operatingSystem = useNewStore((state) => state.operatingSystem);
  const closeWindow = useNewStore((state) => state.closeWindow);

  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [gamePhase, setGamePhase] = useState<GamePhase>("loading");
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [isLoadingPaused, setIsLoadingPaused] = useState<boolean>(false);

  const company = operatingSystem === "windows" ? "Microsoft" : "Apple";
  const message =
    operatingSystem === "windows"
      ? "GTAVI.exe has stopped working"
      : "GTAVI quit unexpectedly";

  const buttonText = operatingSystem === "windows" ? "Close" : "Ignore";

  const closeGTA6 = () => {
    closeWindow(windowId);
    setShowErrorModal(false);
  };

  // Handle irregular loading progress
  useEffect(() => {
    if (gamePhase !== "loading") return;

    const interval = setInterval(() => {
      if (isLoadingPaused) return;

      setLoadingProgress((prevProgress) => {
        // Random behaviors for irregular loading
        const randomBehavior = Math.random();

        if (randomBehavior < 0.1 && prevProgress > 10) {
          // 10% chance to pause loading
          setIsLoadingPaused(true);
          setTimeout(() => {
            setIsLoadingPaused(false);
          }, Math.random() * 2000 + 500); // Pause for 0.5-2.5 seconds
          return prevProgress;
        }

        if (randomBehavior < 0.05 && prevProgress > 20) {
          // 5% chance to go backwards slightly (memory leak simulation)
          return Math.max(0, prevProgress - Math.random() * 5);
        }

        // Variable increment sizes for stuttering effect
        let increment;
        if (randomBehavior < 0.3) {
          increment = Math.random() * 0.5; // Very slow progress
        } else if (randomBehavior < 0.6) {
          increment = Math.random() * 8 + 1; // Fast burst
        } else {
          increment = Math.random() * 3 + 1; // Normal progress
        }

        const newProgress = prevProgress + increment;

        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setGamePhase("running");
          }, 500);
          return 100;
        }

        return newProgress;
      });
    }, Math.random() * 200 + 50); // Variable interval timing 50-250ms

    return () => clearInterval(interval);
  }, [gamePhase, isLoadingPaused]);

  // Handle game crash after running phase
  useEffect(() => {
    if (gamePhase !== "running") return;

    const crashTimer = setTimeout(() => {
      console.log("gamePhase transitioning to crashed in GTA6 component");
      setGamePhase("crashed");

      setTimeout(() => {
        setShowErrorModal(true);
      }, 1500);
    }, 1500);

    return () => clearTimeout(crashTimer);
  }, [gamePhase]);

  // Modern Loader Component
  const ModernLoader = () => (
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

  // Error Modal Component
  const ErrorModal = () => (
    <div
      className="bg-gray-500 rounded-lg shadow-xl w-80"
      style={{
        background: "linear-gradient(145deg, #6b7280 0%, #4b5563 100%)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="relative p-6 text-center">
        {/* Warning triangle - more prominent */}
        <div className="w-16 h-16 mx-auto mb-4 relative">
          <div className="w-16 h-16 rounded-lg flex items-center justify-center">
            <img src={WARNING} alt="Warning" className="w-full h-full" />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-white mb-4">{message}</h3>

        <p className="text-sm text-gray-200 mb-6 leading-relaxed px-2">
          Click Ignore to exit. Click Report to send a detailed crash report to{" "}
          {company}.
        </p>

        <div className="space-y-3">
          <button
            onClick={closeGTA6}
            className="w-full py-3 bg-gray-400 bg-opacity-30 text-white rounded-lg text-sm font-medium hover:bg-gray-300 hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors border border-cyan-400"
          >
            {buttonText}
          </button>
          <button
            onClick={closeGTA6}
            className="w-full py-3 bg-gray-400 bg-opacity-50 text-white rounded-lg text-sm font-medium hover:bg-gray-300 hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
          >
            Report
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`w-full h-full z-10 ${
        // Busy cursor starts when game begins running (before crash)
        gamePhase === "running" || gamePhase === "crashed"
          ? "cursor-wait"
          : "cursor-default"
      }`}
    >
      {/* Loading Phase */}
      {gamePhase === "loading" && (
        <div className="w-full h-full relative">
          <img
            src={GTA6_LOADING}
            alt="GTA6 Loading"
            className="w-full h-full object-cover"
          />

          {/* GTA6 Logo in top left */}
          <div className="absolute top-8 left-16 z-20">
            <img
              src={GTA6_LOGO}
              alt="GTA6 Logo"
              className="h-64 w-auto object-contain"
            />
          </div>

          <ModernLoader />
        </div>
      )}

      {/* Running Phase */}
      {gamePhase === "running" && (
        <div className="w-full h-full relative">
          <img
            src={GTA6_SCREEN}
            alt="GTA6 Game Screen"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Crashed Phase */}
      {gamePhase === "crashed" && (
        <div className="w-full h-full relative">
          <img
            src={GTA6_SCREEN}
            alt="GTA6 Game Screen Crashed"
            className="w-full h-full object-cover filter grayscale brightness-75 contrast-50 transition-all duration-2000 ease-in-out"
          />
          <div className="absolute inset-0 bg-white opacity-20 transition-opacity duration-2000 ease-in-out" />
        </div>
      )}

      {/* Error Modal - positioned absolutely without black background overlay */}
      {showErrorModal && (
        <div className="absolute inset-0 flex items-center justify-center z-50 shadow-6xl">
          <ErrorModal />
        </div>
      )}
    </div>
  );
};

export default GTAVI;
