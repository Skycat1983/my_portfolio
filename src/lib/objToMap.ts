import type {
  MapNode,
  NodeMap,
  NodeObject,
  DirectoryEntry,
  AppEntry,
  LinkEntry,
  EasterEggEntry,
} from "../constants/nodes";
import type { DirectoryObject } from "../constants/nodes";

// CONVERSION FUNCTION: Object Tree → Operational Map
export const convertObjectsToMap = (
  rootObject: DirectoryObject
): { nodeMap: NodeMap; rootId: string } => {
  const nodeMap: NodeMap = {};

  const processNode = (nodeObj: NodeObject, parentId: string | null): void => {
    let mapNode: MapNode;

    // Create type-specific map nodes using discriminated union
    if (nodeObj.type === "directory") {
      mapNode = {
        id: nodeObj.id,
        parentId,
        children: [],
        type: "directory",
        label: nodeObj.label,
        image: nodeObj.image,
      } as DirectoryEntry;

      // Process children for directories
      for (const child of nodeObj.children) {
        processNode(child, nodeObj.id);
        mapNode.children.push(child.id);
      }
    } else if (nodeObj.type === "app") {
      mapNode = {
        id: nodeObj.id,
        parentId,
        type: "app",
        label: nodeObj.label,
        image: nodeObj.image,
        ...(nodeObj.action && { action: nodeObj.action }),
      } as AppEntry;
    } else if (nodeObj.type === "link") {
      mapNode = {
        id: nodeObj.id,
        parentId,
        type: "link",
        label: nodeObj.label,
        image: nodeObj.image,
        url: nodeObj.url,
      } as LinkEntry;
    } else if (nodeObj.type === "easter-egg") {
      mapNode = {
        id: nodeObj.id,
        parentId,
        children: [],
        type: "easter-egg",
        label: nodeObj.label,
        image: nodeObj.image,
      } as EasterEggEntry;
    } else {
      throw new Error(`Unknown node type: ${(nodeObj as NodeObject).type}`);
    }

    nodeMap[nodeObj.id] = mapNode;
  };

  processNode(rootObject, null);
  return { nodeMap, rootId: rootObject.id };
};
