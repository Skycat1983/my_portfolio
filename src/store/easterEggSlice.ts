import { EGG_BROKEN } from "../constants/nodes";
import type { EasterEggEntry } from "../types/nodeTypes";
import type { BaseStoreState, SetState, GetState } from "../types/storeTypes";

interface EasterEggActions {
  cycleEasterEgg: (nodeId: EasterEggEntry["id"]) => void;
  breakEasterEgg: (nodeId: EasterEggEntry["id"]) => void;
  getEasterEggCurrentImage: (nodeId: EasterEggEntry["id"]) => string;
}

export type EasterEggSlice = EasterEggActions;

export const createEasterEggSlice = (
  set: SetState<BaseStoreState>,
  get: GetState<BaseStoreState>
): EasterEggSlice => ({
  // cycle through the images of an easter egg
  cycleEasterEgg: (nodeId: EasterEggEntry["id"]) => {
    console.log("cycleEasterEgg in easterEggSlice: cycling easter egg", nodeId);

    const currentState = get();
    const node = currentState.nodeMap[nodeId] as EasterEggEntry;

    // Don't cycle if broken
    if (node.isBroken) return;

    // Cycle to next image (wrap around to 0 after last image)
    const nextIndex = (node.currentImageIndex + 1) % node.image.length;

    set((state) => ({
      nodeMap: {
        ...state.nodeMap,
        [nodeId]: {
          ...node,
          currentImageIndex: nextIndex,
        },
      },
    }));
  },

  breakEasterEgg: (nodeId: EasterEggEntry["id"]) => {
    console.log(
      "breakEasterEgg in easterEggSlice: breaking easter egg",
      nodeId
    );

    const currentState = get();
    const node = currentState.nodeMap[nodeId] as EasterEggEntry;

    set((state) => ({
      nodeMap: {
        ...state.nodeMap,
        [nodeId]: {
          ...node,
          isBroken: true,
        },
      },
    }));
  },

  getEasterEggCurrentImage: (nodeId: EasterEggEntry["id"]): string => {
    const currentState = get();
    const node = currentState.nodeMap[nodeId] as EasterEggEntry;

    // If broken, return broken image
    if (node.isBroken) return EGG_BROKEN;

    // Return current image from array
    return node.image[node.currentImageIndex] || node.image[0];
  },
});
