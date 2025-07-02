import type { CalculatorKeypadProps } from "./types";
import { CalculatorButton } from "./CalculatorButton";
import { calculatorStyles, buttonLayout } from "./calculator.styles";

export const CalculatorKeypad = ({
  onButtonClick,
  disabled = false,
}: CalculatorKeypadProps) => {
  return (
    <div className={calculatorStyles.keypad.container}>
      {buttonLayout.flat().map((button, index) => (
        <CalculatorButton
          key={`${button.value}-${index}`}
          value={button.value}
          onClick={onButtonClick}
          type={button.type}
          className={"className" in button ? button.className : ""}
          disabled={disabled}
        />
      ))}
    </div>
  );
};
