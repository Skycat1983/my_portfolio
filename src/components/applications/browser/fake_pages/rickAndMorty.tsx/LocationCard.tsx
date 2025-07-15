import type { Location } from "./types";

interface LocationCardProps {
  location: Location;
}

export const LocationCard = ({ location }: LocationCardProps) => {
  return (
    <div className="bg-slate-800 border border-green-400 rounded-lg p-3 hover:bg-slate-700 transition-colors">
      <div className="space-y-2">
        <h3 className="text-green-400 font-bold text-sm">{location.name}</h3>
        <p className="text-green-300 text-xs">Type: {location.type}</p>
        <p className="text-green-300 text-xs">
          Dimension: {location.dimension}
        </p>
        <p className="text-green-300 text-xs">
          Residents: {location.residents.length}
        </p>
      </div>
    </div>
  );
};
