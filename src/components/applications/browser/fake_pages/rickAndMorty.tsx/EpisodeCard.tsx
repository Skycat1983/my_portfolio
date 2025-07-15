import type { Episode } from "./types";

interface EpisodeCardProps {
  episode: Episode;
}

export const EpisodeCard = ({ episode }: EpisodeCardProps) => {
  return (
    <div className="bg-slate-800 border border-green-400 rounded-lg p-3 hover:bg-slate-700 transition-colors">
      <div className="space-y-2">
        <h3 className="text-green-400 font-bold text-sm">{episode.name}</h3>
        <p className="text-green-300 text-xs">Episode: {episode.episode}</p>
        <p className="text-green-300 text-xs">Air Date: {episode.air_date}</p>
        <p className="text-green-300 text-xs">
          Characters: {episode.characters.length}
        </p>
      </div>
    </div>
  );
};
