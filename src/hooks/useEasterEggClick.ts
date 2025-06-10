import { useStore } from "./useStore";

export const useEasterEggClick = () => {
  const { getNode, cycleEasterEgg, getEasterEggCurrentImage } = useStore();

  const handleEasterEggClick = (nodeId: string) => {
    const node = getNode(nodeId);

    if (!node || node.type !== "easter-egg") {
      console.log("handleEasterEggClick: not an easter egg");
      return;
    }

    console.log("handleEasterEggClick: cycling easter egg", nodeId);
    cycleEasterEgg(nodeId);
  };

  const getEasterEggImage = (nodeId: string): string => {
    return getEasterEggCurrentImage(nodeId);
  };

  return {
    handleEasterEggClick,
    getEasterEggImage,
  };
};
