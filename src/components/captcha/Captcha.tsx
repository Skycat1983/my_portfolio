import { useState } from "react";
import { Check, Info, RotateCcw } from "lucide-react";
import { ME } from "@/constants/images";
import { Button } from "../ui/button";

type SquareProps = {
  id: number;
  selected: boolean;
  onToggle: (id: number) => void;
};

const Square = ({ id, selected, onToggle }: SquareProps) => (
  <div
    onClick={() => onToggle(id)}
    className="relative w-full h-full border-2 border-white/50 cursor-pointer"
  >
    {selected && (
      <div className="absolute top-2 left-2 bg-blue-500 p-1 rounded-full">
        <Check className="w-4 h-4 text-white" />
      </div>
    )}
  </div>
);

export const Captcha = () => {
  const me = ME;
  const [selected, setSelected] = useState<number[]>([]);

  const toggleSquare = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const correctAnswers = [1, 4, 6, 7, 8, 9, 10, 11];

  const verify = () => {
    console.log(selected);
    if (selected.length === correctAnswers.length) {
      if (selected.every((id) => correctAnswers.includes(id))) {
        console.log("Verified");
      } else {
        console.log("Not verified");
      }
    } else {
      console.log("Not verified");
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center">
      <div className="bg-blue-500 p-8 w-1/4 text-left">
        <p className="text-xl font-medium">Select all squares with</p>
        <h2 className="text-4xl font-bold">highly employable web developers</h2>

        {/* <h2 className="text-4xl font-bold">people who should be given a job</h2> */}
      </div>
      <div
        className="w-1/4 h-1/2 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${me})` }}
      >
        <div className="grid grid-cols-3 grid-rows-4 w-full h-full">
          {Array.from({ length: 12 }).map((_, idx) => (
            <Square
              key={idx}
              id={idx}
              selected={selected.includes(idx)}
              onToggle={toggleSquare}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center bg-white w-1/4 h-[100px]">
        <div className="flex flex-row items-center justify-start gap-2 w-full px-8">
          <RotateCcw className="size-10 text-neutral-900 rounded-full p-2" />
          <Info className="size-10 text-neutral-900 rounded-full p-2" />
          <Button
            className="ml-auto bg-blue-500 text-white h-12 !rounded-none"
            onClick={verify}
          >
            <h4 className="text-white font-bold">Verify</h4>
          </Button>
        </div>
      </div>
    </div>
  );
};
