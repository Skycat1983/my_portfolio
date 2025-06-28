import type { NodeEntry } from "../../../types/nodeTypes";
import { NodeSwitch } from "../../nodes/NodeSwitch";
import { useNewStore } from "../../../hooks/useStore";
import type { OperatingSystem } from "../../../store/systemState/systemSlice";

type LayoutType = "desktop" | "window";

type DirectoryLayoutProps = {
  nodes: NodeEntry[];
  layout: LayoutType;
  windowId: string; // Pass windowId for window context navigation
};

const getLayoutClasses = (
  layout: LayoutType,
  operatingSystem: OperatingSystem
) => {
  if (layout === "desktop") {
    // Windows wants normal wrapping; everything else keeps wrap-reverse
    const wrapClass =
      operatingSystem === "windows" ? "flex-wrap" : "flex-wrap-reverse";
    return `flex flex-row md:flex-col ${wrapClass} content-start w-full gap-10 h-full`;
  }
  // "window" layout
  return "flex flex-row flex-wrap justify-start items-start w-full gap-4 p-2";
};

export const DirectoryLayout = ({
  nodes,
  layout = "window",
  windowId,
}: DirectoryLayoutProps) => {
  const operatingSystem = useNewStore((s) => s.operatingSystem);

  return (
    <>
      <div className="flex flex-row flex-wrap">
        {nodes.map((node) => (
          <NodeSwitch key={node.id} node={node} />
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
