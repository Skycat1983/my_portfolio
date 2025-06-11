import { images } from "../../constants/images";
import { DisplayDate } from "./DisplayDate";
import { MenubarOptions } from "./MenubarOptions";
import { Social } from "./Social";
import { Logo } from "../Logo";
import { useNewStore } from "../../hooks/useNewStore";

export const MenubarLayout = () => {
  const os = useNewStore((s) => s.os);
  return (
    <div
      className={
        os === "mac"
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
            imgPath={images.LINKEDIN_SMALL}
            link="https://www.linkedin.com/in/heron-laoutaris/"
          />
          <Social
            imgPath={images.GITHUB_SMALL}
            link="https://github.com/skycat1983"
          />
          <DisplayDate />
        </div>
      </div>
    </div>
  );
};
