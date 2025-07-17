import { useState, useEffect, useCallback } from "react";
import type { CalculatorState, CalculatorOperation } from "./types";
import { CalculatorDisplay } from "./CalculatorDisplay";
import { CalculatorKeypad } from "./CalculatorKeypad";
import { calculatorStyles } from "./calculator.styles";

const initialState: CalculatorState = {
  display: "0",
  previousValue: null,
  operation: null,
  waitingForOperand: false,
  memory: 0,
};

const Calculator = () => {
  const [state, setState] = useState<CalculatorState>(initialState);

  // Perform calculation based on operation
  const calculate = useCallback(
    (
      firstOperand: number,
      secondOperand: number,
      operation: CalculatorOperation
    ): number => {
      switch (operation) {
        case "+":
          return firstOperand + secondOperand;
        case "-":
          return firstOperand - secondOperand;
        case "*":
          return firstOperand * secondOperand;
        case "/":
          return secondOperand !== 0
            ? firstOperand / secondOperand
            : firstOperand;
        default:
          return secondOperand;
      }
    },
    []
  );

  // Handle number and decimal input
  const inputDigit = useCallback((digit: string) => {
    setState((prevState) => {
      const { display, waitingForOperand } = prevState;

      if (waitingForOperand) {
        return {
          ...prevState,
          display: digit,
          waitingForOperand: false,
        };
      }

      return {
        ...prevState,
        display: display === "0" ? digit : display + digit,
      };
    });
  }, []);

  // Handle decimal point
  const inputDecimal = useCallback(() => {
    setState((prevState) => {
      const { display, waitingForOperand } = prevState;

      if (waitingForOperand) {
        return {
          ...prevState,
          display: "0.",
          waitingForOperand: false,
        };
      }

      if (!display.includes(".")) {
        return {
          ...prevState,
          display: display + ".",
        };
      }

      return prevState;
    });
  }, []);

  // Clear all (AC button)
  const clear = useCallback(() => {
    setState(initialState);
  }, []);

  // Handle plus/minus toggle
  const toggleSign = useCallback(() => {
    setState((prevState) => {
      const { display } = prevState;
      const value = parseFloat(display);

      return {
        ...prevState,
        display: (value * -1).toString(),
      };
    });
  }, []);

  // Handle percentage
  const percentage = useCallback(() => {
    setState((prevState) => {
      const { display } = prevState;
      const value = parseFloat(display) / 100;

      return {
        ...prevState,
        display: value.toString(),
      };
    });
  }, []);

  // Handle operations (+, -, *, /, =)
  const performOperation = useCallback(
    (nextOperation: CalculatorOperation) => {
      setState((prevState) => {
        const { display, previousValue, operation, waitingForOperand } =
          prevState;
        const inputValue = parseFloat(display);

        if (previousValue === null) {
          return {
            ...prevState,
            previousValue: inputValue,
            operation: nextOperation,
            waitingForOperand: true,
          };
        }

        if (operation && waitingForOperand) {
          return {
            ...prevState,
            operation: nextOperation,
          };
        }

        const result = calculate(previousValue, inputValue, operation);

        return {
          ...prevState,
          display: String(result),
          previousValue: nextOperation === "=" ? null : result,
          operation: nextOperation === "=" ? null : nextOperation,
          waitingForOperand: nextOperation !== "=",
        };
      });
    },
    [calculate]
  );

  // Handle button clicks
  const handleButtonClick = useCallback(
    (value: string) => {
      if (/\d/.test(value)) {
        // Number input
        inputDigit(value);
      } else if (value === ".") {
        // Decimal input
        inputDecimal();
      } else if (value === "AC") {
        // Clear all
        clear();
      } else if (value === "±") {
        // Toggle sign
        toggleSign();
      } else if (value === "%") {
        // Percentage
        percentage();
      } else if (["+", "-", "*", "/", "="].includes(value)) {
        // Operations
        performOperation(value as CalculatorOperation);
      }
    },
    [inputDigit, inputDecimal, clear, toggleSign, percentage, performOperation]
  );

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;

      // Prevent default behavior for calculator keys
      if (
        /[\d.+\-*/=]/.test(key) ||
        key === "Enter" ||
        key === "Escape" ||
        key === "Backspace"
      ) {
        event.preventDefault();
      }

      if (/\d/.test(key)) {
        handleButtonClick(key);
      } else if (key === ".") {
        handleButtonClick(".");
      } else if (key === "+") {
        handleButtonClick("+");
      } else if (key === "-") {
        handleButtonClick("-");
      } else if (key === "*") {
        handleButtonClick("*");
      } else if (key === "/") {
        handleButtonClick("/");
      } else if (key === "Enter" || key === "=") {
        handleButtonClick("=");
      } else if (key === "Escape") {
        handleButtonClick("AC");
      } else if (key === "%") {
        handleButtonClick("%");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleButtonClick]);

  return (
    <div
      className={calculatorStyles.container}
      role="application"
      aria-label="Calculator"
      tabIndex={-1}
    >
      <CalculatorDisplay
        value={state.display}
        operation={state.operation}
        previousValue={state.previousValue}
      />
      <CalculatorKeypad onButtonClick={handleButtonClick} />
    </div>
  );
};

export default Calculator;
