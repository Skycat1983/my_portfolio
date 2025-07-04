// src/components/EasterEgg.styles.ts
import clsx from "clsx";

type ContainerOpts = {
  selected: boolean;
  drop: boolean;
  view: "icons" | "list" | "columns";
};

// ═══════════════════════════════════════════════════════════════════
// HIERARCHICAL FLOW: getTitleFrame → getTileWrapper → getContainerClasses → getImageSize → getLabelClasses
// ═══════════════════════════════════════════════════════════════════

export const getTitleFrame = (
  view: "icons" | "list" | "columns" | undefined,
  selected?: boolean
): string => {
  if (view === "icons") {
    return "flex flex-col items-center justify-center text-center w-full relative";
  }
  if (view === "list") {
    return "flex flex-row items-center";
  }
  if (view === "columns") {
    return clsx(
      "flex flex-row items-center justify-center w-full relative after:content-['›'] after:text-gray-400 after:text-lg after:ml-auto after:mr-2",
      selected && "bg-blue-500 rounded-md"
    );
  }

  return "flex flex-col items-center";
};

export const getTileWrapper = (view: "icons" | "list" | "columns"): string => {
  if (view === "icons") {
    return clsx(
      "w-full h-full flex flex-col items-center justify-center relative",
      "sm:bg-transparent"
    );
  }
  if (view === "list") {
    return clsx(
      "w-full h-full flex flex-row items-center justify-center relative",
      "sm:bg-transparent"
    );
  }
  if (view === "columns") {
    return clsx(
      "flex items-center justify-start relative ",
      "sm:bg-transparent"
    );
  }

  return clsx(
    "w-full h-full flex flex-col items-center justify-center relative",
    "sm:bg-transparent"
  );
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
    return clsx("rounded-md cursor-pointer p-1", {
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

export const getImageSize = (view: "icons" | "list" | "columns"): string => {
  if (view === "icons") {
    return "w-full h-auto mx-auto mb-0 rounded-lg";
  }
  if (view === "list") {
    return "w-full h-auto mx-auto mb-0 rounded-lg";
  }
  if (view === "columns") {
    return "w-4 h-4";
  }

  return "w-full h-auto mx-auto mb-0 rounded-lg";
};

export const getTitleBase = (view: "icons" | "list" | "columns"): string => {
  if (view === "icons") {
    return "absolute top-full left-1/2 transform -translate-x-1/2 mt-1 max-w-[140px] text-center block whitespace-pre-wrap";
  }
  if (view === "list") {
    return "text-sm font-bold mr-auto";
  }
  if (view === "columns") {
    return "text-sm font-medium text-white ml-2 flex-1 truncate";
  }

  return "max-w-[140px] text-center block";
};

export const getLabelClasses = (
  view: "icons" | "list" | "columns",
  selected: boolean
): string => {
  if (view === "icons") {
    return clsx(
      "text-white text-center text-sm font-bold leading-tight break-words px-1 py-1",
      selected && "bg-blue-500 rounded-md"
    );
  }
  if (view === "list") {
    return "text-sm font-bold mr-auto";
  }
  if (view === "columns") {
    return clsx(
      "text-sm font-medium text-white ml-2 flex-1 truncate cursor-pointer",
      selected && "bg-blue-500 px-1 rounded-md"
    );
  }

  return clsx(
    "text-sm font-bold mr-auto",
    selected && "bg-blue-500 rounded-md"
  );
};

// ═══════════════════════════════════════════════════════════════════
// LEGACY/UTILITY CONSTANTS
// ═══════════════════════════════════════════════════════════════════

export const titleBase = "max-w-[140px] text-center block";

// Unused legacy classes (kept for backwards compatibility)
export const labelClasses = (selected: boolean) =>
  clsx("text-white p-2", selected && "bg-blue-500 rounded-md");

export const tileFrame = "flex flex-col items-center";
export const imageSize = "w-full h-auto mx-auto mb-0 rounded-lg";
