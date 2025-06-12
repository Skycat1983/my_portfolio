import { LOGO_MAC, LOGO_MS } from "../../constants/images";
import { useNewStore } from "../../hooks/useNewStore";

export const Logo = () => {
  const os = useNewStore((s) => s.os);
  const toggleOS = useNewStore((s) => s.toggleOS);

  const classNames =
    "flex items-center justify-center" +
    (os === "mac" ? " cursor-pointer  w-6 h-6" : " w-8 h-8");

  return (
    <div className={classNames} onClick={toggleOS} role="button" tabIndex={0}>
      <img src={os === "mac" ? LOGO_MAC : LOGO_MS} alt="logo" />
    </div>
  );
};
