import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LocationFilters } from "./types";

interface LocationFiltersProps {
  filters: LocationFilters;
  onFiltersChange: (filters: LocationFilters) => void;
  windowWidth: number;
}

export const LocationFiltersComponent = ({
  filters,
  onFiltersChange,
  windowWidth,
}: LocationFiltersProps) => {
  const isNarrow = windowWidth < 600;

  return (
    <div
      className={`mb-4 p-3 bg-slate-800 rounded border border-green-400 ${
        isNarrow ? "space-y-3" : "grid grid-cols-3 gap-3"
      }`}
    >
      <div className="space-y-2">
        <Label htmlFor="location-name" className="text-green-400 text-sm">
          Name
        </Label>
        <Input
          id="location-name"
          value={filters.name}
          onChange={(e) =>
            onFiltersChange({ ...filters, name: e.target.value })
          }
          placeholder="Search by name..."
          className="bg-slate-700 border-green-400 text-green-300 placeholder:text-green-600"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location-type" className="text-green-400 text-sm">
          Type
        </Label>
        <Input
          id="location-type"
          value={filters.type}
          onChange={(e) =>
            onFiltersChange({ ...filters, type: e.target.value })
          }
          placeholder="Search by type..."
          className="bg-slate-700 border-green-400 text-green-300 placeholder:text-green-600"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dimension" className="text-green-400 text-sm">
          Dimension
        </Label>
        <Input
          id="dimension"
          value={filters.dimension}
          onChange={(e) =>
            onFiltersChange({ ...filters, dimension: e.target.value })
          }
          placeholder="Search by dimension..."
          className="bg-slate-700 border-green-400 text-green-300 placeholder:text-green-600"
        />
      </div>
    </div>
  );
};
