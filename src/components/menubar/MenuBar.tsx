import { GITHUB_IMG, LINKEDIN_IMG } from "../../constants";
import { DisplayDate } from "./DisplayDate";
import { Social } from "./Social";

export const MenuBar = () => {
  return (
    <div className="w-full h-10 bg-gray-950 flex flex-row justify-between px-4 items-center">
      <div>hello</div>
      <div className="flex flex-row gap-4">
        <Social
          imgPath={LINKEDIN_IMG}
          link="https://www.linkedin.com/in/heron-laoutaris/"
        />
        <Social imgPath={GITHUB_IMG} link="https://github.com/skycat1983" />
        <DisplayDate />
      </div>
    </div>
  );
};
