import {
  APPLE_BLACK,
  // APPLE_WHITE,
  LOGO_MAC,
  LOGO_MS,
} from "@/constants/images";
import { useNewStore } from "@/hooks/useStore";

export const Logo = () => {
  const theme = useNewStore((s) => s.theme);
  const APPLE_LOGO = theme === "dark" ? LOGO_MAC : APPLE_BLACK;
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  const toggleOS = useNewStore((s) => s.toggleOS);
  const unlockOperatingSystemAchievement = useNewStore(
    (s) => s.unlockOperatingSystemAchievement
  );
  const classNames =
    "flex items-center justify-center" +
    (operatingSystem === "mac" ? " cursor-pointer  w-6 h-6" : " w-8 h-8");

  const handleClick = () => {
    console.log("LogoIcon: handleClick");
    toggleOS();
    unlockOperatingSystemAchievement();
  };

  return (
    <div
      className={classNames}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <img
        src={operatingSystem === "mac" ? APPLE_LOGO : LOGO_MS}
        alt="logo"
        className="w-6 h-6"
      />
    </div>
  );
};
