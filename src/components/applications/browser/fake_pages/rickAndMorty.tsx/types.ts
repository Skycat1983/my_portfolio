// ═══════════════════════════════════════════════════════════════════════════════
// API RESPONSE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ApiInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

// Character Types
export interface CharacterOrigin {
  name: string;
  url: string;
}

export interface CharacterLocation {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  type: string;
  gender: "Female" | "Male" | "Genderless" | "unknown";
  origin: CharacterOrigin;
  location: CharacterLocation;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface CharactersResponse {
  info: ApiInfo;
  results: Character[];
}

// Location Types
export interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url: string;
  created: string;
}

export interface LocationsResponse {
  info: ApiInfo;
  results: Location[];
}

// Episode Types
export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
}

export interface EpisodesResponse {
  info: ApiInfo;
  results: Episode[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// FILTER TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface CharacterFilters {
  name: string;
  status: "all" | "alive" | "dead" | "unknown";
  species: string;
  type: string;
  gender: "all" | "female" | "male" | "genderless" | "unknown";
}

export interface LocationFilters {
  name: string;
  type: string;
  dimension: string;
}

export interface EpisodeFilters {
  name: string;
  episode: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type ContentType = "characters" | "locations" | "episodes";
