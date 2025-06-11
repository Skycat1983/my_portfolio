import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "../ui/menubar";
import { HoverableItem } from "./HoverableItem";

export function MenubarOptions() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <HoverableItem>
            New <MenubarShortcut>⌘N</MenubarShortcut>
          </HoverableItem>
          <HoverableItem>
            Open <MenubarShortcut>⌘O</MenubarShortcut>
          </HoverableItem>
          <MenubarSeparator />
          <HoverableItem>
            Save <MenubarShortcut>⌘S</MenubarShortcut>
          </HoverableItem>
          <HoverableItem>
            Save As <MenubarShortcut>⇧⌘S</MenubarShortcut>
          </HoverableItem>
          <MenubarSeparator />
          <HoverableItem>
            Close <MenubarShortcut>⌘W</MenubarShortcut>
          </HoverableItem>
          <HoverableItem>
            Print <MenubarShortcut>⌘P</MenubarShortcut>
          </HoverableItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <HoverableItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </HoverableItem>
          <HoverableItem>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </HoverableItem>
          <MenubarSeparator />
          <HoverableItem>
            Cut <MenubarShortcut>⌘X</MenubarShortcut>
          </HoverableItem>
          <HoverableItem>
            Copy <MenubarShortcut>⌘C</MenubarShortcut>
          </HoverableItem>
          <HoverableItem>
            Paste <MenubarShortcut>⌘V</MenubarShortcut>
          </HoverableItem>
          <MenubarSeparator />
          <HoverableItem>
            Select All <MenubarShortcut>⌘A</MenubarShortcut>
          </HoverableItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <HoverableItem>Show Toolbar</HoverableItem>
          <HoverableItem>Show Sidebar</HoverableItem>
          <MenubarSeparator />
          <HoverableItem>
            Enter Full Screen <MenubarShortcut>⌃⌘F</MenubarShortcut>
          </HoverableItem>
          <MenubarSeparator />
          <HoverableItem>
            Zoom In <MenubarShortcut>⌘+</MenubarShortcut>
          </HoverableItem>
          <HoverableItem>
            Zoom Out <MenubarShortcut>⌘-</MenubarShortcut>
          </HoverableItem>
          <HoverableItem>
            Actual Size <MenubarShortcut>⌘0</MenubarShortcut>
          </HoverableItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Help</MenubarTrigger>
        <MenubarContent>
          <HoverableItem>About</HoverableItem>
          <HoverableItem>Support</HoverableItem>
          <MenubarSeparator />
          <HoverableItem>
            Keyboard Shortcuts <MenubarShortcut>⌘/</MenubarShortcut>
          </HoverableItem>
          <HoverableItem>Contact Us</HoverableItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
