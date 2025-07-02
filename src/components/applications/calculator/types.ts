export type CalculatorOperation = "+" | "-" | "*" | "/" | "=" | null;

export interface CalculatorState {
  display: string;
  previousValue: number | null;
  operation: CalculatorOperation;
  waitingForOperand: boolean;
  memory: number;
}

export interface CalculatorButtonProps {
  value: string;
  onClick: (value: string) => void;
  className?: string;
  type?: "number" | "operation" | "function" | "equals";
  disabled?: boolean;
}

export interface CalculatorDisplayProps {
  value: string;
  operation?: CalculatorOperation;
  previousValue?: number | null;
}

export interface CalculatorKeypadProps {
  onButtonClick: (value: string) => void;
  disabled?: boolean;
}
