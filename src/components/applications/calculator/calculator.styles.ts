export const calculatorStyles = {
  container:
    "flex flex-col w-full h-full bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden",

  display: {
    container:
      "bg-black dark:bg-gray-800 p-6 min-h-[100px] flex flex-col justify-end",
    primary: "text-right text-4xl md:text-5xl font-light text-white truncate",
    secondary: "text-right text-sm text-gray-400 mb-1 h-4",
  },

  keypad: {
    container: "flex-1 grid grid-cols-4 gap-1 p-2 bg-gray-200 dark:bg-gray-800",
  },

  button: {
    base:
      "h-16 md:h-20 rounded-lg font-semibold text-lg md:text-xl " +
      "transition-all duration-150 active:scale-95 " +
      "focus:outline-none focus:ring-2 focus:ring-offset-2 " +
      "disabled:opacity-50 disabled:cursor-not-allowed",

    number:
      "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 " +
      "text-gray-900 dark:text-gray-100 focus:ring-blue-500",

    operation:
      "bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-400",

    function:
      "bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500 " +
      "text-gray-900 dark:text-gray-100 focus:ring-gray-400",

    equals:
      "bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-400",

    zero: "col-span-2", // Special styling for zero button (spans 2 columns)
  },
};

export const buttonLayout = [
  [
    { value: "AC", type: "function" as const, label: "All Clear" },
    { value: "±", type: "function" as const, label: "Plus/Minus" },
    { value: "%", type: "function" as const, label: "Percentage" },
    { value: "/", type: "operation" as const, label: "Divide" },
  ],
  [
    { value: "7", type: "number" as const, label: "7" },
    { value: "8", type: "number" as const, label: "8" },
    { value: "9", type: "number" as const, label: "9" },
    { value: "*", type: "operation" as const, label: "Multiply" },
  ],
  [
    { value: "4", type: "number" as const, label: "4" },
    { value: "5", type: "number" as const, label: "5" },
    { value: "6", type: "number" as const, label: "6" },
    { value: "-", type: "operation" as const, label: "Subtract" },
  ],
  [
    { value: "1", type: "number" as const, label: "1" },
    { value: "2", type: "number" as const, label: "2" },
    { value: "3", type: "number" as const, label: "3" },
    { value: "+", type: "operation" as const, label: "Add" },
  ],
  [
    {
      value: "0",
      type: "number" as const,
      label: "0",
      className: "col-span-2",
    },
    { value: ".", type: "number" as const, label: "Decimal" },
    { value: "=", type: "equals" as const, label: "Equals" },
  ],
] as const;
