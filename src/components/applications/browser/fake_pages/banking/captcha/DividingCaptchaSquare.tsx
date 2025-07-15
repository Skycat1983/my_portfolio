import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { CaptchaSquare } from "./CaptchaSquare";

type DividingSquareProps = {
  id: number;
  selected: boolean;
  onToggle: (id: number) => void;
  image?: string;
  divided: boolean;
  onDivide: (id: number) => void;
  subSquareSelections?: boolean[]; // array of 4 selections for sub-squares
  onSubSquareToggle?: (mainId: number, subId: number) => void;
};

export const DividingCaptchaSquare = ({
  id,
  selected,
  onToggle,
  image,
  divided,
  onDivide,
  subSquareSelections = [false, false, false, false],
  onSubSquareToggle,
}: DividingSquareProps) => {
  const handleMouseEnter = () => {
    if (!divided) {
      onDivide(id);
    }
  };

  const handleClick = () => {
    if (!divided) {
      onToggle(id);
      onDivide(id);
    }
  };

  const handleSubSquareToggle = (subId: number) => {
    if (onSubSquareToggle) {
      onSubSquareToggle(id, subId);
    }
  };

  const style = image
    ? {
        backgroundImage: `url(${image})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        rotate: "-90deg",
        scale: "1",
      }
    : {};

  if (divided) {
    // Render 4 sub-squares in a 2x2 grid
    return (
      <div className="w-full h-full border-2 border-white/50 grid grid-cols-2 grid-rows-2">
        {Array.from({ length: 4 }).map((_, subIdx) => (
          <CaptchaSquare
            key={`${id}-${subIdx}`}
            id={subIdx}
            selected={subSquareSelections[subIdx]}
            onToggle={() => handleSubSquareToggle(subIdx)}
          />
        ))}
      </div>
    );
  }

  // Render as regular square that can be divided
  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className="relative w-full h-full border-2 border-white/50 cursor-pointer overflow-hidden"
    >
      {image && (
        <motion.div
          className="w-1/3 h-full absolute top-0 right-0"
          initial={{ x: "90%" }} // start off-screen right
          animate={{ x: "30%" }} // slide into place
          transition={{
            type: "tween", // or 'spring'
            ease: "easeOut",
            duration: 2,
            delay: 0.2,
          }}
        >
          <div style={style} className="w-full h-full" />
        </motion.div>
      )}

      {selected && (
        <div className="absolute top-2 left-2 bg-blue-500 p-1 rounded-full z-10">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};
