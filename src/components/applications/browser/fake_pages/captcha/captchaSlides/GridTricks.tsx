import { Info, RotateCcw } from "lucide-react";
import type { CaptchaSlideProps } from "../types";
import { VerifyButton } from "../VerifyButton";
import { useEffect, useState } from "react";
import { ME_BG_REMOVED } from "@/constants/images";
import { CaptchaSquare } from "../CaptchaSquare";
import { useScreenMonitor } from "@/hooks/useScreenSize";

const arraysMatch = (arr1: number[], arr2: number[]) => {
  return arr1.length === arr2.length && arr1.every((id) => arr2.includes(id));
};

export const GridTricks = ({
  data,
  selected,
  onToggleSquare,
  onVerify,
  gridClassName,
  onGridClassChange,
  divsToRender,
  verifyState,
  currentIndex,
  totalCaptchas,
}: CaptchaSlideProps) => {
  const screenSize = useScreenMonitor();
  const [initialised, setInitialised] = useState(false);
  const [trickeryPhase, setTrickeryPhase] = useState(0);
  const [newGridClassName, setNewGridClassName] = useState<string | null>(null);

  useEffect(() => {
    if (selected.length !== 0 && !initialised) {
      setInitialised(true);
      return;
    }
    if (screenSize.isXs || screenSize.isSm) {
      const handleMobileTrickery = () => {
        if (!initialised) {
          return;
        }

        const arr1 = [0, 2, 5, 3];
        if (arraysMatch(selected, arr1)) {
          // On hover, make first column roughly 40% width, others share remaining 60%
          onGridClassChange(
            "grid grid-cols-[40%_27%_33%] grid-rows-4 w-full h-full"
          );
        }
        const arr2 = [2, 5];
        if (arraysMatch(selected, arr2)) {
          onGridClassChange(
            "grid grid-cols-[40%_20%_40%] grid-rows-4 w-full h-full"
          );
        }
        if (selected.length === 0) {
          // On hover, expand the first column to ~40% width
          setNewGridClassName(
            "grid grid-cols-[40%_20%_40%] grid-rows-[12.5%_12.5%_25%_25%_25%] w-full h-full"
          );

          // setTrickeryPhase(1);
        }
        const arr3 = [0, 1, 2];
        if (arraysMatch(selected, arr3)) {
          console.log("arr3 matches");
          setTrickeryPhase(1);
        }
      };
      handleMobileTrickery();
    }
  }, [selected, initialised, screenSize, onGridClassChange]);

  const handleMouseEnter = () => {
    if (!initialised) {
      return;
    }

    const arr1 = [0, 2, 5, 3];
    if (arraysMatch(selected, arr1)) {
      // On hover, make first column roughly 40% width, others share remaining 60%
      onGridClassChange(
        "grid grid-cols-[40%_30%_30%] grid-rows-4 w-full h-full"
      );
    }
    const arr2 = [2, 5];
    if (arraysMatch(selected, arr2)) {
      onGridClassChange(
        "grid grid-cols-[40%_20%_40%] grid-rows-4 w-full h-full"
      );
    }
    if (selected.length === 0) {
      // On hover, expand the first column to ~40% width
      setNewGridClassName(
        "grid grid-cols-[40%_20%_40%] grid-rows-[12.5%_12.5%_25%_25%_25%] w-full h-full"
      );

      // setTrickeryPhase(1);
    }
    const arr3 = [0, 1, 2];
    if (arraysMatch(selected, arr3)) {
      console.log("arr3 matches");
      setTrickeryPhase(1);
    }
  };

  const handleMouseLeave = () => {
    // Revert to equal columns when not hovering
    // onGridClassChange("grid grid-cols-3 grid-rows-4 w-full h-full");
  };
  const divsCount = newGridClassName ? 15 : divsToRender;
  console.log("initialised", initialised);
  console.log("divsCount", divsCount);
  console.log("selected", selected);
  console.log("trickeryPhase", trickeryPhase);
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {/* Image container with consistent width */}
      <div className="relative flex items-center justify-center flex-1 w-full">
        <div className="relative inline-block max-w-full max-h-full">
          {/* Actual image element to maintain natural dimensions */}
          <img
            src={data.src}
            alt="Captcha challenge"
            className="max-w-sm max-h-full object-contain"
            draggable={false}
          />

          {/* Grid overlay positioned absolutely to match image dimensions */}
          <div
            className={`absolute inset-0 ${newGridClassName || gridClassName}`}
          >
            {Array.from({ length: divsCount }).map((_, idx) => (
              <CaptchaSquare
                key={idx}
                id={idx}
                selected={selected.includes(idx)}
                onToggle={onToggleSquare}
                image={
                  trickeryPhase === 1 && selected.includes(2) && idx === 2
                    ? ME_BG_REMOVED
                    : undefined
                }
              />
            ))}
          </div>

          {verifyState === "loading" && (
            <div className="absolute inset-0 bg-white/10 pointer-events-none" />
          )}
        </div>
      </div>

      {/* Bottom controls with same width as image container */}
      <div className="flex flex-col items-center justify-center bg-white w-auto h-[100px] w-full">
        <div className="flex flex-row items-center justify-start gap-4 w-full px-2 md:px-8 max-w-full">
          <RotateCcw className="size-10 text-neutral-900 rounded-full p-2" />
          <Info className="size-10 text-neutral-900 rounded-full p-2" />
          <h4 className="text-neutral-900 text-xl font-bold">
            {currentIndex + 1}/{totalCaptchas}
          </h4>
          <VerifyButton
            onClick={onVerify}
            verifyState={verifyState}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        </div>
      </div>
    </div>
  );
};

export default GridTricks;
