import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { useScreenMonitor } from "@/hooks/useScreenSize";

const Toaster = ({ position, ...props }: ToasterProps) => {
  const screenSize = useScreenMonitor();
  const { theme = "system" } = useTheme();
  const isMobile = screenSize.isXs || screenSize.isSm;

  // if the user passed a `position` explicitly, it wins.
  // otherwise on mobile we do top-center, else bottom-center
  const defaultPosition: ToasterProps["position"] = isMobile
    ? "top-center"
    : "bottom-right";

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position={position ?? defaultPosition}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
