import { CaptchaMain } from "@/components/applications/browser/fake_pages/captcha/CaptchaMain";
import BankingPage from "./BankingPage";

export const CaptchaPage = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-red-100">
      <CaptchaMain />
      {/* <BankingPage /> */}
    </div>
  );
};
