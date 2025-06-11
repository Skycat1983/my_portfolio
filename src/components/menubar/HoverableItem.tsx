import { useState } from "react";
import { MenubarItem } from "../ui/menubar";

export const HoverableItem = ({
  children,

  ...props
}: React.ComponentProps<typeof MenubarItem>) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    const email = "hlaoutaris@gmail.com";
    const subject = "When can you start?";
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

    window.location.href = mailtoLink;
  };

  return (
    <MenubarItem
      {...props}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {isHovered ? "Offer Job" : children}
    </MenubarItem>
  );
};
