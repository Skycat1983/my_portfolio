// src/components/EasterEgg.styles.ts
import clsx from "clsx";

type ContainerOpts = { selected: boolean; drop: boolean };

export const containerClasses = ({ selected, drop }: ContainerOpts) =>
  clsx("rounded-md cursor-pointer p-2", {
    // click-target variants
    "border-2 border-gray-500 bg-transparent": selected,
    "border-2 border-blue-400 bg-blue-500/20": drop,
    "hover:bg-gray-800/30": !selected && !drop,
  });

export const labelClasses = (selected: boolean) =>
  clsx("text-white p-2", selected && "bg-blue-500 rounded-md");

// handy little constant for the fixed wrapper layout
// export const tileWrapper =
//   " w-full h-full flex flex-col items-center justify-center relative bg-white sm:bg-transparent ";
// node.styles.ts
export const tileWrapper = (): string => {
  // const rand = Math.floor(Math.random() * 6) + 1; // 1–6
  // let bgClass: string;

  // switch (rand) {
  //   case 1:
  //     bgClass = "bg-pink-100/10";
  //     break;
  //   case 2:
  //     bgClass = "bg-purple-100/10";
  //     break;
  //   case 3:
  //     bgClass = "bg-indigo-100/10";
  //     break;
  //   case 4:
  //     bgClass = "bg-blue-100/10";
  //     break;
  //   case 5:
  //     bgClass = "bg-green-100/10";
  //     break;
  //   case 6:
  //     bgClass = "bg-yellow-100/10";
  //     break;
  //   default:
  //     bgClass = "bg-pink-100/10";
  // }

  return clsx(
    "w-full h-full flex flex-col items-center justify-center relative",
    // bgClass,
    "sm:bg-transparent"
  );
};

export const tileFrame = "flex flex-col items-center";
// node.styles.ts
export const imageSize = "w-full h-auto mx-auto mb-0 rounded-lg";

export const titleBase =
  "text-sm md:text-base  font-bold text-center max-w-[200px] truncate";

// type ContainerOpts = { selected: boolean; drop: boolean };

// export const containerClasses = ({ selected, drop }: ContainerOpts) =>
//   clsx("rounded-md cursor-pointer p-3", {
//     // click-target variants
//     "border-2 border-gray-500 bg-transparent": selected,
//     "border-2 border-blue-400 bg-blue-500/20": drop,
//     "hover:bg-gray-800/30": !selected && !drop,
//   });

// export const labelClasses = (selected: boolean) =>
//   clsx("text-white p-2", selected && "bg-blue-500 rounded-md");

// // handy little constant for the fixed wrapper layout
// export const tileWrapper =
//   "p-4 w-[120px] h-[120px] flex flex-col items-center justify-center";
// export const tileFrame = "flex flex-col items-center";
// export const imageSize = "w-24 h-24 mx-auto mb-0";
// export const titleBase = "text-lg font-bold text-center max-w-[120px] truncate";
