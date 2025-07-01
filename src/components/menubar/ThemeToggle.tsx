import { useNewStore } from "../../hooks/useStore";
import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect } from "react";

const getIcon = (theme: "light" | "dark") => {
  if (theme === "light") {
    return <Sun />;
  }
  return <Moon />;
};

const ThemeToggle = () => {
  const theme = useNewStore((s) => s.theme);
  const toggleTheme = useNewStore((s) => s.toggleTheme);

  // Connect theme state to DOM
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleThemeToggle = () => {
    toggleTheme();
  };

  //   const className = "bg-red-500";

  return (
    <>
      <Button
        onClick={handleThemeToggle}
        // variant="ghost"
        size="icon"
        // className={className}
      >
        {getIcon(theme)}
      </Button>
    </>
  );
};

export default ThemeToggle;
