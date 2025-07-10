import { useState } from "react";
import { CAPTCHA_DATA } from "@/constants/captchaData";
import { CaptchaHeader } from "./CaptchaHeader";
import { GridTricks, BasicCaptcha, GrapesCaptcha } from "./captchaSlides";
import type { CaptchaData, VerifyState } from "./types";
import { useScreenMonitor } from "@/hooks/useScreenSize";

// Component registry mapping captcha titles to their components
const CAPTCHA_COMPONENTS_REGISTRY = {
  grid_tricks: GridTricks,
  just_me: BasicCaptcha,
  dress: BasicCaptcha,
  all_squares: BasicCaptcha,
  grapes: GrapesCaptcha,
} as const;

export const CaptchaMain = () => {
  const screenSize = useScreenMonitor();
  const captchaData = CAPTCHA_DATA;
  const width = screenSize.isXs
    ? "w-full"
    : screenSize.isSm
    ? "w-full"
    : screenSize.isMd
    ? "w-[200px]"
    : screenSize.isLg
    ? "w-full"
    : screenSize.isXl
    ? "w-full"
    : "w-full";
  const [gridClassName, setGridClassName] = useState(
    "grid grid-cols-3 grid-rows-4 w-full h-full"
  );
  const [currentIndex, setCurrentIndex] = useState(2);
  const [selected, setSelected] = useState<number[]>([]);
  const [verifyState, setVerifyState] = useState<VerifyState>("idle");

  const currentCaptcha = captchaData[currentIndex];

  const toggleSquare = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleVerify = async () => {
    // Prevent multiple clicks during processing
    if (verifyState !== "idle") return;

    setVerifyState("loading");

    // Add delay for loading effect
    await new Promise((resolve) => setTimeout(resolve, 800));

    const { correctAnswers } = currentCaptcha;
    const isCorrect =
      selected.length === correctAnswers.length &&
      selected.every((id) => correctAnswers.includes(id));

    // Set success or failure state
    setVerifyState(isCorrect ? "success" : "failure");

    // Show result for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (isCorrect) {
      console.log("Verified");
      const nextIndex = currentIndex + 1;
      if (nextIndex < captchaData.length) {
        setCurrentIndex(nextIndex);
        setSelected([]);
        // Reset grid to default for next captcha
        setGridClassName("grid grid-cols-3 grid-rows-4 w-full h-full");
      } else {
        console.log("All captchas completed");
      }
    } else {
      console.log("Not verified - retry current captcha");
    }

    // Reset to idle state
    setVerifyState("idle");
  };

  const handleGridClassChange = (newClassName: string) => {
    setGridClassName(newClassName);
  };

  // Determine which component to render based on captcha title
  const getCaptchaComponent = (captcha: CaptchaData) => {
    const title = captcha.title;
    if (title && title in CAPTCHA_COMPONENTS_REGISTRY) {
      return CAPTCHA_COMPONENTS_REGISTRY[
        title as keyof typeof CAPTCHA_COMPONENTS_REGISTRY
      ];
    }
    // Default to BasicCaptcha for captchas without titles or unknown titles
    return BasicCaptcha;
  };

  const CaptchaComponent = getCaptchaComponent(currentCaptcha);

  // Calculate number of divs to render
  const gridMoveIndex = 1;
  const divsToRender =
    currentIndex === gridMoveIndex && selected.length === 0 ? 15 : 12;

  return (
    <div
      className={`w-[${width}] h-full flex flex-col justify-center items-center bg-red-500`}
    >
      <CaptchaHeader
        task={currentCaptcha.task}
        text={currentCaptcha.text}
        width={width}
      />
      <CaptchaComponent
        data={currentCaptcha}
        selected={selected}
        onToggleSquare={toggleSquare}
        onVerify={handleVerify}
        gridClassName={gridClassName}
        onGridClassChange={handleGridClassChange}
        divsToRender={divsToRender}
        verifyState={verifyState}
        currentIndex={currentIndex}
        totalCaptchas={captchaData.length}
      />
    </div>
  );
};
