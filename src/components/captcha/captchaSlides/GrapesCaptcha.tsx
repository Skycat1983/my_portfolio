import { useState } from "react";
import { Info, RotateCcw } from "lucide-react";
import { CaptchaSquare } from "../CaptchaSquare";
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
  const [rotation, setRotation] = useState(0);

  const handleVerifyHover = () => {
    // Rotate the grapes a little bit each time we hover on the verify button
    setRotation((prev) => prev + 15);
  };

  return (
    <>
      <div
        className={`w-1/4 h-1/2 bg-cover bg-center bg-no-repeat transition-transform duration-300 relative`}
        style={{
          backgroundImage: `url(${data.src})`,
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <div className={gridClassName}>
          {Array.from({ length: divsToRender }).map((_, idx) => (
            <CaptchaSquare
              key={idx}
              id={idx}
              selected={selected.includes(idx)}
              onToggle={onToggleSquare}
            />
          ))}
        </div>
        {verifyState === "loading" && (
          <div className="absolute inset-0 bg-white bg-opacity-30 pointer-events-none" />
        )}
      </div>
      <div className="flex flex-col items-center justify-center bg-white w-1/4 h-[100px]">
        <div className="flex flex-row items-center justify-start gap-4 w-full px-8">
          <RotateCcw className="size-10 text-neutral-900 rounded-full p-2" />
          <Info className="size-10 text-neutral-900 rounded-full p-2" />
          <h4 className="text-neutral-900 text-xl font-bold">
            {currentIndex + 1}/{totalCaptchas}
          </h4>
          <VerifyButton
            onMouseEnter={handleVerifyHover}
            onClick={onVerify}
            verifyState={verifyState}
          />
        </div>
      </div>
    </>
  );
};
