import { DisplayDate } from "./DisplayDate";
import { MenubarOptions } from "./MenubarOptions";
import { Social } from "./Social";
import { Logo } from "../icons/Logo";
import { useNewStore } from "../../hooks/useNewStore";
import { GITHUB_SMALL, LINKEDIN_SMALL } from "../../constants/images";

export const MenubarLayout = () => {
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  return (
    <div
      className={
        operatingSystem === "mac"
          ? "absolute top-0 left-0 w-full h-11 bg-neutral-900"
          : "absolute bottom-0 left-0 w-full h-11 bg-blue-100"
      }
    >
      <div className="w-full h-11 bg-neutral-900 flex flex-row justify-between px-4 items-center overflow-hidden">
        <div className="flex flex-row gap-4 items-center">
          <Logo />
          <MenubarOptions />
        </div>
        <div className="flex flex-row gap-4">
          <Social
            imgPath={LINKEDIN_SMALL}
            link="https://www.linkedin.com/in/heron-laoutaris/"
          />
          <Social imgPath={GITHUB_SMALL} link="https://github.com/skycat1983" />
          <DisplayDate />
        </div>
      </div>
    </div>
  );
};
