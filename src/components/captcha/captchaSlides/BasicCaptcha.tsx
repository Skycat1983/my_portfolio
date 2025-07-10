import { Info, RotateCcw } from "lucide-react";
import { CaptchaSquare } from "../CaptchaSquare";
import { VerifyButton } from "../VerifyButton";
import type { CaptchaSlideProps } from "../types";

export const BasicCaptcha = ({
  data,
  selected,
  onToggleSquare,
  onVerify,
  gridClassName,
  divsToRender,
  verifyState,
  currentIndex,
  totalCaptchas,
}: CaptchaSlideProps) => {
  return (
    <>
      <div
        className={`w-1/4 h-1/2 bg-cover bg-center bg-no-repeat relative`}
        style={{ backgroundImage: `url(${data.src})` }}
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
          <div className="absolute inset-0 bg-white/10 pointer-events-none" />
        )}
      </div>
      <div className="flex flex-col items-center justify-center bg-white w-1/4 h-[100px]">
        <div className="flex flex-row items-center justify-start gap-4 w-full px-8">
          <RotateCcw className="size-10 text-neutral-900 rounded-full p-2" />
          <Info className="size-10 text-neutral-900 rounded-full p-2" />
          <h4 className="text-neutral-900 text-xl font-bold">
            {currentIndex + 1}/{totalCaptchas}
          </h4>
          <VerifyButton onClick={onVerify} verifyState={verifyState} />
        </div>
      </div>
    </>
  );
};

export default BasicCaptcha;
