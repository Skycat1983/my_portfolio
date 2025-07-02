import type {
  NodeEntry,
  NodeMap,
  NodeObject,
  DirectoryEntry,
  LinkEntry,
  EasterEggEntry,
  ApplicationEntry,
} from "../types/nodeTypes";

// CONVERSION FUNCTION: Object Tree → Operational Map
export const convertObjectsToMap = (
  rootObject: NodeObject
): { nodeMap: NodeMap; rootId: string } => {
  const nodeMap: NodeMap = {};

  const processNode = (nodeObj: NodeObject, parentId: string | null): void => {
    let mapNode: NodeEntry;

    // Create type-specific map nodes using discriminated union
    switch (nodeObj.type) {
      case "directory":
        mapNode = {
          id: nodeObj.id,
          parentId,
          type: "directory",
          label: nodeObj.label,
          image: nodeObj.image,
          componentKey: nodeObj.componentKey,
          children: [], // Will be populated below
        } as DirectoryEntry;

        // Process children for directories
        for (const child of nodeObj.children) {
          processNode(child, nodeObj.id);
          mapNode.children.push(child.id);
        }
        break;

      case "application":
        mapNode = {
          id: nodeObj.id,
          parentId,
          type: "application",
          label: nodeObj.label,
          image: nodeObj.image,
          componentKey: nodeObj.componentKey,
        } as ApplicationEntry;
        break;

      case "link":
        mapNode = {
          id: nodeObj.id,
          parentId,
          type: "link",
          label: nodeObj.label,
          image: nodeObj.image,
          url: nodeObj.url,
        } as LinkEntry;
        break;

      case "easter-egg":
        mapNode = {
          id: nodeObj.id,
          parentId,
          type: "easter-egg",
          label: nodeObj.label,
          image: nodeObj.image,
          currentImageIndex: nodeObj.currentImageIndex,
          isBroken: nodeObj.isBroken,
        } as EasterEggEntry;
        break;

      default:
        throw new Error(`Unknown node type: ${(nodeObj as NodeObject).type}`);
    }

    nodeMap[nodeObj.id] = mapNode;
  };

  processNode(rootObject, null);
  return { nodeMap, rootId: rootObject.id };
};
