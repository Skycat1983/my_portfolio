import type { Character } from "./types";

interface CharacterCardProps {
  character: Character;
  windowWidth: number;
}

export const CharacterCard = ({
  character,
  windowWidth,
}: CharacterCardProps) => {
  const isNarrow = windowWidth < 500;

  return (
    <div className="bg-slate-800 border border-green-400 rounded-lg p-3 hover:bg-slate-700 transition-colors">
      <div className={`${isNarrow ? "space-y-2" : "flex gap-3"}`}>
        <img
          src={character.image}
          alt={character.name}
          className={`${
            isNarrow ? "w-full h-32" : "w-16 h-16"
          } object-cover rounded border border-green-400`}
        />
        <div className="flex-1 space-y-1">
          <h3 className="text-green-400 font-bold text-sm truncate">
            {character.name}
          </h3>
          <p className="text-green-300 text-xs">Status: {character.status}</p>
          <p className="text-green-300 text-xs">Species: {character.species}</p>
          <p className="text-green-300 text-xs">Gender: {character.gender}</p>
          {!isNarrow && (
            <p className="text-green-300 text-xs truncate">
              Origin: {character.origin.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
