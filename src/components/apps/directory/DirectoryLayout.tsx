import type { NodeEntry } from "../../../types/nodeTypes";
import { NodeSwitch } from "../../nodes/NodeSwitch";
import { useNewStore } from "../../../hooks/useStore";

type DirectoryLayoutProps = {
  nodes: NodeEntry[];
};

export const DirectoryLayout = ({ nodes }: DirectoryLayoutProps) => {
  const operatingSystem = useNewStore((s) => s.operatingSystem);

  return (
    <>
      {/* Mobile/Tablet: Use CSS Grid for better centering control */}
      <div className="block lg:hidden">
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(80px,_1fr))] justify-items-center gap-6 w-full md:justify-items-start">
          {nodes.map((node) => (
            <div key={node.id} className="w-20 md:w-24">
              <NodeSwitch node={node} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Use the working logic from commented code */}
      <div
        className={`hidden lg:flex flex-col w-full gap-10 h-full content-start ${
          operatingSystem === "windows" ? "flex-wrap" : "flex-wrap-reverse"
        }`}
      >
        {nodes.map((node) => (
          <div key={node.id} className="w-28 flex-shrink-0">
            <NodeSwitch node={node} />
          </div>
        ))}
      </div>
    </>
  );
};

// const getLayoutClasses = (
//   layout: LayoutType,
//   operatingSystem: OperatingSystem
// ) => {
//   if (layout === "desktop") {
//     // Windows wants normal wrapping; everything else keeps wrap-reverse
//     const wrapClass =
//       operatingSystem === "windows" ? "flex-wrap" : "flex-wrap-reverse";
//     return `flex flex-row md:flex-col ${wrapClass} content-start w-full gap-10 h-full`;
//   }
//   // "window" layout
//   return "flex flex-row flex-wrap justify-start items-start w-full gap-4 p-2";
// };

// export const DirectoryLayout = ({
//   nodes,
//   layout = "window",
//   windowId,
// }: DirectoryLayoutProps) => {
//   const operatingSystem = useNewStore((s) => s.operatingSystem);

//   return (
//     <div className={getLayoutClasses(layout, operatingSystem)}>
//       {nodes.map((node) => (
//         <NodeSwitch
//           key={node.id}
//           node={node}
//           layout={layout}
//           parentWindowId={windowId}
//         />
//       ))}
//       {!nodes.length && (
//         <div className="flex-1 flex items-center justify-center p-4">
//           <p className="text-gray-500">This folder is empty</p>
//         </div>
//       )}
//     </div>
//   );
// };
