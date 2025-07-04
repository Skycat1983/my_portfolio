import { convertObjectsToMap } from "../lib/objToMap";
import type { DirectoryObject } from "../types/nodeTypes";
import { DOCUMENTS } from "./documents";
import {
  ROBOCROP,
  SKYNOT,
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
  SETTINGS,
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
  dateModified: "2024-03-20T10:00:00Z",
  size: null,
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
      dateModified: "2024-03-20T10:00:00Z",
      size: null,
      children: [
        // {
        //   id: "depth1",
        //   type: "directory",
        //   image: FOLDER_MAC,
        //   alternativeImage: FOLDER_WINDOWS,
        //   componentKey: "finder",
        //   label: "Depth 1",
        //   macExtension: null,
        //   windowsExtension: null,
        //   dateModified: "2024-03-20T10:00:00Z",
        //   size: null,
        //   children: [
        //     {
        //       id: "depth2",
        //       type: "directory",
        //       image: FOLDER_MAC,
        //       alternativeImage: FOLDER_WINDOWS,
        //       componentKey: "finder",
        //       label: "Depth 2",
        //       macExtension: null,
        //       windowsExtension: null,
        //       dateModified: "2024-03-20T10:00:00Z",
        //       size: null,
        //       children: [
        //         {
        //           id: "depth3",
        //           type: "directory",
        //           image: FOLDER_MAC,
        //           alternativeImage: FOLDER_WINDOWS,
        //           componentKey: "finder",
        //           label: "Depth 3",
        //           macExtension: null,
        //           windowsExtension: null,
        //           dateModified: "2024-03-20T10:00:00Z",
        //           size: null,
        //           children: [
        //             {
        //               id: "depth4",
        //               type: "directory",
        //               image: FOLDER_MAC,
        //               alternativeImage: FOLDER_WINDOWS,
        //               componentKey: "finder",
        //               label: "Depth 4",
        //               macExtension: null,
        //               windowsExtension: null,
        //               dateModified: "2024-03-20T10:00:00Z",
        //               size: null,
        //               children: [],
        //             },
        //             {
        //               id: "depth4-1",
        //               type: "directory",
        //               image: FOLDER_MAC,
        //               alternativeImage: FOLDER_WINDOWS,
        //               componentKey: "finder",
        //               label: "Depth 4",
        //               macExtension: null,
        //               windowsExtension: null,
        //               dateModified: "2024-03-20T10:00:00Z",
        //               size: null,
        //               children: [],
        //             },
        //           ],
        //         },
        //       ],
        //     },
        //   ],
        // },
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
          dateModified: "2024-03-19T15:30:00Z",
          size: 245000000, // 245MB for browser
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
          dateModified: "2024-03-18T14:20:00Z",
          size: 85000000, // 85MB for terminal
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
          dateModified: "2024-03-20T09:15:00Z",
          size: null,
          children: [],
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
          dateModified: "2024-03-20T11:30:00Z",
          size: null,
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
              dateModified: "2024-03-20T11:30:00Z",
              size: null,
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
                  dateModified: "2024-03-17T16:45:00Z",
                  size: 1024, // 1KB for link file
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
                  dateModified: "2024-03-16T15:30:00Z",
                  size: 1024, // 1KB for link file
                },
              ],
            },
            {
              id: "robocrop",
              label: "RoboCrop",
              type: "directory",
              image: FOLDER_MAC,
              alternativeImage: FOLDER_WINDOWS,
              componentKey: "finder",
              macExtension: null,
              windowsExtension: null,
              dateModified: "2024-03-20T11:30:00Z",
              size: null,
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
                  dateModified: "2024-03-15T11:20:00Z",
                  size: 1024, // 1KB for link file
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
                  dateModified: "2024-03-14T09:45:00Z",
                  size: 1024, // 1KB for link file
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
              dateModified: "2024-03-20T11:30:00Z",
              size: null,
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
                  dateModified: "2024-03-13T14:15:00Z",
                  size: 1024, // 1KB for link file
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
                  dateModified: "2024-03-12T16:30:00Z",
                  size: 1024, // 1KB for link file
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
              dateModified: "2024-03-20T11:30:00Z",
              size: null,
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
                  dateModified: "2024-03-11T10:45:00Z",
                  size: 1024, // 1KB for link file
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
          dateModified: "2024-03-20T12:00:00Z",
          size: null,
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
              dateModified: "2024-03-19T09:30:00Z",
              size: 2500000, // 2.5MB for PDF
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
              dateModified: "2024-03-18T10:45:00Z",
              size: 1800000, // 1.8MB for PDF
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
              dateModified: "2024-03-10T15:20:00Z",
              size: 3500000, // 3.5MB for PNG image
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
          dateModified: "2024-03-20T13:15:00Z",
          size: null,
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
              dateModified: "2024-03-15T11:20:00Z",
              size: 185000000, // 185MB for game
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
              dateModified: "2024-03-14T14:30:00Z",
              size: 125000000, // 125MB for game
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
          dateModified: "2024-03-12T10:30:00Z",
          size: 95000000, // 95MB for achievements app
        },
        {
          id: "sample-document",
          label: "Portfolio Document",
          type: "document",
          image: PAGES,
          alternativeImage: WORD,
          applicationId: "documentEditor",
          documentConfigId: "sample_document_config",
          macExtension: ".txt",
          windowsExtension: ".txt",
          dateModified: "2024-03-20T09:00:00Z",
          size: 25000, // 25KB for text document
        },
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
      dateModified: "2024-03-20T10:00:00Z",
      size: null,
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
          dateModified: "2024-03-20T10:00:00Z",
          size: null,
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
          dateModified: "2024-03-19T16:30:00Z",
          size: 512, // 512 bytes for function
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
          dateModified: "2024-03-18T13:45:00Z",
          size: 155000000, // 155MB for maps
        },
        {
          id: "calculator-dock",
          label: "Calculator",
          type: "application",
          image: CALCULATOR,
          alternativeImage: null,
          componentKey: "calculator",
          applicationId: "calculator",
          macExtension: ".app",
          windowsExtension: ".exe",
          dateModified: "2024-03-17T08:45:00Z",
          size: 65000000, // 65MB for calculator
        },
        {
          id: "settings-dock",
          label: "Settings",
          type: "application",
          image: SETTINGS,
          alternativeImage: null,
          componentKey: "settings",
          applicationId: "settings",
          macExtension: ".app",
          windowsExtension: ".exe",
          dateModified: "2024-03-12T10:30:00Z",
          size: 95000000, // 95MB for settings app
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
          dateModified: "2024-03-16T11:20:00Z",
          size: 175000000, // 175MB for document editor
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
          dateModified: "2024-03-15T14:30:00Z",
          size: 1024, // 1KB for link file
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
          dateModified: "2024-03-14T09:15:00Z",
          size: 1024, // 1KB for link file
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
          dateModified: "2024-03-13T15:45:00Z",
          size: 145000000, // 145MB for WhatsApp
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
          dateModified: "2024-03-12T10:30:00Z",
          size: 95000000, // 95MB for achievements app
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
          dateModified: "2024-03-18T14:20:00Z",
          size: 85000000, // 85MB for terminal
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
          dateModified: "2024-03-19T15:30:00Z",
          size: 245000000, // 245MB for browser
        },
      ],
    },
  ],
};

// Keep legacy export for backwards compatibility during transition
export const defaultNodes: DirectoryObject = rootNodes
  .children[0] as DirectoryObject;

// Export the broken egg image for use in other components
export { EGG_BROKEN };

// OPERATIONAL MAP READY FOR USE - Now includes both desktop and dock nodes
export const { nodeMap: defaultNodeMap, rootId: defaultRootId } =
  convertObjectsToMap(rootNodes);

// Legacy support - desktop root ID for components that expect it
export const desktopRootId = "desktop-root";
export const dockRootId = "dock-root";

// // this is the only way i could think to do this
// export const dockNodes = [
//   {
//     id: "dock-root",
//     label: "Dock",
//     type: "directory",
//     image: FOLDER_MAC,
//     alternativeImage: FOLDER_WINDOWS,
//     componentKey: "dock",
//     macExtension: null,
//     windowsExtension: null,
//     dateModified: "2024-03-20T10:00:00Z",
//     size: null,
//     children: [
//       {
//         id: "finder",
//         label: "Finder",
//         type: "directory",
//         image: FINDER,
//         alternativeImage: null,
//         componentKey: "finder",
//         macExtension: null,
//         windowsExtension: null,
//         dateModified: "2024-03-20T10:00:00Z",
//         size: null,
//         children: [],
//       },
//       {
//         id: "mail",
//         label: "Mail",
//         type: "function",
//         image: MAIL,
//         alternativeImage: null,
//         functionKey: "emailMe",
//         macExtension: ".txt",
//         windowsExtension: ".txt",
//         dateModified: "2024-03-19T16:30:00Z",
//         size: 512, // 512 bytes for function
//       },
//       {
//         id: "maps",
//         label: "Maps",
//         type: "application",
//         image: MAPS,
//         alternativeImage: null,
//         componentKey: "maps",
//         applicationId: "maps",
//         macExtension: ".app",
//         windowsExtension: ".exe",
//         dateModified: "2024-03-18T13:45:00Z",
//         size: 155000000, // 155MB for maps
//       },
//       {
//         id: "calculator-dock",
//         label: "Calculator",
//         type: "application",
//         image: CALCULATOR,
//         alternativeImage: null,
//         componentKey: "calculator",
//         applicationId: "calculator",
//         macExtension: ".app",
//         windowsExtension: ".exe",
//         dateModified: "2024-03-17T08:45:00Z",
//         size: 65000000, // 65MB for calculator
//       },
//       {
//         id: "pages-dock",
//         label: "Pages",
//         type: "application",
//         image: PAGES,
//         alternativeImage: WORD,
//         componentKey: "documentEditor",
//         applicationId: "documentEditor",
//         macExtension: ".app",
//         windowsExtension: ".exe",
//         dateModified: "2024-03-16T11:20:00Z",
//         size: 175000000, // 175MB for document editor
//       },
//       {
//         id: "settings-dock",
//         label: "Settings",
//         type: "application",
//         image: SETTINGS,
//         alternativeImage: null,
//         componentKey: "settings",
//         applicationId: "settings",
//         macExtension: ".app",
//         windowsExtension: ".exe",
//         dateModified: "2024-03-12T10:30:00Z",
//         size: 95000000, // 95MB for settings app
//       },
//       {
//         id: "github-dock",
//         label: "GitHub",
//         type: "link",
//         image: GITHUB,
//         alternativeImage: null,
//         url: "https://github.com/Skycat1983",
//         macExtension: ".webloc",
//         windowsExtension: ".url",
//         dateModified: "2024-03-15T14:30:00Z",
//         size: 1024, // 1KB for link file
//       },
//       {
//         id: "linkedin-dock",
//         label: "LinkedIn",
//         type: "link",
//         image: LINKEDIN,
//         alternativeImage: null,
//         url: "https://www.linkedin.com/in/skycat1983/",
//         macExtension: ".webloc",
//         windowsExtension: ".url",
//         dateModified: "2024-03-14T09:15:00Z",
//         size: 1024, // 1KB for link file
//       },
//       {
//         id: "whatsapp-dock",
//         label: "WhatsApp",
//         type: "application",
//         image: WHATSAPP,
//         alternativeImage: null,
//         componentKey: "whatsApp",
//         applicationId: "whatsApp",
//         macExtension: ".app",
//         windowsExtension: ".exe",
//         dateModified: "2024-03-13T15:45:00Z",
//         size: 145000000, // 145MB for WhatsApp
//       },
//       {
//         id: "achievements-dock",
//         label: "Achievements",
//         type: "application",
//         image: TROPHY1,
//         alternativeImage: null,
//         componentKey: "achievements",
//         applicationId: "achievements",
//         macExtension: ".app",
//         windowsExtension: ".exe",
//         dateModified: "2024-03-12T10:30:00Z",
//         size: 95000000, // 95MB for achievements app
//       },
//       // {
//       //   id: "terminal-dock",
//       //   label: "Terminal",
//       //   type: "application",
//       //   image: TERMINAL,
//       //   alternativeImage: null,
//       //   componentKey: "terminal",
//       //   applicationId: "terminal",
//       //   macExtension: ".app",
//       //   windowsExtension: ".exe",
//       //   dateModified: "2024-03-18T14:20:00Z",
//       //   size: 85000000, // 85MB for terminal
//       // },
//       // {
//       //   id: "browser-dock",
//       //   label: "Internet",
//       //   type: "application",
//       //   image: SAFARI,
//       //   alternativeImage: null,
//       //   componentKey: "browser",
//       //   applicationId: "browser",
//       //   macExtension: ".app",
//       //   windowsExtension: ".exe",
//       //   dateModified: "2024-03-19T15:30:00Z",
//       //   size: 245000000, // 245MB for browser
//       // },
//     ],
//   },
// ];

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
