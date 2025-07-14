import type {
  NodeEntry,
  NodeMap,
  NodeObject,
  DirectoryEntry,
  LinkEntry,
  EasterEggEntry,
  ApplicationEntry,
  FunctionEntry,
  DocumentEntry,
} from "../components/nodes/nodeTypes";

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
          alternativeImage: nodeObj.alternativeImage ?? null,
          applicationRegistryId: nodeObj.applicationRegistryId,
          macExtension: nodeObj.macExtension,
          windowsExtension: nodeObj.windowsExtension,
          children: [], // Will be populated below
          dateModified: nodeObj.dateModified,
          size: null, // Always null for directories
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
          alternativeImage: nodeObj.alternativeImage ?? null,
          applicationId: nodeObj.applicationId,
          applicationRegistryId: nodeObj.applicationRegistryId,
          macExtension: nodeObj.macExtension,
          windowsExtension: nodeObj.windowsExtension,
          dateModified: nodeObj.dateModified,
          size: nodeObj.size,
        } as ApplicationEntry;
        break;

      case "link":
        mapNode = {
          id: nodeObj.id,
          parentId,
          type: "link",
          label: nodeObj.label,
          image: nodeObj.image,
          alternativeImage: nodeObj.alternativeImage ?? null,
          url: nodeObj.url,
          macExtension: nodeObj.macExtension,
          windowsExtension: nodeObj.windowsExtension,
          dateModified: nodeObj.dateModified,
          size: nodeObj.size,
        } as LinkEntry;
        break;

      case "easter-egg":
        mapNode = {
          id: nodeObj.id,
          parentId,
          type: "easter-egg",
          label: nodeObj.label,
          image: nodeObj.image,
          alternativeImage: nodeObj.alternativeImage ?? null,
          isBroken: nodeObj.isBroken,
          macExtension: nodeObj.macExtension,
          windowsExtension: nodeObj.windowsExtension,
          dateModified: nodeObj.dateModified,
          size: nodeObj.size,
        } as EasterEggEntry;
        break;

      case "function":
        mapNode = {
          id: nodeObj.id,
          parentId,
          type: "function",
          label: nodeObj.label,
          image: nodeObj.image,
          alternativeImage: nodeObj.alternativeImage ?? null,
          functionKey: nodeObj.functionKey,
          macExtension: nodeObj.macExtension,
          windowsExtension: nodeObj.windowsExtension,
          dateModified: nodeObj.dateModified,
          size: nodeObj.size,
        } as FunctionEntry;
        break;

      case "document":
        mapNode = {
          id: nodeObj.id,
          parentId,
          type: "document",
          label: nodeObj.label,
          image: nodeObj.image,
          alternativeImage: nodeObj.alternativeImage ?? null,
          applicationId: nodeObj.applicationId,
          applicationRegistryId: nodeObj.applicationRegistryId,
          macExtension: nodeObj.macExtension,
          windowsExtension: nodeObj.windowsExtension,
          dateModified: nodeObj.dateModified,
          size: nodeObj.size,
        } as DocumentEntry;
        break;

      default:
        throw new Error(`Unknown node type: ${(nodeObj as NodeObject).type}`);
    }

    nodeMap[nodeObj.id] = mapNode;
  };

  processNode(rootObject, null);
  return { nodeMap, rootId: rootObject.id };
};
