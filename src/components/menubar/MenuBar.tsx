import { DisplayDate } from "./DisplayDate";
import { MenubarOptions } from "./MenubarOptions";
import { Social } from "./Social";
import { Logo } from "../icons/LogoIcon";
import { GITHUB_SMALL, LINKEDIN_SMALL } from "../../constants/images";
import { WifiIcon } from "../icons/WifiIcon";

export const MenuBar = () => {
  return (
    <div className="hidden md:flex w-full h-11 bg-neutral-900 flex flex-row justify-between px-4 items-center overflow-hidden">
      <div className="flex flex-row gap-4 items-center">
        <Logo />
        <MenubarOptions />
      </div>
      <div className="flex flex-row items-center">
        <WifiIcon />
        <Social
          imgPath={LINKEDIN_SMALL}
          link="https://www.linkedin.com/in/heron-laoutaris/"
        />
        <Social imgPath={GITHUB_SMALL} link="https://github.com/skycat1983" />
        <DisplayDate />
      </div>
    </div>
  );
};
