import type { CalculatorButtonProps } from "./types";
import { calculatorStyles } from "./calculator.styles";

export const CalculatorButton = ({
  value,
  onClick,
  className = "",
  type = "number",
  disabled = false,
}: CalculatorButtonProps) => {
  const handleClick = () => {
    if (!disabled) {
      onClick(value);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  // Get button style based on type
  const getButtonStyle = () => {
    const base = calculatorStyles.button.base;

    switch (type) {
      case "operation":
        return `${base} ${calculatorStyles.button.operation}`;
      case "function":
        return `${base} ${calculatorStyles.button.function}`;
      case "equals":
        return `${base} ${calculatorStyles.button.equals}`;
      default:
        return `${base} ${calculatorStyles.button.number}`;
    }
  };

  const buttonClassName = `${getButtonStyle()} ${className}`;

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={buttonClassName}
      aria-label={`${value} button`}
      tabIndex={0}
      type="button"
    >
      {value}
    </button>
  );
};
