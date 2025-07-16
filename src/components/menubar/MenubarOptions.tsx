import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "../ui/menubar";
import { HoverableItem } from "./HoverableItem";
import { useNewStore } from "@/hooks/useStore";
import { theme } from "@/styles/theme";

export function MenubarOptions() {
  const themeMode = useNewStore((s) => s.theme);
  const { operatingSystem } = useNewStore();

  const char = operatingSystem === "mac" ? "⌘" : "Ctrl ";

  const textColor = theme.colors[themeMode].text.primary;
  const bgColor = theme.colors[themeMode].background.primary;

  const triggerStyle = {
    color: textColor,
    backgroundColor: bgColor,
    padding: "6px 12px",
    cursor: "default",
  };

  const itemStyle = {
    color: textColor,
    backgroundColor: "transparent",
  };

  const menuStyle = {
    backgroundColor: bgColor,
  };

  const separatorStyle = {
    backgroundColor: bgColor,
    height: "1px",
    margin: "4px 0",
  };

  return (
    <Menubar style={{ display: "flex", gap: 0 }}>
      <MenubarMenu>
        <MenubarTrigger style={triggerStyle}>File</MenubarTrigger>
        <MenubarContent style={menuStyle}>
          <HoverableItem style={itemStyle}>
            New <MenubarShortcut>{char}N</MenubarShortcut>
          </HoverableItem>
          <HoverableItem style={itemStyle}>
            Open <MenubarShortcut>{char}O</MenubarShortcut>
          </HoverableItem>
          <MenubarSeparator style={separatorStyle} />
          <HoverableItem style={itemStyle}>
            Save <MenubarShortcut>{char}S</MenubarShortcut>
          </HoverableItem>
          <HoverableItem style={itemStyle}>
            Save As <MenubarShortcut>{char}⇧S</MenubarShortcut>
          </HoverableItem>
          <MenubarSeparator style={separatorStyle} />
          <HoverableItem style={itemStyle}>
            Close <MenubarShortcut>{char}W</MenubarShortcut>
          </HoverableItem>
          <HoverableItem style={itemStyle}>
            Print <MenubarShortcut>{char}P</MenubarShortcut>
          </HoverableItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger style={triggerStyle}>Edit</MenubarTrigger>
        <MenubarContent style={menuStyle}>
          <HoverableItem style={itemStyle}>
            Undo <MenubarShortcut>{char}Z</MenubarShortcut>
          </HoverableItem>
          <HoverableItem style={itemStyle}>
            Redo <MenubarShortcut>{char}⇧Z</MenubarShortcut>
          </HoverableItem>
          <MenubarSeparator style={separatorStyle} />
          <HoverableItem style={itemStyle}>
            Cut <MenubarShortcut>{char}X</MenubarShortcut>
          </HoverableItem>
          <HoverableItem style={itemStyle}>
            Copy <MenubarShortcut>{char}C</MenubarShortcut>
          </HoverableItem>
          <HoverableItem style={itemStyle}>
            Paste <MenubarShortcut>{char}V</MenubarShortcut>
          </HoverableItem>
          <MenubarSeparator style={separatorStyle} />
          <HoverableItem style={itemStyle}>
            Select All <MenubarShortcut>{char}A</MenubarShortcut>
          </HoverableItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger style={triggerStyle}>View</MenubarTrigger>
        <MenubarContent style={menuStyle}>
          <HoverableItem style={itemStyle}>Show Toolbar</HoverableItem>
          <HoverableItem style={itemStyle}>Show Sidebar</HoverableItem>
          <MenubarSeparator style={separatorStyle} />
          <HoverableItem style={itemStyle}>
            Enter Full Screen <MenubarShortcut>{char}⌃F</MenubarShortcut>
          </HoverableItem>
          <MenubarSeparator style={separatorStyle} />
          <HoverableItem style={itemStyle}>
            Zoom In <MenubarShortcut>{char}+</MenubarShortcut>
          </HoverableItem>
          <HoverableItem style={itemStyle}>
            Zoom Out <MenubarShortcut>{char}-</MenubarShortcut>
          </HoverableItem>
          <HoverableItem style={itemStyle}>
            Actual Size <MenubarShortcut>{char}0</MenubarShortcut>
          </HoverableItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger style={triggerStyle}>Help</MenubarTrigger>
        <MenubarContent style={menuStyle}>
          <HoverableItem style={itemStyle}>About</HoverableItem>
          <HoverableItem style={itemStyle}>Support</HoverableItem>
          <MenubarSeparator style={separatorStyle} />
          <HoverableItem style={itemStyle}>
            Keyboard Shortcuts <MenubarShortcut>{char}/</MenubarShortcut>
          </HoverableItem>
          <HoverableItem style={itemStyle}>Contact Us</HoverableItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
