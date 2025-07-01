import React from "react";
import { FinderHeader } from "./FinderHeader";
import { FinderBody } from "./FinderBody";
import { useNewStore } from "../../../hooks/useStore";
import type { NodeEntry } from "../../../types/nodeTypes";

export const Finder = () => {
  const [view, setView] = React.useState<"icons" | "list" | "columns">("icons");
  const nodeMap = useNewStore((s) => s.nodeMap);
  const window = useNewStore((s) => s.getWindowByNodeId("finder"));
  const zIndex = window?.zIndex ?? 0;
  const rootId = useNewStore((s) => s.rootId);
  const findMany = useNewStore((s) => s.findManyNodes);
  const nodes = findMany((n) => n.parentId === rootId);

  return (
    <div className="flex flex-col h-full w-full">
      <FinderHeader zIndex={zIndex} view={view} onChangeView={setView} />
      <FinderBody />
    </div>
  );
};

// export const Finder = () => {
//   const nodeMap = useNewStore((s) => s.nodeMap);
//   const window = useNewStore((s) => s.getWindowByNodeId("finder"));
//   const zIndex = window?.zIndex;
//   const rootId = useNewStore((s) => s.rootId);
//   const findManyNodes = useNewStore((s) => s.findManyNodes);

//   const predicate = (node: NodeEntry) => node.parentId === rootId;
//   const nodes = findManyNodes(predicate);
//   console.log("FINDER_01: nodes", nodes);
//   return (
//     <div className="flex flex-col h-full w-full">
//       <FinderHeader zIndex={zIndex ?? 0} />
//       <FinderBody />
//     </div>
//   );
// };
