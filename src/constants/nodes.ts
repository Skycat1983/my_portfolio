import { convertObjectsToMap } from "../lib/objToMap";
import type { DirectoryObject } from "../types/nodeTypes";
import { DOCUMENTS } from "./documents";
import {
  ROBOCROP,
  SKYNOT,
  EASTER_EGG1,
  EASTER_EGG2,
  EASTER_EGG3,
  GITHUB,
  JL1,
  IMAGE1,
  PDF,
  // REACT,
  // TYPESCRIPT,
  // NODEJS,
  // MONGODB,
  // JEST,
  // POSTMAN,
  // TAILWIND,
  // FIREBASE,
  // JAVASCRIPT,
  EGG_BROKEN,
  TROPHY1,
  GTA6_LOGO,
  PLANET,
  DOCUMENT,
  FINDER,
  TERMINAL,
  SAFARI,
  MAPS,
  FOLDER_MAC,
  WHATSAPP,
} from "./images";
import { WINDOW_COMPONENT_REGISTRY } from "../components/window/WindowComponentRegistry";

const { RESUME, RECOMMENDATIONS, REVIEW } = DOCUMENTS;

/**
 * Design Decision: Dual Data Structure Approach
 *
 * NodeObject types: Human-readable nested structure for easy data definitions
 * NodeMap types: Flat ID-based map for efficient operations (drag/drop, moves, state management)
 
 * Objects are intuitive to write/read, Maps enable advanced desktop functionality
 */

type NodeType = "easter-egg" | "application" | "directory" | "link";

export interface BaseNodeObject {
  id: string;
  type: NodeType;
  label: string;
  image: string;
  componentKey: keyof typeof WINDOW_COMPONENT_REGISTRY;
}

export interface BaseNodeEntry {
  id: string;
  parentId: string | null;
  type: NodeType;
  label: string;
  image: string;
  componentKey: keyof typeof WINDOW_COMPONENT_REGISTRY;
}

// HUMAN-READABLE DATA DEFINITION - UNIFIED ROOT STRUCTURE
export const rootNodes: DirectoryObject = {
  id: "system-root",
  type: "directory",
  image: FOLDER_MAC,
  componentKey: "finder",
  label: "System",
  children: [
    {
      id: "desktop-root",
      type: "directory",
      image: FOLDER_MAC,
      componentKey: "finder",
      label: "Desktop",
      children: [
        {
          id: "browser",
          label: "Internet",
          type: "application",
          image: SAFARI,
          componentKey: "browser",
        },
        {
          id: "terminal",
          label: "Terminal",
          type: "application",
          image: TERMINAL,
          componentKey: "terminal",
        },
        {
          id: "trash",
          label: "Trash",
          type: "directory",
          image: FOLDER_MAC,
          componentKey: "finder",
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
          type: "directory",
          image: FOLDER_MAC,
          componentKey: "finder",
          children: [
            {
              id: "laoutaris",
              label: "Laoutaris",
              type: "directory",
              image: FOLDER_MAC,
              componentKey: "finder",
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
                  image: JL1,
                  type: "link",
                  url: "https://laoutaris-nextjs.vercel.app/",
                },
              ],
            },
            {
              id: "robocrop", // TODO: change to robo-crop
              label: "RoboCrop",
              type: "directory",
              image: FOLDER_MAC,
              componentKey: "finder",
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
                  image: ROBOCROP,
                  type: "link",
                  url: "https://addons.mozilla.org/en-GB/firefox/addon/robocrop/",
                },
              ],
            },
            {
              id: "skynot",
              label: "SkyNot",
              type: "directory",
              image: FOLDER_MAC,
              componentKey: "finder",
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
                  image: SKYNOT,
                  type: "link",
                  url: "https://addons.mozilla.org/en-GB/firefox/addon/skynot/",
                },
              ],
            },
            {
              id: "dashboard",
              label: "Dashboard",
              type: "directory",
              image: FOLDER_MAC,
              componentKey: "finder",
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
          id: "documents",
          label: "Documents",
          type: "directory",
          image: FOLDER_MAC,
          componentKey: "finder",
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
              image: IMAGE1,
              type: "link",
              url: REVIEW,
            },
          ],
        },
        {
          id: "games",
          label: "Games",
          type: "directory",
          image: FOLDER_MAC,
          componentKey: "finder",
          children: [
            {
              id: "gtaiv",
              label: "GTAVI",
              type: "application",
              image: GTA6_LOGO,
              componentKey: "gtaVi",
            },
            {
              id: "geo",
              label: "Flag Quest",
              type: "application",
              image: PLANET,
              componentKey: "geoGame",
            },
          ],
        },
        {
          id: "achievements",
          label: "Achievements",
          type: "application",
          image: TROPHY1,
          componentKey: "achievements",
        },
        {
          id: "pages",
          label: "Pages",
          type: "application",
          image: DOCUMENT,
          componentKey: "documentEditor",
        },
        {
          id: "whatsapp",
          label: "WhatsApp",
          type: "application",
          image: WHATSAPP,
          componentKey: "whatsApp",
        },
      ],
    },
    {
      id: "dock-root",
      label: "Dock",
      type: "directory",
      image: FOLDER_MAC,
      componentKey: "dock",
      children: [
        {
          id: "finder",
          label: "Finder",
          type: "directory",
          image: FINDER,
          componentKey: "finder",
          children: [],
        },
        // {
        //   id: "finder",
        //   label: "Finder",
        //   type: "app",
        //   image: FINDER,
        //   componentKey: "finder",
        // },
        {
          id: "maps",
          label: "Maps",
          type: "application",
          image: MAPS,
          componentKey: "maps",
        },
        {
          id: "pages-dock",
          label: "Pages",
          type: "application",
          image: DOCUMENT,
          componentKey: "documentEditor",
        },
        {
          id: "achievements-dock",
          label: "Achievements",
          type: "application",
          image: TROPHY1,
          componentKey: "achievements",
        },
        {
          id: "terminal-dock",
          label: "Terminal",
          type: "application",
          image: TERMINAL,
          componentKey: "terminal",
        },
        {
          id: "browser-dock",
          label: "Internet",
          type: "application",
          image: SAFARI,
          componentKey: "browser",
        },
      ],
    },
  ],
};

// Keep legacy export for backwards compatibility during transition
export const defaultNodes: DirectoryObject = rootNodes
  .children[0] as DirectoryObject;

// this is the only way i could think to do this
export const dockNodes = [rootNodes.children[1]];

// Export the broken egg image for use in other components
export { EGG_BROKEN };

// OPERATIONAL MAP READY FOR USE - Now includes both desktop and dock nodes
export const { nodeMap: defaultNodeMap, rootId: defaultRootId } =
  convertObjectsToMap(rootNodes);

// Legacy support - desktop root ID for components that expect it
export const desktopRootId = "desktop-root";
export const dockRootId = "dock-root";

// {
//   id: "stack",
//   label: "Stack",
//   type: "directory",
//   children: [
//     {
//       id: "react",
//       label: "React",
//       image: REACT,
//       type: "icon",
//       info: "React is a JavaScript library for building user interfaces.",
//     },
//     {
//       id: "typescript",
//       label: "TypeScript",
//       image: TYPESCRIPT,
//       type: "icon",
//       info: "TypeScript is a superset of JavaScript that adds static typing.",
//     },
//     {
//       id: "nodejs",
//       label: "Node.js",
//       image: NODEJS,
//       type: "icon",
//       info: "Node.js is a runtime environment for executing JavaScript code outside of a browser.",
//     },
//     {
//       id: "mongodb",
//       label: "MongoDB",
//       image: MONGODB,
//       type: "icon",
//       info: "MongoDB is a NoSQL database that uses JSON-like documents with schemas.",
//     },
//     {
//       id: "jest",
//       label: "Jest",
//       image: JEST,
//       type: "icon",
//       info: "Jest is a JavaScript testing framework.",
//     },
//     {
//       id: "postman",
//       label: "Postman",
//       image: POSTMAN,
//       type: "icon",
//       info: "Postman is a tool for testing APIs.",
//     },
//     {
//       id: "tailwind",
//       label: "Tailwind",
//       image: TAILWIND,
//       type: "icon",
//       info: "Tailwind is a CSS framework.",
//     },
//     {
//       id: "firebase",
//       label: "Firebase",
//       image: FIREBASE,
//       type: "icon",
//       info: "Firebase is a backend as a service platform.",
//     },
//     {
//       id: "javascript",
//       label: "JavaScript",
//       image: JAVASCRIPT,
//       type: "icon",
//       info: "JavaScript is a programming language.",
//     },
//   ],
// },
