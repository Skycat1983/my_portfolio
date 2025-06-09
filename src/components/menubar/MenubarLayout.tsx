import { images } from "../../constants/images";
import { DisplayDate } from "./DisplayDate";
import { MenubarOptions } from "./MenubarOptions";
import { Social } from "./Social";

export const MenubarLayout = () => {
  return (
    <div className="w-full h-11 bg-neutral-900 flex flex-row justify-between px-4 items-center overflow-hidden">
      <div className="flex flex-row gap-4">
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
  );
};
