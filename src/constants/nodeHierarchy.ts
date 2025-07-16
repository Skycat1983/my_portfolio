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
  PAGES,
  WORD,
  PORTFOLIO,
  PHONE,
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
  label: "System",
  macExtension: null,
  windowsExtension: null,
  dateModified: "2024-03-20T10:00:00Z",
  size: null,
  applicationRegistryId: "finder",
  protected: true,
  children: [
    {
      id: "documents",
      label: "Documents",
      type: "directory",
      image: FOLDER_MAC,
      alternativeImage: FOLDER_WINDOWS,
      applicationRegistryId: "finder",
      macExtension: null,
      windowsExtension: null,
      dateModified: "2024-03-20T10:00:00Z",
      size: null,
      protected: true,
      children: [
        createNodeFromTemplate("document", {
          id: "personal-intro",
          documentConfigId: "personal_document_config",
          label: "Personal Introduction",
          protected: false,
        }),
        createNodeFromTemplate("document", {
          id: "my-stack",
          documentConfigId: "my_stack_document_config",
          label: "My Stack",
          protected: false,
        }),
        createNodeFromTemplate("document", {
          id: "private",
          documentConfigId: "private_document_config",
          label: "Private",
          protected: false,
        }),
      ],
    },
    {
      id: "downloads",
      label: "Downloads",
      type: "directory",
      image: FOLDER_MAC,
      alternativeImage: FOLDER_WINDOWS,
      applicationRegistryId: "finder",
      macExtension: null,
      windowsExtension: null,
      dateModified: "2024-03-20T10:00:00Z",
      size: null,
      protected: true,
      children: [],
    },
    {
      id: "applications",
      label: "Applications",
      type: "directory",
      image: FOLDER_MAC,
      alternativeImage: FOLDER_WINDOWS,
      applicationRegistryId: "finder",
      macExtension: null,
      windowsExtension: null,
      dateModified: "2024-03-20T10:00:00Z",
      size: null,
      protected: true,
      children: [
        createNodeFromTemplate("gtaViApp", {
          id: "gtavi-app",
          location: "applications",
          protected: false,
        }),
        createNodeFromTemplate("geoGameApp", {
          id: "geo-app",
          location: "applications",
          protected: false,
        }),
        createNodeFromTemplate("achievementsApp", {
          id: "achievements-app",
          location: "applications",
          protected: false,
        }),
        createNodeFromTemplate("pagesApp", {
          id: "pages",
          location: "applications",
          protected: false,
        }),
        createNodeFromTemplate("browserApp", {
          id: "browser-applications",
          location: "applications",
          protected: false,
        }),
        createNodeFromTemplate("terminalApp", {
          id: "terminal-applications",
          location: "applications",
          protected: false,
        }),
        createNodeFromTemplate("whatsAppApp", {
          id: "whatsapp-applications",
          location: "applications",
          protected: false,
        }),
        createNodeFromTemplate("settingsApp", {
          id: "settings-applications",
          location: "applications",
          protected: false,
        }),
        createNodeFromTemplate("finderApp", {
          id: "finder-applications",
          location: "applications",
          protected: false,
        }),
        createNodeFromTemplate("mapsApp", {
          id: "maps-applications",
          location: "applications",
          protected: false,
        }),
      ],
    },
    {
      id: "desktop-root",
      type: "directory",
      image: FOLDER_MAC,
      alternativeImage: FOLDER_WINDOWS,
      label: "Desktop",
      macExtension: null,
      windowsExtension: null,
      dateModified: "2024-03-20T10:00:00Z",
      applicationRegistryId: "finder",
      size: null,
      protected: true,
      children: [
        // ! for debugging
        // {
        //   id: "a",
        //   label: "A",
        //   type: "directory",
        //   image: FOLDER_MAC,
        //   alternativeImage: FOLDER_WINDOWS,
        //   applicationRegistryId: "finder",
        //   macExtension: null,
        //   windowsExtension: null,
        //   dateModified: "2024-03-20T10:00:00Z",
        //   size: null,
        //   protected: false,
        //   children: [],
        // },
        // {
        //   id: "b",
        //   label: "B",
        //   type: "directory",
        //   image: FOLDER_MAC,
        //   alternativeImage: FOLDER_WINDOWS,
        //   applicationRegistryId: "finder",
        //   macExtension: null,
        //   windowsExtension: null,
        //   dateModified: "2024-03-20T10:00:00Z",
        //   size: null,
        //   protected: false,
        //   children: [],
        // },
        // {
        //   id: "c",
        //   label: "C",
        //   type: "directory",
        //   image: FOLDER_MAC,
        //   alternativeImage: FOLDER_WINDOWS,
        //   applicationRegistryId: "finder",
        //   macExtension: null,
        //   windowsExtension: null,
        //   dateModified: "2024-03-20T10:00:00Z",
        //   size: null,
        //   protected: false,
        //   children: [],
        // },
        createNodeFromTemplate("whatsAppApp", {
          id: "whatsapp-desktop",
          location: "desktop",
          protected: false,
        }),

        createNodeFromTemplate("browserApp", {
          id: "browser-desktop",
          location: "desktop",
          protected: false,
        }),
        createNodeFromTemplate("terminalApp", {
          id: "terminal",
          protected: false,
        }),

        {
          id: "trash",
          label: "Trash",
          type: "directory",
          image: BIN_EMPTY,
          alternativeImage: BIN_FULL,
          applicationRegistryId: "finder",
          macExtension: null,
          windowsExtension: null,
          dateModified: "2024-03-20T09:15:00Z",
          size: null,
          protected: true,
          children: [],
        },
        {
          id: "portfolio",
          label: "Portfolio",
          type: "directory",
          image: FOLDER_MAC,
          alternativeImage: FOLDER_WINDOWS,
          applicationRegistryId: "finder",
          macExtension: null,
          windowsExtension: null,
          dateModified: "2024-03-20T11:30:00Z",
          size: null,
          protected: false,
          children: [
            {
              id: "laoutaris",
              label: "Laoutaris",
              type: "directory",
              image: FOLDER_MAC,
              alternativeImage: FOLDER_WINDOWS,
              applicationRegistryId: "finder",
              macExtension: null,
              windowsExtension: null,
              dateModified: "2024-03-20T11:30:00Z",
              size: null,
              protected: false,
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
                  protected: false,
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
                  protected: false,
                },
              ],
            },
            {
              id: "robocrop",
              label: "RoboCrop",
              type: "directory",
              image: FOLDER_MAC,
              alternativeImage: FOLDER_WINDOWS,
              applicationRegistryId: "finder",
              macExtension: null,
              windowsExtension: null,
              dateModified: "2024-03-20T11:30:00Z",
              size: null,
              protected: false,
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
                  protected: false,
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
                  protected: false,
                },
              ],
            },
            {
              id: "skynot",
              label: "SkyNot",
              type: "directory",
              image: FOLDER_MAC,
              alternativeImage: FOLDER_WINDOWS,
              applicationRegistryId: "finder",
              macExtension: null,
              windowsExtension: null,
              dateModified: "2024-03-20T11:30:00Z",
              size: null,
              protected: false,
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
                  protected: false,
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
                  protected: false,
                },
              ],
            },
            {
              id: "dashboard",
              label: "Dashboard",
              type: "directory",
              image: FOLDER_MAC,
              alternativeImage: FOLDER_WINDOWS,
              applicationRegistryId: "finder",
              macExtension: null,
              windowsExtension: null,
              dateModified: "2024-03-20T11:30:00Z",
              size: null,
              protected: false,
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
                  protected: false,
                },
              ],
            },
          ],
        },

        {
          id: "pdfs",
          label: "PDFs",
          type: "directory",
          image: FOLDER_MAC,
          alternativeImage: FOLDER_WINDOWS,
          applicationRegistryId: "finder",
          macExtension: null,
          windowsExtension: null,
          dateModified: "2024-03-20T12:00:00Z",
          size: null,
          protected: false,
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
              protected: false,
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
              protected: false,
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
              protected: false,
            },
          ],
        },
        {
          id: "games",
          label: "Games",
          type: "directory",
          image: FOLDER_MAC,
          alternativeImage: FOLDER_WINDOWS,
          applicationRegistryId: "finder",
          macExtension: null,
          windowsExtension: null,
          dateModified: "2024-03-20T13:15:00Z",
          size: null,
          protected: false,
          children: [
            createNodeFromTemplate("gtaViApp", {
              id: "gtavi-game",
              protected: false,
            }),
            createNodeFromTemplate("geoGameApp", {
              id: "geo-game",
              protected: false,
            }),
          ],
        },
        createNodeFromTemplate("achievementsApp", {
          id: "achievements-desktop",
          protected: false,
        }),
        // createNodeFromTemplate("portfolioDocument", {
        //   id: "sample-document",
        // }),
        {
          id: "pages-desktop",
          label: "About",
          type: "document",
          image: PAGES,
          alternativeImage: WORD,
          applicationRegistryId: "documentEditor",
          applicationId: "documentEditor",
          documentConfigId: "sample_document_config",
          macExtension: ".txt",
          windowsExtension: ".txt",
          dateModified: "2024-03-19T16:30:00Z", // TODO: add date modified
          size: 512, // TODO: add size
          protected: false,
        },
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
      applicationRegistryId: "finder",
      macExtension: null,
      windowsExtension: null,
      dateModified: "2024-03-20T10:00:00Z",
      size: null,
      protected: true,
      children: [
        createNodeFromTemplate("finderApp", {
          id: "finder",
          protected: false,
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
          protected: false,
        },
        createNodeFromTemplate("mapsApp", {
          id: "maps",
          protected: false,
        }),
        createNodeFromTemplate("calculatorApp", {
          id: "calculator-dock",
          location: "dock",
          protected: false,
        }),
        createNodeFromTemplate("settingsApp", {
          id: "settings-dock",
          location: "dock",
          protected: false,
        }),
        {
          id: "pages-dock",
          label: "Pages",
          type: "document",
          image: PAGES,
          alternativeImage: WORD,
          applicationRegistryId: "documentEditor",
          applicationId: "documentEditor",
          documentConfigId: "default_document_config",
          macExtension: ".txt",
          windowsExtension: ".txt",
          dateModified: "2024-03-19T16:30:00Z", // TODO: add date modified
          size: 512, // TODO: add size
          protected: false,
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
          protected: false,
        },
        {
          id: "linkedin-dock",
          label: "LinkedIn",
          type: "link",
          image: LINKEDIN,
          alternativeImage: null,
          url: "https://www.linkedin.com/in/heron-laoutaris/",
          macExtension: ".webloc",
          windowsExtension: ".url",
          dateModified: "2024-03-14T09:15:00Z",
          size: 1024, // 1KB for link file
          protected: false,
        },

        createNodeFromTemplate("whatsAppApp", {
          id: "whatsapp-dock",
          location: "dock",
          protected: false,
        }),
        createNodeFromTemplate("achievementsApp", {
          id: "achievements-dock",
          location: "dock",
          protected: false,
        }),
        createNodeFromTemplate("terminalApp", {
          id: "terminal-dock",
          location: "dock",
          protected: false,
        }),
        createNodeFromTemplate("browserApp", {
          id: "browser-dock",
          location: "dock",
          protected: false,
        }),
      ],
    },
  ],
};

// HUMAN-READABLE DATA DEFINITION - UNIFIED ROOT STRUCTURE
export const mobileNodes: DirectoryObject = {
  id: "mobile-root",
  type: "directory",
  image: FOLDER_MAC,
  alternativeImage: null,
  label: "System",
  macExtension: null,
  windowsExtension: null,
  dateModified: "2024-03-20T10:00:00Z",
  size: null,
  applicationRegistryId: "finder",
  protected: true,
  children: [
    {
      id: "mobile-home-root",
      type: "directory",
      image: FOLDER_MAC,
      alternativeImage: null,
      label: "Desktop",
      macExtension: null,
      windowsExtension: null,
      dateModified: "2024-03-20T10:00:00Z",
      applicationRegistryId: "finder",
      size: null,
      protected: true,
      children: [
        createNodeFromTemplate("mapsApp", {
          id: "maps",
          protected: false,
        }),

        createNodeFromTemplate("calculatorApp", {
          id: "calculator-desktop",
          location: "desktop",
          protected: false,
        }),

        createNodeFromTemplate("terminalApp", {
          id: "terminal",
          protected: false,
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
          protected: false,
        },
        {
          id: "linkedin-dock",
          label: "LinkedIn",
          type: "link",
          image: LINKEDIN,
          alternativeImage: null,
          url: "https://www.linkedin.com/in/heron-laoutaris/",
          macExtension: ".webloc",
          windowsExtension: ".url",
          dateModified: "2024-03-14T09:15:00Z",
          size: 1024, // 1KB for link file
          protected: false,
        },

        {
          id: "portfolio",
          label: "Portfolio",
          type: "directory",
          image: PORTFOLIO,
          alternativeImage: null,
          applicationRegistryId: "finder",
          macExtension: null,
          windowsExtension: null,
          dateModified: "2024-03-20T11:30:00Z",
          size: null,
          protected: false,
          children: [
            {
              id: "laoutaris",
              label: "Laoutaris",
              type: "directory",
              image: FOLDER_MAC,
              alternativeImage: FOLDER_WINDOWS,
              applicationRegistryId: "finder",
              macExtension: null,
              windowsExtension: null,
              dateModified: "2024-03-20T11:30:00Z",
              size: null,
              protected: false,
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
                  protected: false,
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
                  protected: false,
                },
              ],
            },
            {
              id: "robocrop",
              label: "RoboCrop",
              type: "directory",
              image: FOLDER_MAC,
              alternativeImage: FOLDER_WINDOWS,
              applicationRegistryId: "finder",
              macExtension: null,
              windowsExtension: null,
              dateModified: "2024-03-20T11:30:00Z",
              size: null,
              protected: false,
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
                  protected: false,
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
                  protected: false,
                },
              ],
            },
            {
              id: "skynot",
              label: "SkyNot",
              type: "directory",
              image: FOLDER_MAC,
              alternativeImage: FOLDER_WINDOWS,
              applicationRegistryId: "finder",
              macExtension: null,
              windowsExtension: null,
              dateModified: "2024-03-20T11:30:00Z",
              size: null,
              protected: false,
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
                  protected: false,
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
                  protected: false,
                },
              ],
            },
            {
              id: "dashboard",
              label: "Dashboard",
              type: "directory",
              image: FOLDER_MAC,
              alternativeImage: FOLDER_WINDOWS,
              applicationRegistryId: "finder",
              macExtension: null,
              windowsExtension: null,
              dateModified: "2024-03-20T11:30:00Z",
              size: null,
              protected: false,
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
                  protected: false,
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
          applicationRegistryId: "finder",
          macExtension: null,
          windowsExtension: null,
          dateModified: "2024-03-20T12:00:00Z",
          size: null,
          protected: false,
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
              protected: false,
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
              protected: false,
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
              protected: false,
            },
          ],
        },
        createNodeFromTemplate("gtaViApp", {
          id: "gtavi-mobile",
          protected: false,
        }),
        createNodeFromTemplate("geoGameApp", {
          id: "geo-mobile",
          protected: false,
        }),
        createNodeFromTemplate("achievementsApp", {
          id: "achievements-mobile",
          protected: false,
        }),
        {
          id: "pages-desktop",
          label: "Notes",
          type: "document",
          image: PAGES,
          alternativeImage: WORD,
          applicationRegistryId: "documentEditor",
          applicationId: "documentEditor",
          documentConfigId: "default_document_config",
          macExtension: ".txt",
          windowsExtension: ".txt",
          dateModified: "2024-03-19T16:30:00Z", // TODO: add date modified
          size: 512, // TODO: add size
          protected: false,
        },

        createNodeFromTemplate("settingsApp", {
          id: "settings-dock",
          location: "dock",
          protected: false,
        }),
        {
          id: "trash",
          label: "Trash",
          type: "directory",
          image: BIN_EMPTY,
          alternativeImage: BIN_FULL,
          applicationRegistryId: "finder",
          macExtension: null,
          windowsExtension: null,
          dateModified: "2024-03-20T09:15:00Z",
          size: null,
          protected: true,
          children: [],
        },
      ],
    },
    {
      id: "mobile-dock-root",
      label: "Dock",
      type: "directory",
      image: FOLDER_MAC,
      alternativeImage: FOLDER_WINDOWS,
      applicationRegistryId: "finder",
      macExtension: null,
      windowsExtension: null,
      dateModified: "2024-03-20T10:00:00Z",
      size: null,
      protected: true,
      children: [
        {
          id: "phone",
          label: "Phone",
          type: "application",
          image: PHONE,
          alternativeImage: null,
          applicationRegistryId: "whatsApp",
          applicationId: "phone",
          macExtension: ".txt",
          windowsExtension: ".txt",
          dateModified: "2024-03-19T16:30:00Z",
          size: 512, // 512 bytes for function
          protected: false,
        },

        createNodeFromTemplate("whatsAppApp", {
          id: "whatsapp-dock",
          location: "dock",
          protected: false,
        }),
        // createNodeFromTemplate("achievementsApp", {
        //   id: "achievements-dock",
        //   location: "dock",
        // }),
        createNodeFromTemplate("browserApp", {
          id: "browser-dock",
          location: "dock",
          protected: false,
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

// OPERATIONAL MAPS READY FOR USE
export const { nodeMap: defaultNodeMap, rootId: defaultRootId } =
  convertObjectsToMap(rootNodes);

export const { nodeMap: mobileNodeMap, rootId: mobileRootIdSystem } =
  convertObjectsToMap(mobileNodes);

export type DesktopRootId = "desktop-root";
export type DockRootId = "dock-root";

export type DesktopRoot = DesktopRootId | DockRootId;

export type MobileRootId = "mobile-home-root";
export type MobileDockRootId = "mobile-dock-root";

export type MobileRoot = MobileRootId | MobileDockRootId;

export type SystemRootId = "system-root";

// Legacy support - desktop root ID for components that expect it
export const systemRootId = "system-root";
export const desktopRootId: DesktopRootId = "desktop-root";
export const dockRootId: DockRootId = "dock-root";
export const mobileRootId: MobileRootId = "mobile-home-root";
export const mobileDockRootId: MobileDockRootId = "mobile-dock-root";

export type RootDirectoryId = DesktopRoot | MobileRoot;

// {
//   id: "gta-vi-application",
//   label: "GTA VI",
//   type: "application",
//   image: GITHUB,
//   alternativeImage: null,
//   applicationRegistryId: "gtaVi",
//   applicationId: "gtaVi",
//   macExtension: ".app",
//   windowsExtension: ".exe",
//   dateModified: "2024-03-20T10:00:00Z",
//   size: null,
//   protected: false,
// },

// {
//   id: "geo-application",
//   label: "Geo",
//   type: "application",
//   image: GITHUB,
//   alternativeImage: null,
//   applicationRegistryId: "geo",
//   applicationId: "geo",
//   macExtension: ".app",
//   windowsExtension: ".exe",
//   dateModified: "2024-03-20T10:00:00Z",
//   size: null,
//   protected: false,
// },
// {
//   id: "pages-application",
//   label: "Pages",
//   type: "document",
//   image: PAGES,
//   alternativeImage: WORD,
//   applicationRegistryId: "documentEditor",
//   applicationId: "documentEditor",
//   documentConfigId: "default_document_config",
//   macExtension: ".txt",
//   windowsExtension: ".txt",
//   dateModified: "2024-03-19T16:30:00Z", // TODO: add date modified
//   size: 512, // TODO: add size
//   protected: false,
// },
// {
//   id: "whatsapp-application",
//   label: "WhatsApp",
//   type: "application",
//   image: WHATSAPP,
//   alternativeImage: null,
//   applicationRegistryId: "whatsApp",
//   applicationId: "whatsApp",
//   macExtension: ".app",
//   windowsExtension: ".exe",
//   dateModified: "2024-03-20T10:00:00Z",
//   size: null,
//   protected: false,
// },
// {
//   id: "browser-application",
//   label: "Browser",
//   type: "application",
//   image: SAFARI,
//   alternativeImage: null,
//   applicationRegistryId: "browser",
//   applicationId: "browser",
//   macExtension: ".app",
//   windowsExtension: ".exe",
//   dateModified: "2024-03-20T10:00:00Z",
//   size: null,
//   protected: false,
// },
// createNodeFromTemplate("browserApp", {
//   id: "browser-applications",
//   location: "applications",
//   protected: false,
// }),
// createNodeFromTemplate("terminalApp", {
//   id: "terminal-applications",
//   location: "applications",
//   protected: false,
// }),
// {
//   id: "gta-vi-application",
//   label: "GTA VI",
//   type: "application",
//   image: GITHUB,
//   alternativeImage: null,
//   applicationRegistryId: "gtaVi",
//   applicationId: "gtaVi",
//   macExtension: ".app",
//   windowsExtension: ".exe",
//   dateModified: "2024-03-20T10:00:00Z",
//   size: null,
// },
