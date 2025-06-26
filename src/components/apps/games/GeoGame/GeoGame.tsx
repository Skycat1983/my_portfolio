import { useEffect } from "react";
import { useNewStore } from "../../../../hooks/useStore";
import { GameMenu } from "./GameMenu";
import { GameInterface } from "./GameInterface";
import { GameOverScreen } from "./GameOverScreen";

// Main GeoGame Component
export const GeoGame = ({ windowId }: { windowId: string }) => {
  const window = useNewStore((s) => s.getWindowById(windowId));
  console.log("GeoGame: window", window);
  console.log("GeoGame: windowId", windowId);
  const gameStatus = useNewStore((s) => s.gameStatus);
  const loadCountries = useNewStore((s) => s.loadCountries);
  const isLoadingCountries = useNewStore((s) => s.isLoadingCountries);
  const countries = useNewStore((s) => s.countries);

  // Load countries on component mount
  useEffect(() => {
    console.log("GeoGame useEffect: loading countries on mount");
    if (!isLoadingCountries && countries.length === 0) {
      loadCountries();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingCountries, countries.length]); // loadCountries omitted to prevent infinite loop

  console.log("GeoGame: windowId", window);

  // Get z-index for content (one lower than window)
  const contentZIndex = window ? window.zIndex - 1 : 0;

  // Render appropriate screen based on game status
  const renderContent = () => {
    switch (gameStatus) {
      case "menu":
        return <GameMenu />;
      case "playing":
      case "answered":
        return <GameInterface />;
      case "gameOver":
        return <GameOverScreen />;
      default:
        return <GameMenu />;
    }
  };

  return (
    <div className="h-full w-full" style={{ zIndex: contentZIndex }}>
      {renderContent()}
    </div>
  );
};
