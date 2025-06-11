// src/components/EasterEgg.styles.ts
import clsx from "clsx";

type ContainerOpts = { selected: boolean; drop: boolean };

export const containerClasses = ({ selected, drop }: ContainerOpts) =>
  clsx("rounded-md cursor-pointer p-3", {
    // click-target variants
    "border-2 border-gray-500 bg-transparent": selected,
    "border-2 border-blue-400 bg-blue-500/20": drop,
    "hover:bg-gray-800/30": !selected && !drop,
  });

export const labelClasses = (selected: boolean) =>
  clsx("text-white p-2", selected && "bg-blue-500 rounded-md");

// handy little constant for the fixed wrapper layout
export const tileWrapper =
  "p-4 w-[120px] h-[120px] flex flex-col items-center justify-center";
export const tileFrame = "flex flex-col items-center";
export const imageSize = "w-16 h-16 mx-auto mb-2";
export const titleBase = "text-lg font-bold text-center max-w-[120px] truncate";
