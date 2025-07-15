import type { ContentType, Character, Location, Episode } from "./types";
import { CharacterCard } from "./CharacterCard";
import { LocationCard } from "./LocationCard";
import { EpisodeCard } from "./EpisodeCard";

interface ContentGridProps {
  activeTab: ContentType;
  characters: Character[];
  locations: Location[];
  episodes: Episode[];
  gridColumns: number;
  windowWidth: number;
}

export const ContentGrid = ({
  activeTab,
  characters,
  locations,
  episodes,
  gridColumns,
  windowWidth,
}: ContentGridProps) => {
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
    gap: "16px",
  };

  return (
    <div style={gridStyle}>
      {activeTab === "characters" &&
        characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            windowWidth={windowWidth}
          />
        ))}

      {activeTab === "locations" &&
        locations.map((location) => (
          <LocationCard key={location.id} location={location} />
        ))}

      {activeTab === "episodes" &&
        episodes.map((episode) => (
          <EpisodeCard key={episode.id} episode={episode} />
        ))}
    </div>
  );
};
