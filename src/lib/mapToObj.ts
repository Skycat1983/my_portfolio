import type {
  DirectoryObject,
  LinkObject,
  NodeMap,
  NodeObject,
} from "../types/nodeTypes";

// REVERSE CONVERSION: Operational Map → Human-readable Object (for debugging/visualization)
export const convertMapToObjects = (
  nodeMap: NodeMap,
  rootId: string
): DirectoryObject => {
  const buildObject = (nodeId: string): NodeObject => {
    const mapNode = nodeMap[nodeId];
    if (!mapNode) {
      throw new Error(`Node with id '${nodeId}' not found in map`);
    }

    switch (mapNode.type) {
      case "application":
        return {
          id: mapNode.id,
          type: "application",
          label: mapNode.label,
          image: mapNode.image,
          componentKey: mapNode.componentKey,
        };

      case "link":
        return {
          id: mapNode.id,
          type: "link",
          label: mapNode.label,
          image: mapNode.image,
          url: mapNode.url,
        } as LinkObject;

      case "easter-egg":
        return {
          id: mapNode.id,
          type: "easter-egg",
          label: mapNode.label,
          image: mapNode.image,
          currentImageIndex: mapNode.currentImageIndex,
          isBroken: mapNode.isBroken,
        };

      case "directory": {
        // Directory nodes need to recursively build children
        const children: NodeObject[] = mapNode.children.map((childId) =>
          buildObject(childId)
        );

        return {
          id: mapNode.id,
          type: "directory",
          label: mapNode.label,
          image: mapNode.image,
          componentKey: mapNode.componentKey,
          children,
        };
      }

      default:
        throw new Error(
          `Unknown node type: ${(mapNode as { type: string }).type}`
        );
    }
  };

  const rootObject = buildObject(rootId);

  // Ensure root is a directory (should always be true)
  if (rootObject.type !== "directory") {
    throw new Error("Root node must be a directory");
  }

  return rootObject;
};
