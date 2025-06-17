import { LOGO_MAC, LOGO_MS } from "../../constants/images";
import { useNewStore } from "../../store/useStore";

export const Logo = () => {
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  const toggleOS = useNewStore((s) => s.toggleOS);
  const unlockOperatingSystemAchievement = useNewStore(
    (s) => s.unlockOperatingSystemAchievement
  );
  const classNames =
    "flex items-center justify-center" +
    (operatingSystem === "mac" ? " cursor-pointer  w-6 h-6" : " w-8 h-8");

  const handleClick = () => {
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
        src={operatingSystem === "mac" ? LOGO_MAC : LOGO_MS}
        alt="logo"
        className="w-6 h-6"
      />
    </div>
  );
};
