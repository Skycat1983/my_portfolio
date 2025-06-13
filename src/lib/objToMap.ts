import type {
  NodeEntry,
  NodeMap,
  NodeObject,
  DirectoryEntry,
  IconEntry,
  LinkEntry,
  EasterEggEntry,
  DirectoryObject,
  TerminalEntry,
  BrowserEntry,
  DocumentEntry,
  AchievementEntry,
} from "../types/nodeTypes";

// CONVERSION FUNCTION: Object Tree → Operational Map
export const convertObjectsToMap = (
  rootObject: DirectoryObject
): { nodeMap: NodeMap; rootId: string } => {
  const nodeMap: NodeMap = {};

  const processNode = (nodeObj: NodeObject, parentId: string | null): void => {
    let mapNode: NodeEntry;

    // Create type-specific map nodes using discriminated union
    if (nodeObj.type === "directory") {
      mapNode = {
        id: nodeObj.id,
        parentId,
        children: [],
        type: "directory",
        label: nodeObj.label,
      } as DirectoryEntry;

      // Process children for directories
      for (const child of nodeObj.children) {
        processNode(child, nodeObj.id);
        mapNode.children.push(child.id);
      }
    } else if (nodeObj.type === "icon") {
      mapNode = {
        id: nodeObj.id,
        parentId,
        type: "icon",
        label: nodeObj.label,
        image: nodeObj.image,
        info: nodeObj.info,
      } as IconEntry;
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
        type: "easter-egg",
        label: nodeObj.label,
        image: nodeObj.image,
        currentImageIndex: nodeObj.currentImageIndex,
        isBroken: nodeObj.isBroken,
      } as EasterEggEntry;
    } else if (nodeObj.type === "terminal") {
      mapNode = {
        id: nodeObj.id,
        parentId,
        type: "terminal",
        label: nodeObj.label,
      } as TerminalEntry;
    } else if (nodeObj.type === "browser") {
      mapNode = {
        id: nodeObj.id,
        parentId,
        type: "browser",
        label: nodeObj.label,
      } as BrowserEntry;
    } else if (nodeObj.type === "document") {
      mapNode = {
        id: nodeObj.id,
        parentId,
        type: "document",
        label: nodeObj.label,
        image: nodeObj.image,
      } as DocumentEntry;
    } else if (nodeObj.type === "achievement") {
      mapNode = {
        id: nodeObj.id,
        parentId,
        type: "achievement",
        label: nodeObj.label,
        image: nodeObj.image,
      } as AchievementEntry;
    } else {
      throw new Error(`Unknown node type: ${(nodeObj as NodeObject).type}`);
    }

    nodeMap[nodeObj.id] = mapNode;
  };

  processNode(rootObject, null);
  return { nodeMap, rootId: rootObject.id };
};
