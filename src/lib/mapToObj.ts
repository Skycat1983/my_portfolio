import type {
  DirectoryObject,
  LinkObject,
  NodeMap,
  NodeObject,
} from "../constants/nodes";

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

    if (mapNode.type === "app") {
      // App nodes have no children
      return {
        id: mapNode.id,
        type: "app",
        label: mapNode.label,
        image: mapNode.image,
      };
    } else if (mapNode.type === "link") {
      return {
        id: mapNode.id,
        type: "link",
        label: mapNode.label,
        image: mapNode.image,
        url: mapNode.url,
      } as LinkObject;
    } else {
      // Directory nodes need to recursively build children
      const children: NodeObject[] = mapNode.children.map((childId) =>
        buildObject(childId)
      );

      return {
        id: mapNode.id,
        type: "directory",
        label: mapNode.label,
        image: mapNode.image,
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
