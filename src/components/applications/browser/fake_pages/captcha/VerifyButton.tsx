import { Button } from "../../../../ui/button";
import { Check, X } from "lucide-react";
import LoadingSpinner from "../../../../atoms/LoadingSpinner";
import type { VerifyState } from "./types";

interface VerifyButtonProps {
  onClick: () => void;
  verifyState: VerifyState;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const VerifyButton = ({
  onClick,
  verifyState,
  onMouseEnter,
  onMouseLeave,
}: VerifyButtonProps) => {
  const getButtonStyles = () => {
    switch (verifyState) {
      case "success":
        return "ml-auto bg-green-500 text-white h-12 !rounded-none w-24 flex items-center justify-center";
      case "failure":
        return "ml-auto bg-red-500 text-white h-12 !rounded-none w-24 flex items-center justify-center";
      default:
        return "ml-auto bg-blue-500 text-white h-12 !rounded-none w-24 flex items-center justify-center";
    }
  };

  const getButtonContent = () => {
    switch (verifyState) {
      case "loading":
        return (
          <div className="scale-100">
            <LoadingSpinner />
          </div>
        );
      case "success":
        return <Check className="h-5 w-5 text-white" />;
      case "failure":
        return <X className="h-5 w-5 text-white" />;
      default:
        return <h4 className="text-white font-bold">Verify</h4>;
    }
  };

  return (
    <Button
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={getButtonStyles()}
      onClick={onClick}
      disabled={verifyState !== "idle"}
    >
      {getButtonContent()}
    </Button>
  );
};
