export interface CaptchaData {
  title?: string;
  src: string;
  task: string;
  text: string | null;
  correctAnswers: number[];
}

export type VerifyState = "idle" | "loading" | "success" | "failure";

export interface CaptchaSlideProps {
  data: CaptchaData;
  selected: number[];
  onToggleSquare: (id: number) => void;
  onVerify: () => void;
  gridClassName: string;
  onGridClassChange: (className: string) => void;
  divsToRender: number;
  verifyState: VerifyState;
  currentIndex: number;
  totalCaptchas: number;
}
