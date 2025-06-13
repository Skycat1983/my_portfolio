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

    if (mapNode.type === "icon") {
      // App nodes have no children
      return {
        id: mapNode.id,
        type: "icon",
        label: mapNode.label,
        image: mapNode.image,
        info: mapNode.info,
      };
    } else if (mapNode.type === "link") {
      return {
        id: mapNode.id,
        type: "link",
        label: mapNode.label,
        image: mapNode.image,
        url: mapNode.url,
      } as LinkObject;
    } else if (mapNode.type === "easter-egg") {
      return {
        id: mapNode.id,
        type: "easter-egg",
        label: mapNode.label,
        image: mapNode.image,
        currentImageIndex: mapNode.currentImageIndex,
        isBroken: mapNode.isBroken,
      };
    } else if (mapNode.type === "terminal") {
      return {
        id: mapNode.id,
        type: "terminal",
        label: mapNode.label,
      };
    } else if (mapNode.type === "browser") {
      return {
        id: mapNode.id,
        type: "browser",
        label: mapNode.label,
      };
    } else {
      // Directory nodes need to recursively build children
      const children: NodeObject[] = mapNode.children.map((childId) =>
        buildObject(childId)
      );

      return {
        id: mapNode.id,
        type: "directory",
        label: mapNode.label,
        children,
      };
    }
  };

  const rootObject = buildObject(rootId);

  // Ensure root is a directory (should always be true)
  if (rootObject.type !== "directory") {
    throw new Error("Root node must be a directory");
  }

  return rootObject;
};
