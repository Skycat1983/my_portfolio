import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "../ui/menubar";
import { HoverableItem } from "./HoverableItem";
import { useNewStore } from "../../hooks/useStore";

export function MenubarOptions() {
  const { operatingSystem } = useNewStore();

  const char = operatingSystem === "mac" ? "⌘" : "Ctrl ";
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger className="!cursor-default">File</MenubarTrigger>
        <MenubarContent>
          <HoverableItem>
            New <MenubarShortcut>{char}N</MenubarShortcut>
          </HoverableItem>
          <HoverableItem>
            Open <MenubarShortcut>{char}O</MenubarShortcut>
          </HoverableItem>
          <MenubarSeparator />
          <HoverableItem>
            Save <MenubarShortcut>{char}S</MenubarShortcut>
          </HoverableItem>
          <HoverableItem>
            Save As <MenubarShortcut>{char}⇧S</MenubarShortcut>
          </HoverableItem>
          <MenubarSeparator />
          <HoverableItem>
            Close <MenubarShortcut>{char}W</MenubarShortcut>
          </HoverableItem>
          <HoverableItem>
            Print <MenubarShortcut>{char}P</MenubarShortcut>
          </HoverableItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="!cursor-default">Edit</MenubarTrigger>
        <MenubarContent>
          <HoverableItem>
            Undo <MenubarShortcut>{char}Z</MenubarShortcut>
          </HoverableItem>
          <HoverableItem>
            Redo <MenubarShortcut>{char}⇧Z</MenubarShortcut>
          </HoverableItem>
          <MenubarSeparator />
          <HoverableItem>
            Cut <MenubarShortcut>{char}X</MenubarShortcut>
          </HoverableItem>
          <HoverableItem>
            Copy <MenubarShortcut>{char}C</MenubarShortcut>
          </HoverableItem>
          <HoverableItem>
            Paste <MenubarShortcut>{char}V</MenubarShortcut>
          </HoverableItem>
          <MenubarSeparator />
          <HoverableItem>
            Select All <MenubarShortcut>{char}A</MenubarShortcut>
          </HoverableItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="!cursor-default">View</MenubarTrigger>
        <MenubarContent>
          <HoverableItem>Show Toolbar</HoverableItem>
          <HoverableItem>Show Sidebar</HoverableItem>
          <MenubarSeparator />
          <HoverableItem>
            Enter Full Screen <MenubarShortcut>{char}⌃F</MenubarShortcut>
          </HoverableItem>
          <MenubarSeparator />
          <HoverableItem>
            Zoom In <MenubarShortcut>{char}+</MenubarShortcut>
          </HoverableItem>
          <HoverableItem>
            Zoom Out <MenubarShortcut>{char}-</MenubarShortcut>
          </HoverableItem>
          <HoverableItem>
            Actual Size <MenubarShortcut>{char}0</MenubarShortcut>
          </HoverableItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="!cursor-default">Help</MenubarTrigger>
        <MenubarContent>
          <HoverableItem>About</HoverableItem>
          <HoverableItem>Support</HoverableItem>
          <MenubarSeparator />
          <HoverableItem>
            Keyboard Shortcuts <MenubarShortcut>{char}/</MenubarShortcut>
          </HoverableItem>
          <HoverableItem>Contact Us</HoverableItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
