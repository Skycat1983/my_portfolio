import { MenubarLayout } from "../components/menubar/MenubarLayout";
import { WindowLayout } from "../components/window/WindowLayout";
import { useNewStore } from "../hooks/useNewStore";
import { useNodeDrag } from "../hooks/useNodeDrag";
import Window from "../components/window/Window";
import { Terminal } from "../components/terminal/Terminal";
import { Weather } from "../components/widgets/Weather";
// import { Weather } from "../components/widgets/Weather";

export const Desktop = () => {
  const { rootId, getChildren, openWindows, isTerminalOpen, closeTerminal } =
    useNewStore();

  // Initialize drag and drop functionality
  const dragHandlers = useNodeDrag();

  const desktopChildren = getChildren(rootId);

  return (
    <div className="w-screen h-screen bg-gray-900 relative overflow-hidden background-image">
      <MenubarLayout />
      <div
        className="p-10 h-full"
        // Make desktop a drop target for moving items back to desktop
        onDragOver={
          dragHandlers
            ? (e) => dragHandlers.handleDragOver(e, rootId)
            : undefined
        }
        onDragEnter={
          dragHandlers
            ? (e) => dragHandlers.handleDragEnter(e, rootId)
            : undefined
        }
        onDragLeave={dragHandlers?.handleDragLeave}
        onDrop={
          dragHandlers ? (e) => dragHandlers.handleDrop(e, rootId) : undefined
        }
      >
        {/* Render all open windows */}
        {openWindows.map((windowState) => (
          <Window
            key={windowState.id}
            nodeId={windowState.id}
            zIndex={windowState.zIndex}
            dragHandlers={dragHandlers}
          />
        ))}

        {/* Conditionally render terminal */}
        {isTerminalOpen && <Terminal onClose={closeTerminal} />}

        <Weather />

        <WindowLayout nodes={desktopChildren} layout="desktop" />
      </div>
    </div>
  );
};
