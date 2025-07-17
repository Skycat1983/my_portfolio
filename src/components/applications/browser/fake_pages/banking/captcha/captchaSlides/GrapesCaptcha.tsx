import { Info, RotateCcw } from "lucide-react";
import { useState } from "react";
import { DividingCaptchaSquare } from "../DividingCaptchaSquare";
import { VerifyButton } from "../VerifyButton";
import type { CaptchaSlideProps } from "../types";

export const GrapesCaptcha = ({
  data,
  selected,
  onToggleSquare,
  onVerify,
  gridClassName,
  divsToRender,
  verifyState,
  currentIndex,
  totalCaptchas,
}: Omit<CaptchaSlideProps, "onGridClassChange">) => {
  const [dividedSquares, setDividedSquares] = useState<Set<number>>(new Set());
  const [subSquareSelections, setSubSquareSelections] = useState<
    Record<number, boolean[]>
  >({});

  const handleDivide = (id: number) => {
    setDividedSquares((prev) => new Set(prev).add(id));
    // Initialize sub-square selections for this divided square
    if (!subSquareSelections[id]) {
      setSubSquareSelections((prev) => ({
        ...prev,
        [id]: [false, false, false, false],
      }));
    }
  };

  const handleSubSquareToggle = (mainId: number, subId: number) => {
    setSubSquareSelections((prev) => ({
      ...prev,
      [mainId]: prev[mainId]?.map((selected, idx) =>
        idx === subId ? !selected : selected
      ) || [false, false, false, false],
    }));
  };

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
          <div className={`absolute inset-0 ${gridClassName}`}>
            {Array.from({ length: divsToRender }).map((_, idx) => (
              <DividingCaptchaSquare
                key={idx}
                id={idx}
                selected={selected.includes(idx)}
                onToggle={onToggleSquare}
                divided={dividedSquares.has(idx)}
                onDivide={handleDivide}
                subSquareSelections={subSquareSelections[idx]}
                onSubSquareToggle={handleSubSquareToggle}
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
            // onMouseEnter={handleMouseEnter}
            // onMouseLeave={handleMouseLeave}
          />
        </div>
      </div>
    </div>
  );
};
