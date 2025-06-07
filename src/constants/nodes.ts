import { images } from "./images";

const {
  FOLDER,
  BIN_EMPTY,
  TERMINAL,
  REACT,
  TYPESCRIPT,
  NODEJS,
  MONGODB,
  JEST,
  POSTMAN,
  TAILWIND,
  FIREBASE,
  JAVASCRIPT,
  EASTER_EGG1,
  EASTER_EGG2,
  EASTER_EGG3,
  EASTER_EGG4,
} = images;

/**
 * Design Decision: Dual Data Structure Approach
 *
 * NodeObject types: Human-readable nested structure for easy data definition
 * NodeMap types: Flat ID-based map for efficient operations (drag/drop, moves, state management)
 *
 * Objects are intuitive to write/read, Maps enable advanced desktop functionality
 */

// HUMAN-READABLE OBJECT TYPES
export interface DirectoryObject {
  id: string;
  type: "directory";
  label: string;
  image: string;
  children: NodeObject[];
}

export interface AppObject {
  id: string;
  type: "app";
  label: string;
  image: string;
  action?: () => void;
}

export type NodeObject = DirectoryObject | AppObject;

// OPERATIONAL MAP TYPES
export interface MapNode {
  id: string;
  parentId: string | null; // null only for desktop root
  children: string[]; // array of child IDs, empty for apps
  type: "directory" | "app";
  label: string;
  image: string;
  action?: () => void;
}

export interface NodeMap {
  [id: string]: MapNode;
}

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

// HUMAN-READABLE DATA DEFINITION
export const defaultNodes: DirectoryObject = {
  id: "desktop-root",
  type: "directory",
  label: "Desktop",
  image: FOLDER,
  children: [
    {
      id: "terminal",
      label: "Terminal",
      image: TERMINAL,
      type: "app",
    },
    {
      id: "trash",
      label: "Trash",
      image: BIN_EMPTY,
      type: "directory",
      children: [
        {
          id: "egg1",
          label: "Egg 1",
          image: EASTER_EGG1,
          type: "app",
          action: () => {
            console.log("Egg 1");
          },
        },
      ],
    },
    {
      id: "projects",
      label: "Projects",
      image: FOLDER,
      type: "directory",
      children: [],
    },
    {
      id: "stack",
      label: "Stack",
      image: FOLDER,
      type: "directory",
      children: [
        {
          id: "react",
          label: "React",
          image: REACT,
          type: "app",
        },
        {
          id: "typescript",
          label: "TypeScript",
          image: TYPESCRIPT,
          type: "app",
        },
        {
          id: "nodejs",
          label: "Node.js",
          image: NODEJS,
          type: "app",
        },
        {
          id: "mongodb",
          label: "MongoDB",
          image: MONGODB,
          type: "app",
        },
        {
          id: "jest",
          label: "Jest",
          image: JEST,
          type: "app",
        },
        {
          id: "postman",
          label: "Postman",
          image: POSTMAN,
          type: "app",
        },
        {
          id: "tailwind",
          label: "Tailwind",
          image: TAILWIND,
          type: "app",
        },
        {
          id: "firebase",
          label: "Firebase",
          image: FIREBASE,
          type: "app",
        },
        {
          id: "javascript",
          label: "JavaScript",
          image: JAVASCRIPT,
          type: "app",
        },
      ],
    },
    {
      id: "documents",
      label: "Documents",
      image: FOLDER,
      type: "directory",
      children: [
        {
          id: "resume",
          label: "Resume",
          image: FOLDER,
          type: "app",
        },
        {
          id: "references",
          label: "References",
          image: FOLDER,
          type: "app",
        },
      ],
    },
  ],
};

// OPERATIONAL MAP READY FOR USE
export const { nodeMap: defaultNodeMap, rootId: defaultRootId } =
  convertObjectsToMap(defaultNodes);
