import { DisplayDate } from "./DisplayDate";
import { MenubarOptions } from "./MenubarOptions";
import { Logo } from "../icons/LogoIcon";
import { useNewStore } from "@/hooks/useStore";
import { WifiIcon } from "../icons/WifiIcon";
import ThemeToggle from "./ThemeToggle";
import { theme } from "@/styles/theme";

export const MenubarLayout = () => {
  const operatingSystem = useNewStore((s) => s.operatingSystem);
  const currentTheme = useNewStore((s) => s.theme);

  const bgColor = theme.colors[currentTheme].background.primary;
  const borderColor = theme.colors[currentTheme].border.primary;
  const textColor = theme.colors[currentTheme].text.primary;

  return (
    <div
      className={
        operatingSystem === "mac"
          ? "absolute top-0 left-0 w-full h-11 bg-background hidden md:block"
          : "absolute bottom-0 left-0 w-full h-11 bg-background hidden md:block"
      }
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
      }}
    >
      <div
        className="w-full h-11 bg-background text-foreground flex flex-row justify-between gap-4 items-center overflow-hidden px-8"
        style={{
          color: textColor,
        }}
      >
        <div className="flex flex-row gap-8 items-center">
          <Logo />
          <MenubarOptions />
        </div>
        <div className="flex flex-row items-center gap-4">
          <ThemeToggle />
          <WifiIcon />

          <DisplayDate />
        </div>
      </div>
    </div>
  );
};
