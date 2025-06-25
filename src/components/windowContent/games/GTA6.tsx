import { GTA6_LOADING, GTA6_SCREEN } from "../../../constants/images";
import { useEffect, useState } from "react";

type GamePhase = "loading" | "running" | "crashed";
type LoaderStyle = "classic" | "retro" | "modern";
type ErrorModalStyle = "windows_xp" | "windows_10" | "macos";

const GTA6 = () => {
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [gamePhase, setGamePhase] = useState<GamePhase>("loading");
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [isLoadingPaused, setIsLoadingPaused] = useState<boolean>(false);

  // Experiment with different styles - change these to test different variants
  const [loaderStyle] = useState<LoaderStyle>("modern");
  const [errorModalStyle] = useState<ErrorModalStyle>("macos");

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
          console.log("loading paused in irregular loading behavior");
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
      }, 2000);
    }, 200);

    return () => clearTimeout(crashTimer);
  }, [gamePhase]);

  const handleCloseError = () => {
    console.log(
      "showErrorModal set to false in handleCloseError: ",
      showErrorModal
    );
    setShowErrorModal(false);
  };

  // Loader Components
  const ClassicLoader = () => (
    <div className="absolute bottom-8 left-8 right-8">
      <div className="bg-gray-900 bg-opacity-90 p-6 rounded-lg border border-gray-600">
        <div className="text-green-400 text-lg mb-4 text-center font-mono">
          LOADING GTA VI...
        </div>
        <div className="w-full bg-black rounded h-6 border border-green-400 overflow-hidden">
          <div
            className={`bg-gradient-to-r from-green-500 to-green-300 h-full transition-all duration-100 ${
              isLoadingPaused ? "animate-pulse" : ""
            }`}
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        <div className="text-green-300 text-sm mt-3 text-center font-mono">
          {isLoadingPaused
            ? "SYSTEM STRUGGLING..."
            : `${Math.round(loadingProgress)}% COMPLETE`}
        </div>
        {isLoadingPaused && (
          <div className="text-red-400 text-xs mt-1 text-center font-mono animate-pulse">
            LOW MEMORY WARNING
          </div>
        )}
      </div>
    </div>
  );

  const RetroLoader = () => (
    <div className="absolute bottom-12 left-4 right-4">
      <div
        className="bg-gray-200 border-2 border-gray-400 p-4"
        style={{
          boxShadow:
            "inset -2px -2px #000000, inset 2px 2px #ffffff, inset -4px -4px #808080, inset 4px 4px #c0c0c0",
        }}
      >
        <div className="text-black text-sm mb-3 font-bold">
          Grand Theft Auto VI is loading...
        </div>
        <div className="w-full bg-white border border-gray-600 h-4 relative overflow-hidden">
          <div
            className={`bg-blue-600 h-full transition-all duration-150 relative ${
              isLoadingPaused ? "bg-red-600" : ""
            }`}
            style={{ width: `${loadingProgress}%` }}
          >
            {/* Classic Windows loading pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
          </div>
        </div>
        <div className="text-black text-xs mt-2 flex justify-between">
          <span>{isLoadingPaused ? "System Error..." : "Please wait..."}</span>
          <span>{Math.round(loadingProgress)}%</span>
        </div>
      </div>
    </div>
  );

  const ModernLoader = () => (
    <div className="absolute bottom-16 left-6 right-6">
      <div className="bg-black bg-opacity-80 backdrop-blur-sm p-8 rounded-2xl border border-gray-700">
        <div className="text-white text-xl mb-6 text-center font-light">
          Loading GTA VI
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

  // Error Modal Components
  const WindowsXPErrorModal = () => (
    <div
      className="bg-gray-200 border border-gray-400 rounded-none shadow-lg w-96"
      style={{
        boxShadow:
          "inset -1px -1px #000000, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #c0c0c0",
      }}
    >
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 border border-red-700 flex items-center justify-center">
            <span className="text-white text-xs">×</span>
          </div>
          <span className="text-sm font-bold">Grand Theft Auto VI</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <span className="text-white text-sm font-bold">×</span>
          </div>
          <div>
            <div className="text-black font-bold mb-2">
              GTA VI has encountered a problem and needs to close.
            </div>
            <div className="text-sm text-gray-700 mb-3">
              We are sorry for the inconvenience. If you were in the middle of
              something, the information you were working on might be lost.
            </div>
            <div className="text-xs text-gray-600 bg-white p-2 border border-gray-400 font-mono">
              AppName: gtavi.exe
              <br />
              ModName: d3d11.dll
              <br />
              Offset: 00012e40
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end p-3 bg-gray-100 border-t border-gray-300">
        <button
          onClick={handleCloseError}
          className="px-6 py-1 text-sm bg-gray-200 border border-gray-400 hover:bg-gray-300 transition-colors"
          style={{
            boxShadow: "inset -1px -1px #808080, inset 1px 1px #ffffff",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );

  const Windows10ErrorModal = () => (
    <div className="bg-white rounded-lg shadow-2xl w-96 border border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              App has stopped working
            </h3>
            <p className="text-sm text-gray-600">GTA VI</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-700 mb-3">
            The application has stopped working due to a problem. Windows is
            checking for a solution to the problem.
          </p>
          <div className="bg-gray-50 p-3 rounded border text-xs text-gray-600 font-mono">
            Problem signature:
            <br />
            Problem Event Name: APPCRASH
            <br />
            Application Name: GrandTheftAutoVI.exe
            <br />
            Fault Module Name: KERNELBASE.dll
            <br />
            Exception Code: c0000005
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleCloseError}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Close program
          </button>
        </div>
      </div>
    </div>
  );

  const MacOSErrorModal = () => (
    <div className="bg-white rounded-xl shadow-2xl w-80 border border-gray-200">
      <div className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          "GTA VI" quit unexpectedly
        </h3>

        <p className="text-sm text-gray-600 mb-4">
          The application terminated due to insufficient system resources. Your
          Mac may need more memory to run this application.
        </p>

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg mb-6 text-left font-mono">
          Process: GTA VI [2847]
          <br />
          Path: /Applications/GTA VI.app
          <br />
          Exception Type: EXC_BAD_ACCESS
          <br />
          Exception Subtype: KERN_INVALID_ADDRESS
        </div>

        <button
          onClick={handleCloseError}
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );

  const renderLoader = () => {
    switch (loaderStyle) {
      case "classic":
        return <ClassicLoader />;
      case "retro":
        return <RetroLoader />;
      case "modern":
        return <ModernLoader />;
      default:
        return <RetroLoader />;
    }
  };

  const renderErrorModal = () => {
    switch (errorModalStyle) {
      case "windows_xp":
        return <WindowsXPErrorModal />;
      case "windows_10":
        return <Windows10ErrorModal />;
      case "macos":
        return <MacOSErrorModal />;
      default:
        return <WindowsXPErrorModal />;
    }
  };

  return (
    <div
      className={`w-full h-full absolute top-0 left-0 z-10 ${
        gamePhase === "crashed" ? "cursor-not-allowed" : "cursor-default"
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
          {renderLoader()}
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
            className="w-full h-full object-cover filter grayscale brightness-75 contrast-50"
          />
          <div className="absolute inset-0 bg-white opacity-20" />
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {renderErrorModal()}
        </div>
      )}
    </div>
  );
};

export default GTA6;
