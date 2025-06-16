import type { Window } from "../../types/storeTypes";

export const NewWindow = ({ window }: { window: Window }) => {
  const { zIndex, width, height, nodeType } = window;

  return (
    <div
      className={`relative
                  w-[${width}px] h-[${height}px]
                  border-[2px] border-red-500
                  m-10`}
      style={{ zIndex }}
    >
      {/* EDGE HANDLES */}
      {/* Top (row resize) */}
      <div
        className="absolute top-0 left-4 right-4 h-2 cursor-row-resize"
        // onMouseDown={…}
      />
      {/* Bottom (row resize) */}
      <div className="absolute bottom-0 left-4 right-4 h-2 cursor-row-resize" />
      {/* Left (col resize) */}
      <div className="absolute top-4 bottom-4 left-0 w-2 cursor-col-resize" />
      {/* Right (col resize) */}
      <div className="absolute top-4 bottom-4 right-0 w-2 cursor-col-resize" />

      {/* CORNER HANDLES */}
      {/* Top-Left */}
      <div className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize" />
      {/* Top-Right */}
      <div className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize" />
      {/* Bottom-Left */}
      <div className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize" />
      {/* Bottom-Right */}
      <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" />

      {/* CONTENT */}
      <div className="w-full h-full border-[10px] border-blue-500 cursor-help">
        {nodeType}
      </div>
    </div>
  );
};
