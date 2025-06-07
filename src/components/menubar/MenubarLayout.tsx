import { images } from "../../constants/images";
import { DisplayDate } from "./DisplayDate";
import { Social } from "./Social";

export const MenubarLayout = () => {
  return (
    <div className="w-full h-10 bg-gray-950 flex flex-row justify-between px-4 items-center">
      <div className="flex flex-row gap-4">
        <h3 className="text-white font-medium">File</h3>
        <h3 className="text-white font-medium">Edit</h3>
        <h3 className="text-white font-medium">View</h3>
        <h3 className="text-white font-medium">Help</h3>
      </div>
      <div className="flex flex-row gap-4">
        <Social
          imgPath={images.LINKEDIN}
          link="https://www.linkedin.com/in/heron-laoutaris/"
        />
        <Social imgPath={images.GITHUB} link="https://github.com/skycat1983" />
        <DisplayDate />
      </div>
    </div>
  );
};
