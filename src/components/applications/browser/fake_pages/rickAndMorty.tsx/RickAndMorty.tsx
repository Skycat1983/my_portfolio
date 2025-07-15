import { useState, useEffect } from "react";
import { useNewStore } from "@/hooks/useStore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type {
  ContentType,
  Character,
  Location,
  Episode,
  CharacterFilters,
  LocationFilters,
  EpisodeFilters,
} from "./types";
import { CharacterFiltersComponent } from "./CharacterFilters";
import { LocationFiltersComponent } from "./LocationFilters";
import { EpisodeFiltersComponent } from "./EpisodeFilters";
import { ContentGrid } from "./ContentGrid";

export const RickAndMorty = () => {
  const { screenDimensions } = useNewStore();

  // State for content type and data
  const [activeTab, setActiveTab] = useState<ContentType>("characters");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [characterFilters, setCharacterFilters] = useState<CharacterFilters>({
    name: "",
    status: "all",
    species: "",
    type: "",
    gender: "all",
  });

  const [locationFilters, setLocationFilters] = useState<LocationFilters>({
    name: "",
    type: "",
    dimension: "",
  });

  const [episodeFilters, setEpisodeFilters] = useState<EpisodeFilters>({
    name: "",
    episode: "",
  });

  // Calculate responsive layout based on screen dimensions
  const windowWidth = screenDimensions.width;
  // const windowHeight = screenDimensions.height;

  // Calculate number of columns based on window width
  const getGridColumns = () => {
    if (windowWidth < 500) return 1;
    if (windowWidth < 700) return 2;
    if (windowWidth < 1000) return 3;
    return 4;
  };

  const gridColumns = getGridColumns();

  // Fetch data when tab or filters change
  useEffect(() => {
    // Fetch data based on active tab and filters
    const fetchData = async () => {
      console.log("fetchData in RickAndMorty: fetching data for", activeTab);
      setLoading(true);
      setError(null);

      try {
        // Fix endpoint: API uses singular forms
        const endpoint =
          activeTab === "characters"
            ? "character"
            : activeTab === "locations"
            ? "location"
            : "episode";
        let url = `https://rickandmortyapi.com/api/${endpoint}`;
        const queryParams: string[] = [];

        // Add filters based on active tab
        if (activeTab === "characters") {
          if (characterFilters.name)
            queryParams.push(
              `name=${encodeURIComponent(characterFilters.name)}`
            );
          if (characterFilters.status && characterFilters.status !== "all")
            queryParams.push(`status=${characterFilters.status}`);
          if (characterFilters.species)
            queryParams.push(
              `species=${encodeURIComponent(characterFilters.species)}`
            );
          if (characterFilters.type)
            queryParams.push(
              `type=${encodeURIComponent(characterFilters.type)}`
            );
          if (characterFilters.gender && characterFilters.gender !== "all")
            queryParams.push(`gender=${characterFilters.gender}`);
        } else if (activeTab === "locations") {
          if (locationFilters.name)
            queryParams.push(
              `name=${encodeURIComponent(locationFilters.name)}`
            );
          if (locationFilters.type)
            queryParams.push(
              `type=${encodeURIComponent(locationFilters.type)}`
            );
          if (locationFilters.dimension)
            queryParams.push(
              `dimension=${encodeURIComponent(locationFilters.dimension)}`
            );
        } else if (activeTab === "episodes") {
          if (episodeFilters.name)
            queryParams.push(`name=${encodeURIComponent(episodeFilters.name)}`);
          if (episodeFilters.episode)
            queryParams.push(
              `episode=${encodeURIComponent(episodeFilters.episode)}`
            );
        }

        if (queryParams.length > 0) {
          url += `?${queryParams.join("&")}`;
        }

        console.log("fetchData in RickAndMorty: fetching from URL", url);
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch ${activeTab}: ${response.status}`);
        }

        const data = await response.json();

        switch (activeTab) {
          case "characters":
            setCharacters(data.results || []);
            break;
          case "locations":
            setLocations(data.results || []);
            break;
          case "episodes":
            setEpisodes(data.results || []);
            break;
        }
      } catch (err) {
        console.error("fetchData in RickAndMorty: error", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, characterFilters, locationFilters, episodeFilters]);

  // Reset filters when tab changes
  const handleTabChange = (tab: ContentType) => {
    console.log("handleTabChange in RickAndMorty: switching to", tab);
    setActiveTab(tab);
    if (tab === "characters") {
      setCharacterFilters({
        name: "",
        status: "all",
        species: "",
        type: "",
        gender: "all",
      });
    } else if (tab === "locations") {
      setLocationFilters({
        name: "",
        type: "",
        dimension: "",
      });
    } else if (tab === "episodes") {
      setEpisodeFilters({
        name: "",
        episode: "",
      });
    }
  };

  return (
    <div className="h-full w-full bg-slate-900 text-green-400 font-mono p-4 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-xl md:text-4xl font-bold text-green-400 mb-2">
          Rick and Morty Database
        </h3>
        {/* <p className="text-green-300 text-sm">
          Window: {windowWidth}x{windowHeight} | Columns: {gridColumns}
        </p> */}
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={activeTab === "characters" ? "default" : "outline"}
          onClick={() => handleTabChange("characters")}
          className={`${
            activeTab === "characters"
              ? "bg-green-600 text-slate-900 hover:bg-green-700"
              : "bg-transparent border-green-400 text-green-400 hover:bg-green-400 hover:text-slate-900"
          }`}
        >
          Characters
        </Button>
        <Button
          variant={activeTab === "locations" ? "default" : "outline"}
          onClick={() => handleTabChange("locations")}
          className={`${
            activeTab === "locations"
              ? "bg-green-600 text-slate-900 hover:bg-green-700"
              : "bg-transparent border-green-400 text-green-400 hover:bg-green-400 hover:text-slate-900"
          }`}
        >
          Locations
        </Button>
        <Button
          variant={activeTab === "episodes" ? "default" : "outline"}
          onClick={() => handleTabChange("episodes")}
          className={`${
            activeTab === "episodes"
              ? "bg-green-600 text-slate-900 hover:bg-green-700"
              : "bg-transparent border-green-400 text-green-400 hover:bg-green-400 hover:text-slate-900"
          }`}
        >
          Episodes
        </Button>
      </div>

      <Separator className="bg-green-400 mb-4" />

      {/* Filters Section */}
      {activeTab === "characters" && (
        <CharacterFiltersComponent
          filters={characterFilters}
          onFiltersChange={setCharacterFilters}
          windowWidth={windowWidth}
        />
      )}

      {activeTab === "locations" && (
        <LocationFiltersComponent
          filters={locationFilters}
          onFiltersChange={setLocationFilters}
          windowWidth={windowWidth}
        />
      )}

      {activeTab === "episodes" && (
        <EpisodeFiltersComponent
          filters={episodeFilters}
          onFiltersChange={setEpisodeFilters}
          windowWidth={windowWidth}
        />
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {loading && (
          <div className="flex items-center justify-center h-32">
            <div className="text-green-400 text-lg">Loading {activeTab}...</div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-32">
            <div className="text-red-400 text-lg">Error: {error}</div>
          </div>
        )}

        {!loading && !error && (
          <ContentGrid
            activeTab={activeTab}
            characters={characters}
            locations={locations}
            episodes={episodes}
            gridColumns={gridColumns}
            windowWidth={windowWidth}
          />
        )}
      </div>
    </div>
  );
};
