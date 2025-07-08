import type { CalculatorDisplayProps } from "./types";
import { calculatorStyles } from "./calculator.styles";
import { formatDisplayValue } from "./calculatorUtils";

export const CalculatorDisplay = ({
  value,
  operation,
  previousValue,
}: CalculatorDisplayProps) => {
  // Create secondary display showing previous value and operation
  const getSecondaryDisplay = (): string => {
    if (
      previousValue !== null &&
      previousValue !== undefined &&
      operation &&
      operation !== "="
    ) {
      // Format previous value for secondary display (shorter format)
      const formattedPrev =
        Math.abs(previousValue) >= 1e6
          ? previousValue.toExponential(3)
          : previousValue.toLocaleString();
      return `${formattedPrev} ${operation}`;
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
