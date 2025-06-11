import React, { useState } from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "../ui/menubar";
import { images } from "../../constants/images";

const HoverableMenuItem = ({
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

export function MenubarOptions() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>
          <img src={images.APPLE} alt="apple" className="w-4 h-4" />
        </MenubarTrigger>
        <MenubarContent>
          <HoverableMenuItem>
            New <MenubarShortcut>⌘N</MenubarShortcut>
          </HoverableMenuItem>
          <HoverableMenuItem>
            Open <MenubarShortcut>⌘O</MenubarShortcut>
          </HoverableMenuItem>
          <MenubarSeparator />
          <HoverableMenuItem>
            Save <MenubarShortcut>⌘S</MenubarShortcut>
          </HoverableMenuItem>
          <HoverableMenuItem>
            Save As <MenubarShortcut>⇧⌘S</MenubarShortcut>
          </HoverableMenuItem>
          <MenubarSeparator />
          <HoverableMenuItem>
            Close <MenubarShortcut>⌘W</MenubarShortcut>
          </HoverableMenuItem>
          <HoverableMenuItem>
            Print <MenubarShortcut>⌘P</MenubarShortcut>
          </HoverableMenuItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <HoverableMenuItem>
            New <MenubarShortcut>⌘N</MenubarShortcut>
          </HoverableMenuItem>
          <HoverableMenuItem>
            Open <MenubarShortcut>⌘O</MenubarShortcut>
          </HoverableMenuItem>
          <MenubarSeparator />
          <HoverableMenuItem>
            Save <MenubarShortcut>⌘S</MenubarShortcut>
          </HoverableMenuItem>
          <HoverableMenuItem>
            Save As <MenubarShortcut>⇧⌘S</MenubarShortcut>
          </HoverableMenuItem>
          <MenubarSeparator />
          <HoverableMenuItem>
            Close <MenubarShortcut>⌘W</MenubarShortcut>
          </HoverableMenuItem>
          <HoverableMenuItem>
            Print <MenubarShortcut>⌘P</MenubarShortcut>
          </HoverableMenuItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <HoverableMenuItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </HoverableMenuItem>
          <HoverableMenuItem>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </HoverableMenuItem>
          <MenubarSeparator />
          <HoverableMenuItem>
            Cut <MenubarShortcut>⌘X</MenubarShortcut>
          </HoverableMenuItem>
          <HoverableMenuItem>
            Copy <MenubarShortcut>⌘C</MenubarShortcut>
          </HoverableMenuItem>
          <HoverableMenuItem>
            Paste <MenubarShortcut>⌘V</MenubarShortcut>
          </HoverableMenuItem>
          <MenubarSeparator />
          <HoverableMenuItem>
            Select All <MenubarShortcut>⌘A</MenubarShortcut>
          </HoverableMenuItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <HoverableMenuItem>Show Toolbar</HoverableMenuItem>
          <HoverableMenuItem>Show Sidebar</HoverableMenuItem>
          <MenubarSeparator />
          <HoverableMenuItem>
            Enter Full Screen <MenubarShortcut>⌃⌘F</MenubarShortcut>
          </HoverableMenuItem>
          <MenubarSeparator />
          <HoverableMenuItem>
            Zoom In <MenubarShortcut>⌘+</MenubarShortcut>
          </HoverableMenuItem>
          <HoverableMenuItem>
            Zoom Out <MenubarShortcut>⌘-</MenubarShortcut>
          </HoverableMenuItem>
          <HoverableMenuItem>
            Actual Size <MenubarShortcut>⌘0</MenubarShortcut>
          </HoverableMenuItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Help</MenubarTrigger>
        <MenubarContent>
          <HoverableMenuItem>About</HoverableMenuItem>
          <HoverableMenuItem>Support</HoverableMenuItem>
          <MenubarSeparator />
          <HoverableMenuItem>
            Keyboard Shortcuts <MenubarShortcut>⌘/</MenubarShortcut>
          </HoverableMenuItem>
          <HoverableMenuItem>Contact Us</HoverableMenuItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
