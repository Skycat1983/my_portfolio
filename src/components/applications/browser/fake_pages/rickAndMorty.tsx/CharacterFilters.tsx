import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CharacterFilters } from "./types";
import { useDropdownZIndex } from "../../../../window/hooks/useNextWindowZIndex";

interface CharacterFiltersProps {
  filters: CharacterFilters;
  onFiltersChange: (filters: CharacterFilters) => void;
  windowWidth: number;
}

export const CharacterFiltersComponent = ({
  filters,
  onFiltersChange,
  windowWidth,
}: CharacterFiltersProps) => {
  const dropdownZIndex = useDropdownZIndex();
  const isNarrow = windowWidth < 600;

  return (
    <div
      className={`mb-4 p-3 bg-slate-800 rounded border border-green-400 ${
        isNarrow ? "space-y-3" : "grid grid-cols-2 gap-3"
      }`}
    >
      <div className="space-y-2">
        <Label htmlFor="name" className="text-green-400 text-sm">
          Name
        </Label>
        <Input
          id="name"
          value={filters.name}
          onChange={(e) =>
            onFiltersChange({ ...filters, name: e.target.value })
          }
          placeholder="Search by name..."
          className="bg-slate-700 border-green-400 text-green-300 placeholder:text-green-600"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status" className="text-green-400 text-sm">
          Status
        </Label>
        <Select
          value={filters.status}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              status: value as CharacterFilters["status"],
            })
          }
        >
          <SelectTrigger className="bg-slate-700 border-green-400 text-green-300">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent
            className="bg-slate-700 border-green-400"
            style={{ zIndex: dropdownZIndex }}
          >
            <SelectItem value="all" className="text-green-300">
              All statuses
            </SelectItem>
            <SelectItem value="alive" className="text-green-300">
              Alive
            </SelectItem>
            <SelectItem value="dead" className="text-green-300">
              Dead
            </SelectItem>
            <SelectItem value="unknown" className="text-green-300">
              Unknown
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="species" className="text-green-400 text-sm">
          Species
        </Label>
        <Input
          id="species"
          value={filters.species}
          onChange={(e) =>
            onFiltersChange({ ...filters, species: e.target.value })
          }
          placeholder="Search by species..."
          className="bg-slate-700 border-green-400 text-green-300 placeholder:text-green-600"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender" className="text-green-400 text-sm">
          Gender
        </Label>
        <Select
          value={filters.gender}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              gender: value as CharacterFilters["gender"],
            })
          }
        >
          <SelectTrigger className="bg-slate-700 border-green-400 text-green-300">
            <SelectValue placeholder="All genders" />
          </SelectTrigger>
          <SelectContent
            className="bg-slate-700 border-green-400"
            style={{ zIndex: dropdownZIndex }}
          >
            <SelectItem value="all" className="text-green-300">
              All genders
            </SelectItem>
            <SelectItem value="female" className="text-green-300">
              Female
            </SelectItem>
            <SelectItem value="male" className="text-green-300">
              Male
            </SelectItem>
            <SelectItem value="genderless" className="text-green-300">
              Genderless
            </SelectItem>
            <SelectItem value="unknown" className="text-green-300">
              Unknown
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
