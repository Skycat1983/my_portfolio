import { Check } from "lucide-react";

import { motion } from "framer-motion";

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

  return (
    <div
      onClick={() => onToggle(id)}
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
