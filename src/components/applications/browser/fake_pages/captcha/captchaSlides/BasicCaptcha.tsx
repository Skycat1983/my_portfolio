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
    <div className="flex flex-col items-center justify-center w-full h-full">
      {/* Image container with consistent width */}
      <div className="relative flex items-center justify-center flex-1 w-full">
        <div className="relative inline-block max-w-full max-h-full">
          {/* Actual image element to maintain natural dimensions */}
          <img
            src={data.src}
            alt="Captcha challenge"
            className="max-w-full max-h-full object-contain"
            draggable={false}
          />

          {/* Grid overlay positioned absolutely to match image dimensions */}
          <div className={`absolute inset-0 ${gridClassName}`}>
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
      </div>

      {/* Bottom controls with same width as image container */}
      <div className="flex flex-col items-center justify-center bg-white w-full h-[100px] flex-shrink-0">
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

export default BasicCaptcha;
// !DO NOT DELETE THIS FILE COMMENTED OUT CODE
// import { Info, RotateCcw } from "lucide-react";
// import { CaptchaSquare } from "../CaptchaSquare";
// import { VerifyButton } from "../VerifyButton";
// import type { CaptchaSlideProps } from "../types";

// export const BasicCaptcha = ({
//   data,
//   selected,
//   onToggleSquare,
//   onVerify,
//   gridClassName,
//   divsToRender,
//   verifyState,
//   currentIndex,
//   totalCaptchas,
// }: CaptchaSlideProps) => {
//   return (
//     <>
//       <div
//         className={`w-full h-full bg-cover bg-center bg-no-repeat relative`}
//         style={{ backgroundImage: `url(${data.src})` }}
//       >
//         <div className={gridClassName}>
//           {Array.from({ length: divsToRender }).map((_, idx) => (
//             <CaptchaSquare
//               key={idx}
//               id={idx}
//               selected={selected.includes(idx)}
//               onToggle={onToggleSquare}
//             />
//           ))}
//         </div>
//         {verifyState === "loading" && (
//           <div className="absolute inset-0 bg-white/10 pointer-events-none" />
//         )}
//       </div>
//       <div className="flex flex-col items-center justify-center bg-white w-full h-[100px]">
//         <div className="flex flex-row items-center justify-start gap-4 w-full px-2 md:px-8">
//           <RotateCcw className="size-10 text-neutral-900 rounded-full p-2" />
//           <Info className="size-10 text-neutral-900 rounded-full p-2" />
//           <h4 className="text-neutral-900 text-xl font-bold">
//             {currentIndex + 1}/{totalCaptchas}
//           </h4>
//           <VerifyButton
//             onClick={onVerify}
//             verifyState={verifyState}
//             // onMouseEnter={handleMouseEnter}
//             // onMouseLeave={handleMouseLeave}
//           />
//         </div>
//       </div>
//     </>
//   );
// };

// export default BasicCaptcha;
