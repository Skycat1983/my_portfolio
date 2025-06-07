import { create } from "zustand";
import { defaultNodes, type NodeType } from "../constants/nodes";

export const useStore = create((set, get) => ({
  nodes: defaultNodes,
  windows: [],
}));
