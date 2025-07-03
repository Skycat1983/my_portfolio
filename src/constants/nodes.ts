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
  EGG_BROKEN,
  TROPHY1,
  GTA6_LOGO,
  PLANET,
  FINDER,
  TERMINAL,
  SAFARI,
  MAPS,
  FOLDER_MAC,
  FOLDER_WINDOWS,
  WHATSAPP,
  EDGE,
  BIN_FULL,
  BIN_EMPTY,
  PAGES,
  WORD,
  LINKEDIN,
  CALCULATOR,
  MAIL,
} from "./images";
// import { WINDOW_COMPONENT_REGISTRY } from "../components/window/WindowComponentRegistry";

const { RESUME, RECOMMENDATIONS, REVIEW } = DOCUMENTS;

/**
 * Design Decision: Dual Data Structure Approach
 *
 * NodeObject types: Human-readable nested structure for easy data definitions
 * NodeMap types: Flat ID-based map for efficient operations (drag/drop, moves, state management)
 
 * Objects are intuitive to write/read, Maps enable advanced desktop functionality
 */

// TODO: add one more type, something that consults function registry. this can be used for easter eggs but also for the 'send me email' thing

// HUMAN-READABLE DATA DEFINITION - UNIFIED ROOT STRUCTURE
export const rootNodes: DirectoryObject = {
  id: "system-root",
  type: "directory",
  image: FOLDER_MAC,
  alternativeImage: null,
  componentKey: "finder",
  label: "System",
  macExtension: null,
  windowsExtension: null,
  children: [
    {
      id: "desktop-root",
      type: "directory",
      image: FOLDER_MAC,
      alternativeImage: null,
      componentKey: "finder",
      label: "Desktop",
      macExtension: null,
      windowsExtension: null,
      children: [
        {
          id: "depth1",
          type: "directory",
          image: FOLDER_MAC,
          alternativeImage: FOLDER_WINDOWS,
          componentKey: "finder",
          label: "Depth 1",
          macExtension: null,
          windowsExtension: null,
          children: [
            {
              id: "depth2",
              type: "directory",
              image: FOLDER_MAC,
              alternativeImage: FOLDER_WINDOWS,
              componentKey: "finder",
              label: "Depth 2",
              macExtension: null,
              windowsExtension: null,
              children: [
                {
                  id: "depth3",
                  type: "directory",
                  image: FOLDER_MAC,
                  alternativeImage: FOLDER_WINDOWS,
                  componentKey: "finder",
                  label: "Depth 3",
                  macExtension: null,
                  windowsExtension: null,
                  children: [
                    {
                      id: "depth4",
                      type: "directory",
                      image: FOLDER_MAC,
                      alternativeImage: FOLDER_WINDOWS,
                      componentKey: "finder",
                      label: "Depth 4",
                      macExtension: null,
                      windowsExtension: null,
                      children: [],
                    },
                    {
                      id: "depth4-1",
                      type: "directory",
                      image: FOLDER_MAC,
                      alternativeImage: FOLDER_WINDOWS,
                      componentKey: "finder",
                      label: "Depth 4",
                      macExtension: null,
                      windowsExtension: null,
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "browser-desktop",
          label: "Internet",
          type: "application",
          image: SAFARI,
          alternativeImage: EDGE,
          componentKey: "browser",
          applicationId: "browser",
          macExtension: ".app",
          windowsExtension: ".exe",
        },
        {
          id: "terminal",
          label: "Terminal",
          type: "application",
          image: TERMINAL,
          alternativeImage: null,
          componentKey: "terminal",
          applicationId: "terminal",
          macExtension: ".app",
          windowsExtension: ".exe",
        },
        {
          id: "trash",
          label: "Trash",
          type: "directory",
          image: BIN_EMPTY,
          alternativeImage: BIN_FULL,
          componentKey: "finder",
          macExtension: null,
          windowsExtension: null,
          children: [
            {
              id: "egg",
              label: "EE",
              image: [EASTER_EGG1, EASTER_EGG2, EASTER_EGG3],
              type: "easter-egg",
              currentImageIndex: 0,
              isBroken: false,
              macExtension: ".egg",
              windowsExtension: ".egg",
            },
          ],
        },
        {
          id: "portfolio",
          label: "Portfolio",
          type: "directory",
          image: FOLDER_MAC,
          alternativeImage: FOLDER_WINDOWS,
          componentKey: "finder",
          macExtension: null,
          windowsExtension: null,
          children: [
            {
              id: "laoutaris",
              label: "Laoutaris",
              type: "directory",
              image: FOLDER_MAC,
              alternativeImage: FOLDER_WINDOWS,
              componentKey: "finder",
              macExtension: null,
              windowsExtension: null,
              children: [
                {
                  id: "laoutaris_code",
                  label: "Code",
                  image: GITHUB,
                  alternativeImage: null,
                  type: "link",
                  url: "https://github.com/Skycat1983/laoutaris-nextjs",
                  macExtension: ".webloc",
                  windowsExtension: ".url",
                },
                {
                  id: "laoutaris_website",
                  label: "Website",
                  image: JL1,
                  alternativeImage: null,
                  type: "link",
                  url: "https://laoutaris-nextjs.vercel.app/",
                  macExtension: ".webloc",
                  windowsExtension: ".url",
                },
              ],
            },
            {
              id: "robocrop", // TODO: change to robo-crop
              label: "RoboCrop",
              type: "directory",
              image: FOLDER_MAC,
              alternativeImage: FOLDER_WINDOWS,
              componentKey: "finder",
              macExtension: null,
              windowsExtension: null,
              children: [
                {
                  id: "roboCrop_code",
                  label: "Code",
                  image: GITHUB,
                  alternativeImage: null,
                  type: "link",
                  url: "https://github.com/Skycat1983/RoboCrop",
                  macExtension: ".webloc",
                  windowsExtension: ".url",
                },
                {
                  id: "roboCrop_download",
                  label: "Download",
                  image: ROBOCROP,
                  alternativeImage: null,
                  type: "link",
                  url: "https://addons.mozilla.org/en-GB/firefox/addon/robocrop/",
                  macExtension: ".webloc",
                  windowsExtension: ".url",
                },
              ],
            },
            {
              id: "skynot",
              label: "SkyNot",
              type: "directory",
              image: FOLDER_MAC,
              alternativeImage: FOLDER_WINDOWS,
              componentKey: "finder",
              macExtension: null,
              windowsExtension: null,
              children: [
                {
                  id: "SkyNot_code",
                  label: "Code",
                  image: GITHUB,
                  alternativeImage: null,
                  type: "link",
                  url: "https://github.com/Skycat1983/SkyNot",
                  macExtension: ".webloc",
                  windowsExtension: ".url",
                },
                {
                  id: "SkyNot_download",
                  label: "Download",
                  image: SKYNOT,
                  alternativeImage: null,
                  type: "link",
                  url: "https://addons.mozilla.org/en-GB/firefox/addon/skynot/",
                  macExtension: ".webloc",
                  windowsExtension: ".url",
                },
              ],
            },
            {
              id: "dashboard",
              label: "Dashboard",
              type: "directory",
              image: FOLDER_MAC,
              alternativeImage: FOLDER_WINDOWS,
              componentKey: "finder",
              macExtension: null,
              windowsExtension: null,
              children: [
                {
                  id: "Dashboard_code",
                  label: "Code",
                  image: GITHUB,
                  alternativeImage: null,
                  type: "link",
                  url: "https://github.com/Skycat1983/Dashboard",
                  macExtension: ".webloc",
                  windowsExtension: ".url",
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
          alternativeImage: FOLDER_WINDOWS,
          componentKey: "finder",
          macExtension: null,
          windowsExtension: null,
          children: [
            {
              id: "resume",
              label: "Resume",
              image: PDF,
              alternativeImage: null,
              type: "link",
              url: RESUME,
              macExtension: ".pdf",
              windowsExtension: ".pdf",
            },
            {
              id: "recommendation",
              label: "Recommendation",
              image: PDF,
              alternativeImage: null,
              type: "link",
              url: RECOMMENDATIONS,
              macExtension: ".pdf",
              windowsExtension: ".pdf",
            },
            {
              id: "review",
              label: "Review",
              image: IMAGE1,
              alternativeImage: null,
              type: "link",
              url: REVIEW,
              macExtension: ".png",
              windowsExtension: ".png",
            },
          ],
        },
        {
          id: "games",
          label: "Games",
          type: "directory",
          image: FOLDER_MAC,
          alternativeImage: FOLDER_WINDOWS,
          componentKey: "finder",
          macExtension: null,
          windowsExtension: null,
          children: [
            {
              id: "gtaiv",
              label: "GTAVI",
              type: "application",
              image: GTA6_LOGO,
              alternativeImage: null,
              componentKey: "gtaVi",
              applicationId: "gtaVi",
              macExtension: ".app",
              windowsExtension: ".exe",
            },
            {
              id: "geo",
              label: "Flag Quest",
              type: "application",
              image: PLANET,
              alternativeImage: null,
              componentKey: "geoGame",
              applicationId: "geoGame",
              macExtension: ".app",
              windowsExtension: ".exe",
            },
          ],
        },
        {
          id: "achievements",
          label: "Achievements",
          type: "application",
          image: TROPHY1,
          alternativeImage: null,
          componentKey: "achievements",
          applicationId: "achievements",
          macExtension: ".app",
          windowsExtension: ".exe",
        },
        {
          id: "pages",
          label: "Pages",
          type: "application",
          image: PAGES,
          alternativeImage: WORD,
          componentKey: "documentEditor",
          applicationId: "documentEditor",
          macExtension: ".app",
          windowsExtension: ".exe",
        },
        // {
        //   id: "whatsapp",
        //   label: "WhatsApp",
        //   type: "application",
        //   image: WHATSAPP,
        //   alternativeImage: null,
        //   componentKey: "whatsApp",
        // },
      ],
    },
    {
      id: "dock-root",
      label: "Dock",
      type: "directory",
      image: FOLDER_MAC,
      alternativeImage: FOLDER_WINDOWS,
      componentKey: "dock",
      macExtension: null,
      windowsExtension: null,
      children: [
        {
          id: "finder",
          label: "Finder",
          type: "directory",
          image: FINDER,
          alternativeImage: null,
          componentKey: "finder",
          macExtension: null,
          windowsExtension: null,
          children: [],
        },
        {
          id: "mail",
          label: "Mail",
          type: "function",
          image: MAIL,
          alternativeImage: null,
          functionKey: "emailMe",
          macExtension: ".txt",
          windowsExtension: ".txt",
        },
        {
          id: "maps",
          label: "Maps",
          type: "application",
          image: MAPS,
          alternativeImage: null,
          componentKey: "maps",
          applicationId: "maps",
          macExtension: ".app",
          windowsExtension: ".exe",
        },
        {
          id: "calculator",
          label: "Calculator",
          type: "application",
          image: CALCULATOR,
          alternativeImage: null,
          componentKey: "calculator",
          applicationId: "calculator",
          macExtension: ".app",
          windowsExtension: ".exe",
        },
        {
          id: "pages-dock",
          label: "Pages",
          type: "application",
          image: PAGES,
          alternativeImage: WORD,
          componentKey: "documentEditor",
          applicationId: "documentEditor",
          macExtension: ".app",
          windowsExtension: ".exe",
        },
        {
          id: "github-dock",
          label: "GitHub",
          type: "link",
          image: GITHUB,
          alternativeImage: null,
          url: "https://github.com/Skycat1983",
          macExtension: ".webloc",
          windowsExtension: ".url",
        },
        {
          id: "linkedin-dock",
          label: "LinkedIn",
          type: "link",
          image: LINKEDIN,
          alternativeImage: null,
          url: "https://www.linkedin.com/in/skycat1983/",
          macExtension: ".webloc",
          windowsExtension: ".url",
        },
        {
          id: "whatsapp-dock",
          label: "WhatsApp",
          type: "application",
          image: WHATSAPP,
          alternativeImage: null,
          componentKey: "whatsApp",
          applicationId: "whatsApp",
          macExtension: ".app",
          windowsExtension: ".exe",
        },
        {
          id: "achievements-dock",
          label: "Achievements",
          type: "application",
          image: TROPHY1,
          alternativeImage: null,
          componentKey: "achievements",
          applicationId: "achievements",
          macExtension: ".app",
          windowsExtension: ".exe",
        },
        {
          id: "terminal-dock",
          label: "Terminal",
          type: "application",
          image: TERMINAL,
          alternativeImage: null,
          componentKey: "terminal",
          applicationId: "terminal",
          macExtension: ".app",
          windowsExtension: ".exe",
        },
        {
          id: "browser-dock",
          label: "Internet",
          type: "application",
          image: SAFARI,
          alternativeImage: null,
          componentKey: "browser",
          applicationId: "browser",
          macExtension: ".app",
          windowsExtension: ".exe",
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
// type NodeType =
//   | "easter-egg"
//   | "application"
//   | "directory"
//   | "link"
//   | "function";

// export interface BaseNodeObject {
//   id: string;
//   type: NodeType;
//   label: string;
//   image: string;
//   componentKey: keyof typeof WINDOW_COMPONENT_REGISTRY;
// }

// export interface BaseNodeEntry {
//   id: string;
//   parentId: string | null;
//   type: NodeType;
//   label: string;
//   image: string;
//   componentKey: keyof typeof WINDOW_COMPONENT_REGISTRY;
// }
