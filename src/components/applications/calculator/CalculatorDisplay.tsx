import type { CalculatorDisplayProps } from "./types";
import { calculatorStyles } from "./calculator.styles";

export const CalculatorDisplay = ({
  value,
  operation,
  previousValue,
}: CalculatorDisplayProps) => {
  // Format the display value to handle large numbers and decimals
  const formatDisplayValue = (val: string): string => {
    const num = parseFloat(val);

    // Handle special cases
    if (val === "" || val === "0") return "0";
    if (isNaN(num)) return val;

    // Format large numbers with exponential notation
    if (Math.abs(num) >= 1e15) {
      return num.toExponential(8);
    }

    // Format numbers with proper decimal places
    if (val.includes(".")) {
      return val;
    }

    // Add comma separators for large whole numbers
    if (Math.abs(num) >= 1000) {
      return num.toLocaleString();
    }

    return val;
  };

  // Create secondary display showing previous value and operation
  const getSecondaryDisplay = (): string => {
    if (
      previousValue !== null &&
      previousValue !== undefined &&
      operation &&
      operation !== "="
    ) {
      return `${previousValue.toLocaleString()} ${operation}`;
    }
    return "";
  };

  const displayValue = formatDisplayValue(value);
  const secondaryDisplay = getSecondaryDisplay();

  return (
    <div className={calculatorStyles.display.container}>
      <div className={calculatorStyles.display.secondary}>
        {secondaryDisplay}
      </div>
      <div
        className={calculatorStyles.display.primary}
        title={`Current value: ${displayValue}`}
        aria-live="polite"
        aria-label={`Calculator display showing ${displayValue}`}
      >
        {displayValue}
      </div>
    </div>
  );
};
