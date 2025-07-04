// src/components/EasterEgg.styles.ts
import clsx from "clsx";

type ContainerOpts = {
  selected: boolean;
  drop: boolean;
  view: "icons" | "list" | "columns";
};

export const getContainerClasses = ({
  selected,
  drop,
  view,
}: ContainerOpts): string => {
  if (view === "icons") {
    return clsx("rounded-md cursor-pointer p-2", {
      // click-target variants
      "border-2 border-gray-500 bg-transparent": selected,
      "border-2 border-blue-400 bg-blue-500/20": drop,
      "hover:bg-gray-800/30": !selected && !drop,
    });
  }
  if (view === "list") {
    return clsx("rounded-md cursor-pointer p-2", {
      "border-2 border-gray-500 bg-transparent": selected,
      "border-2 border-blue-400 bg-blue-500/20": drop,
      "hover:bg-gray-800/30": !selected && !drop,
    });
  }
  if (view === "columns") {
    return clsx("rounded-md cursor-pointer", {
      "border-2 border-gray-500 bg-transparent": selected,
      "border-2 border-blue-400 bg-blue-500/20": drop,
      "hover:bg-gray-800/30": !selected && !drop,
    });
  }

  return clsx("rounded-md cursor-pointer p-2", {
    "border-2 border-gray-500 bg-transparent": selected,
    "border-2 border-blue-400 bg-blue-500/20": drop,
    "hover:bg-gray-800/30": !selected && !drop,
  });
};

export const labelClasses = (selected: boolean) =>
  clsx("text-white p-2", selected && "bg-blue-500 rounded-md");

export const getLabelClasses = (
  view: "icons" | "list" | "columns",
  selected: boolean
): string => {
  if (view === "icons") {
    return clsx("text-white p-2", selected && "bg-blue-500 rounded-md");
  }
  if (view === "list") {
    return "text-sm font-bold mr-auto";
  }
  if (view === "columns") {
    return clsx(
      "text-sm font-bold mr-auto",
      selected && "bg-blue-500 rounded-md"
    );
  }

  return clsx(
    "text-sm font-bold mr-auto",
    selected && "bg-blue-500 rounded-md"
  );
};

// handy little constant for the fixed wrapper layout
// export const tileWrapper =
//   " w-full h-full flex flex-col items-center justify-center relative bg-white sm:bg-transparent ";
// node.styles.ts
export const getTileWrapper = (view: "icons" | "list" | "columns"): string => {
  if (view === "icons") {
    return clsx(
      "w-full h-full flex flex-col items-center justify-center relative",
      // bgClass,
      "sm:bg-transparent"
    );
  }
  if (view === "list") {
    return clsx(
      "w-full h-full flex flex-row items-center justify-center relative",
      // bgClass,
      "sm:bg-transparent"
    );
  }
  if (view === "columns") {
    return clsx(
      "w-full h-full flex flex-col items-center justify-start relative",
      // bgClass,
      "sm:bg-transparent"
    );
  }

  return clsx(
    "w-full h-full flex flex-col items-center justify-center relative",
    // bgClass,
    "sm:bg-transparent"
  );
};

export const getTitleFrame = (
  view: "icons" | "list" | "columns" | undefined
): string => {
  if (view === "icons") {
    return "flex flex-col items-center";
  }
  if (view === "list") {
    return "flex flex-row items-center";
  }
  if (view === "columns") {
    return "flex flex-row items-center justify-start";
  }

  return "flex flex-col items-center";
};

export const getImageSize = (view: "icons" | "list" | "columns"): string => {
  if (view === "icons") {
    return "w-full h-auto mx-auto mb-0 rounded-lg";
  }
  if (view === "list") {
    return "w-full h-auto mx-auto mb-0 rounded-lg";
  }
  if (view === "columns") {
    return "w-6 h-6";
  }

  return "w-full h-auto mx-auto mb-0 rounded-lg";
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
