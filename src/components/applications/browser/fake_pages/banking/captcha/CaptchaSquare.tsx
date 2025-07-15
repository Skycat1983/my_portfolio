import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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
  const squareRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [emergenceValue, setEmergenceValue] = useState(90); // Start hidden (90% off-screen)

  useEffect(() => {
    if (!image) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [image]);

  useEffect(() => {
    if (!image || !squareRef.current) return;

    const squareRect = squareRef.current.getBoundingClientRect();
    const squareCenterX = squareRect.left + squareRect.width / 2;
    const squareCenterY = squareRect.top + squareRect.height / 2;

    // Calculate distance from cursor to square center
    const distance = Math.sqrt(
      Math.pow(mousePosition.x - squareCenterX, 2) +
        Math.pow(mousePosition.y - squareCenterY, 2)
    );

    // Define max distance for emergence calculation (adjust as needed)
    const maxDistance = 300; // pixels
    const minDistance = 50; // pixels

    // Map distance to emergence value
    // Further away (higher distance) = more emerged (lower x value)
    // Closer (lower distance) = more hidden (higher x value)
    const normalizedDistance = Math.max(
      0,
      Math.min(1, (distance - minDistance) / (maxDistance - minDistance))
    );

    // Invert so that further = more emerged
    const emergence = 90 - normalizedDistance * 60; // Range from 90% (hidden) to 30% (emerged)

    setEmergenceValue(emergence);
    console.log("distance and emergence in CaptchaSquare: ", {
      distance: distance.toFixed(0),
      emergence: emergence.toFixed(0),
    });
  }, [mousePosition, image]);

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
      ref={squareRef}
      onClick={() => onToggle(id)}
      className="relative w-full h-full border-2 border-white/50 cursor-pointer overflow-hidden"
    >
      {image && (
        <motion.div
          className="w-1/3 h-full absolute top-0 right-0"
          animate={{ x: `${emergenceValue}%` }}
          transition={{
            type: "tween",
            ease: "easeOut",
            duration: 0.1, // Faster response to cursor movement
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
//  ! DO NOT DELETE THIS FILE COMMENTED OUT CODE
// export const CaptchaSquare = ({
//   id,
//   selected,
//   onToggle,
//   image,
// }: SquareProps) => {
//   const style = image
//     ? {
//         backgroundImage: `url(${image})`,
//         backgroundSize: "contain",
//         backgroundRepeat: "no-repeat",
//         backgroundPosition: "center",
//         rotate: "-90deg",
//         scale: "1",
//       }
//     : {};

//   return (
//     <div
//       onClick={() => onToggle(id)}
//       className="relative w-full h-full border-2 border-white/50 cursor-pointer overflow-hidden"
//     >
//       {image && (
//         <motion.div
//           className="w-1/3 h-full absolute top-0 right-0"
//           initial={{ x: "90%" }} // start off-screen right
//           animate={{ x: "30%" }} // slide into place
//           transition={{
//             type: "tween", // or 'spring'
//             ease: "easeOut",
//             duration: 2,
//             delay: 0.2,
//           }}
//         >
//           <div style={style} className="w-full h-full" />
//         </motion.div>
//       )}

//       {selected && (
//         <div className="absolute top-2 left-2 bg-blue-500 p-1 rounded-full z-10">
//           <Check className="w-4 h-4 text-white" />
//         </div>
//       )}
//     </div>
//   );
// };
