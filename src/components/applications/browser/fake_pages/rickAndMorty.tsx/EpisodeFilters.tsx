import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EpisodeFilters } from "./types";

interface EpisodeFiltersProps {
  filters: EpisodeFilters;
  onFiltersChange: (filters: EpisodeFilters) => void;
  windowWidth: number;
}

export const EpisodeFiltersComponent = ({
  filters,
  onFiltersChange,
  windowWidth,
}: EpisodeFiltersProps) => {
  const isNarrow = windowWidth < 600;

  return (
    <div
      className={`mb-4 p-3 bg-slate-800 rounded border border-green-400 ${
        isNarrow ? "space-y-3" : "grid grid-cols-2 gap-3"
      }`}
    >
      <div className="space-y-2">
        <Label htmlFor="episode-name" className="text-green-400 text-sm">
          Name
        </Label>
        <Input
          id="episode-name"
          value={filters.name}
          onChange={(e) =>
            onFiltersChange({ ...filters, name: e.target.value })
          }
          placeholder="Search by name..."
          className="bg-slate-700 border-green-400 text-green-300 placeholder:text-green-600"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="episode-code" className="text-green-400 text-sm">
          Episode
        </Label>
        <Input
          id="episode-code"
          value={filters.episode}
          onChange={(e) =>
            onFiltersChange({ ...filters, episode: e.target.value })
          }
          placeholder="e.g., S01E01"
          className="bg-slate-700 border-green-400 text-green-300 placeholder:text-green-600"
        />
      </div>
    </div>
  );
};
