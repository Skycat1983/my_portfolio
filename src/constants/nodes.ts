import { convertObjectsToMap } from "../lib/objToMap";
import type { DirectoryObject } from "../types/nodeTypes";
import { DOCUMENTS } from "./documents";
import { images } from "./images";

const {
  FIREFOX,
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
  EGG_BROKEN,
  GITHUB,
  PDF,
  JL,
  IMAGE,
} = images;

const { RESUME, RECOMMENDATIONS, REVIEW } = DOCUMENTS;

/**
 * Design Decision: Dual Data Structure Approach
 *
 * NodeObject types: Human-readable nested structure for easy data definitions
 * NodeMap types: Flat ID-based map for efficient operations (drag/drop, moves, state management)
 
 * Objects are intuitive to write/read, Maps enable advanced desktop functionality
 */

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
          id: "egg",
          label: "EE",
          image: [EASTER_EGG1, EASTER_EGG2, EASTER_EGG3],
          type: "easter-egg",
          currentImageIndex: 0,
          isBroken: false,
        },
      ],
    },
    {
      id: "portfolio",
      label: "Portfolio",
      image: FOLDER,
      type: "directory",
      children: [
        {
          id: "laoutaris",
          label: "Laoutaris",
          image: FOLDER,
          type: "directory",
          children: [
            {
              id: "laoutaris_code",
              label: "Code",
              image: GITHUB,
              type: "link",
              url: "https://github.com/Skycat1983/laoutaris-nextjs",
            },
            {
              id: "laoutaris_website",
              label: "Website",
              image: JL,
              type: "link",
              url: "https://laoutaris-nextjs.vercel.app/",
            },
          ],
        },
        {
          id: "roboCrop",
          label: "RoboCrop",
          image: FOLDER,
          type: "directory",
          children: [
            {
              id: "roboCrop_code",
              label: "Code",
              image: GITHUB,
              type: "link",
              url: "https://github.com/Skycat1983/RoboCrop",
            },
            {
              id: "roboCrop_download",
              label: "Download",
              image: FIREFOX,
              type: "link",
              url: "https://addons.mozilla.org/en-GB/firefox/addon/robocrop/",
            },
          ],
        },
        {
          id: "SkyNot",
          label: "SkyNot",
          image: FOLDER,
          type: "directory",
          children: [
            {
              id: "SkyNot_code",
              label: "Code",
              image: GITHUB,
              type: "link",
              url: "https://github.com/Skycat1983/SkyNot",
            },
            {
              id: "SkyNot_download",
              label: "Download",
              image: FIREFOX,
              type: "link",
              url: "https://addons.mozilla.org/en-GB/firefox/addon/skynot/",
            },
          ],
        },
        {
          id: "Dashboard",
          label: "Dashboard",
          image: FOLDER,
          type: "directory",
          children: [
            {
              id: "Dashboard_code",
              label: "Code",
              image: GITHUB,
              type: "link",
              url: "https://github.com/Skycat1983/Dashboard",
            },
          ],
        },
      ],
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
          image: PDF,
          type: "link",
          url: RESUME,
        },
        {
          id: "recommendation",
          label: "Recommendation",
          image: PDF,
          type: "link",
          url: RECOMMENDATIONS,
        },
        {
          id: "review",
          label: "Review",
          image: IMAGE,
          type: "link",
          url: REVIEW,
        },
      ],
    },
  ],
};

// Export the broken egg image for use in other components
export { EGG_BROKEN };

// OPERATIONAL MAP READY FOR USE
export const { nodeMap: defaultNodeMap, rootId: defaultRootId } =
  convertObjectsToMap(defaultNodes);
