import { useNewStore } from "../../../hooks/useStore";

export const useMobileNodes = () => {
  const nodeMap = useNewStore((s) => s.nodeMap);

  console.log("nodeMap", nodeMap);

  return Object.keys(nodeMap).filter((key) => {
    const node = nodeMap[key];
    return node.type !== "directory" && node.type !== "icon";
  });
};
