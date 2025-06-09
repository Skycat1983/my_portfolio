import type { MapNode, NodeMap, NodeObject } from "../constants/nodes";
import type { DirectoryObject } from "../constants/nodes";

// CONVERSION FUNCTION: Object Tree → Operational Map
export const convertObjectsToMap = (
  rootObject: DirectoryObject
): { nodeMap: NodeMap; rootId: string } => {
  const nodeMap: NodeMap = {};

  const processNode = (nodeObj: NodeObject, parentId: string | null): void => {
    // Create map node
    const mapNode: MapNode = {
      id: nodeObj.id,
      parentId,
      children: [],
      type: nodeObj.type,
      label: nodeObj.label,
      image: nodeObj.image,
    };

    // Copy type-specific properties
    if (nodeObj.type === "link") {
      mapNode.url = nodeObj.url;
    }
    if (nodeObj.type === "app" && nodeObj.action) {
      mapNode.action = nodeObj.action;
    }

    // Process children if directory
    if (nodeObj.type === "directory") {
      for (const child of nodeObj.children) {
        processNode(child, nodeObj.id);
        mapNode.children.push(child.id);
      }
    }

    nodeMap[nodeObj.id] = mapNode;
  };

  processNode(rootObject, null);
  return { nodeMap, rootId: rootObject.id };
};
