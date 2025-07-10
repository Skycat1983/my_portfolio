import { Check } from "lucide-react";

type SquareProps = {
  id: number;
  selected: boolean;
  onToggle: (id: number) => void;
  image?: string;
};

export const CaptchaSquare = ({
  id,
  selected,
  onToggle,
  image,
}: SquareProps) => {
  console.log("image", image);
  return (
    <div
      onClick={() => onToggle(id)}
      className="relative w-full h-full border-2 border-white/50 cursor-pointer overflow-hidden"
    >
      {/* Selected checkmark stays above the overlay */}
      {selected && (
        <div className="absolute top-2 left-2 bg-blue-500 p-1 rounded-full z-20">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Overlay image, rotated and flush to top-right */}
      {image && (
        <img
          src={image}
          alt="overlay"
          className="absolute top-0 right-0 z-10 -rotate-90 origin-top-right h-[100px] w-[100px] object-contain"
        />
      )}
    </div>
  );
};
{
  /* {trickeryPhase === 1 && idx === 2 && (
                <img
                  src={ME_BG_REMOVED}
                  alt="me"
                  className={`
              pointer-events-none
              row-start-1
              col-start-3
              self-start
              justify-self-end
              w-1/4 h-full
              object-contain
              -rotate-90
              bg-red-500
            `}
                />
              )} */
}
