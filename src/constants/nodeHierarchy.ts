import { convertObjectsToMap } from "../lib/objToMap";
import type { DirectoryObject } from "../components/nodes/nodeTypes";
import { DOCUMENTS } from "./documentRegistry";
import { createNodeFromTemplate } from "./nodeRegistry";
import {
  ROBOCROP,
  SKYNOT,
  GITHUB,
  JL1,
  IMAGE1,
  PDF,
  EGG_BROKEN,
  FOLDER_MAC,
  FOLDER_WINDOWS,
  BIN_FULL,
  BIN_EMPTY,
  LINKEDIN,
  MAIL,
} from "./images";

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
  applicationRegistryId: "finder",
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
      applicationRegistryId: "finder",
      size: null,
      children: [
        createNodeFromTemplate("whatsAppApp", {
          id: "whatsapp-desktop",
          location: "desktop",
        }),
        createNodeFromTemplate("calculatorApp", {
          id: "calculator-desktop",
          location: "desktop",
        }),
        createNodeFromTemplate("browserApp", {
          id: "browser-desktop",
          location: "desktop",
        }),
        createNodeFromTemplate("terminalApp", {
          id: "terminal",
        }),
        {
          id: "trash",
          label: "Trash",
          type: "directory",
          image: BIN_EMPTY,
          alternativeImage: BIN_FULL,
          componentKey: "finder",
          applicationRegistryId: "finder",
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
          applicationRegistryId: "finder",
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
              applicationRegistryId: "finder",
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
              applicationRegistryId: "finder",
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
              applicationRegistryId: "finder",
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
              applicationRegistryId: "finder",
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
          applicationRegistryId: "finder",
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
          applicationRegistryId: "finder",
          macExtension: null,
          windowsExtension: null,
          dateModified: "2024-03-20T13:15:00Z",
          size: null,
          children: [
            createNodeFromTemplate("gtaViApp", {
              id: "gtaiv",
            }),
            createNodeFromTemplate("geoGameApp", {
              id: "geo",
            }),
          ],
        },
        createNodeFromTemplate("achievementsApp", {
          id: "achievements",
        }),
        createNodeFromTemplate("portfolioDocument", {
          id: "sample-document",
        }),
        // {
        //   id: "downloads",
        //   label: "Downloads",
        //   type: "directory",
        //   image: FOLDER_MAC,
        //   alternativeImage: FOLDER_WINDOWS,
        //   componentKey: "finder",
        //   macExtension: null,
        //   windowsExtension: null,
        //   dateModified: "2024-03-20T10:00:00Z",
        //   size: null,
        //   children: [],
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
      applicationRegistryId: "finder",
      macExtension: null,
      windowsExtension: null,
      dateModified: "2024-03-20T10:00:00Z",
      size: null,
      children: [
        createNodeFromTemplate("finderApp", {
          id: "finder",
        }),
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
        createNodeFromTemplate("mapsApp", {
          id: "maps",
        }),
        createNodeFromTemplate("calculatorApp", {
          id: "calculator-dock",
          location: "dock",
        }),
        createNodeFromTemplate("settingsApp", {
          id: "settings-dock",
          location: "dock",
        }),
        createNodeFromTemplate("pagesApp", {
          id: "pages-dock",
          location: "dock",
        }),
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
        createNodeFromTemplate("whatsAppApp", {
          id: "whatsapp-dock",
          location: "dock",
        }),
        createNodeFromTemplate("achievementsApp", {
          id: "achievements-dock",
          location: "dock",
        }),
        createNodeFromTemplate("terminalApp", {
          id: "terminal-dock",
          location: "dock",
        }),
        createNodeFromTemplate("browserApp", {
          id: "browser-dock",
          location: "dock",
        }),
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

export type DesktopRootId = "desktop-root";
export type DockRootId = "dock-root";
// Legacy support - desktop root ID for components that expect it
export const desktopRootId: DesktopRootId = "desktop-root";
export const dockRootId: DockRootId = "dock-root";
export type RootDirectoryId = DesktopRootId | DockRootId;
