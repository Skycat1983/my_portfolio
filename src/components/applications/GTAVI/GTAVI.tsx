import { GTA6_LOADING, GTA6_SCREEN, GTA6_LOGO } from "@/constants/images";
import { useEffect, useState } from "react";
import { useNewStore } from "@/hooks/useStore";
import { ModernLoader } from "./ModernLoader";
import { ErrorModal } from "./ErrorModal";
import type { WindowId } from "@/constants/applicationRegistry";

type GamePhase = "loading" | "running" | "crashed";

const GTAVI = ({ windowId }: { windowId: WindowId }) => {
  const window = useNewStore((state) => state.findWindowById(windowId));
  const operatingSystem = useNewStore((state) => state.operatingSystem);
  const closeWindow = useNewStore((state) => state.closeWindow);

  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [gamePhase, setGamePhase] = useState<GamePhase>("loading");
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [isLoadingPaused, setIsLoadingPaused] = useState<boolean>(false);

  const closeGTA6 = () => {
    closeWindow(windowId);
    setShowErrorModal(false);
  };

  // Get z-index for content (one lower than window)
  const contentZIndex = window ? window.zIndex - 1 : 0;

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

  return (
    <div className="h-full w-full" style={{ zIndex: contentZIndex }}>
      <div
        className={`w-full h-full ${
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

            <ModernLoader
              loadingProgress={loadingProgress}
              isLoadingPaused={isLoadingPaused}
            />
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
            <ErrorModal
              operatingSystem={operatingSystem === "mac" ? "macos" : "windows"}
              onClose={closeGTA6}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GTAVI;
