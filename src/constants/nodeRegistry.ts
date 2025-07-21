import type { ApplicationRegistryId } from "@/constants/applicationRegistry";
import type {
  NodeType,
  MacApplicationExtensions,
  WindowsApplicationExtensions,
  MacDirectoryExtensions,
  WindowsDirectoryExtensions,
  MacDocumentExtensions,
  WindowsDocumentExtensions,
} from "@/components/nodes/nodeTypes";
import {
  CALCULATOR,
  WHATSAPP,
  TERMINAL,
  SAFARI,
  EDGE,
  FOLDER_MAC,
  FOLDER_WINDOWS,
  TROPHY1,
  GTA6_LOGO,
  PLANET,
  FINDER,
  MAPS,
  SETTINGS,
  PAGES,
  WORD,
  STOCKS,
} from "@/constants/images";

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE INTERFACES (Type-safe node templates)
// ═══════════════════════════════════════════════════════════════════════════════

interface BaseNodeTemplate {
  type: NodeType;
  label: string;
  image: string;
  alternativeImage: string | null;
  dateModified: string;
  size: number | null;
  protected: boolean;
}

interface ApplicationTemplate extends BaseNodeTemplate {
  type: "application";
  applicationRegistryId: ApplicationRegistryId;
  applicationId: string;
  macExtension: MacApplicationExtensions;
  windowsExtension: WindowsApplicationExtensions;
}

interface DirectoryTemplate extends BaseNodeTemplate {
  type: "directory";
  applicationRegistryId: ApplicationRegistryId;
  macExtension: MacDirectoryExtensions;
  windowsExtension: WindowsDirectoryExtensions;
  size: null; // Always null for directories
}

interface DocumentTemplate extends BaseNodeTemplate {
  type: "document";
  applicationRegistryId: ApplicationRegistryId;
  applicationId: string;
  documentConfigId: string;
  macExtension: MacDocumentExtensions;
  windowsExtension: WindowsDocumentExtensions;
}

// ═══════════════════════════════════════════════════════════════════════════════
// NODE TEMPLATES REGISTRY
// ═══════════════════════════════════════════════════════════════════════════════

export const NODE_TEMPLATES = {
  // ─────────── Application Templates ───────────
  calculatorApp: {
    type: "application",
    applicationRegistryId: "calculator",
    applicationId: "calculator",
    label: "Calculator",
    image: CALCULATOR,
    alternativeImage: null,
    macExtension: ".app",
    windowsExtension: ".exe",
    dateModified: "2024-03-17T08:45:00Z",
    size: 65000000, // 65MB
    protected: false,
  } satisfies ApplicationTemplate,

  whatsAppApp: {
    type: "application",
    applicationRegistryId: "whatsApp",
    applicationId: "whatsApp",
    label: "WhatsApp",
    image: WHATSAPP,
    alternativeImage: null,
    macExtension: ".app",
    windowsExtension: ".exe",
    dateModified: "2024-03-13T15:45:00Z",
    size: 145000000, // 145MB
    protected: false,
  } satisfies ApplicationTemplate,

  terminalApp: {
    type: "application",
    applicationRegistryId: "terminal",
    applicationId: "terminal",
    label: "Terminal",
    image: TERMINAL,
    alternativeImage: null,
    macExtension: ".app",
    windowsExtension: ".exe",
    dateModified: "2024-03-18T14:20:00Z",
    size: 85000000, // 85MB
    protected: false,
  } satisfies ApplicationTemplate,

  stocksApp: {
    type: "application",
    applicationRegistryId: "stocks",
    applicationId: "stocks",
    label: "Stocks",
    image: STOCKS,
    alternativeImage: null,
    macExtension: ".app",
    windowsExtension: ".exe",
    dateModified: "2024-03-19T15:30:00Z",
    size: 245000000, // 245MB
    protected: false,
  } satisfies ApplicationTemplate,

  browserApp: {
    type: "application",
    applicationRegistryId: "browser",
    applicationId: "browser",
    label: "Internet",
    image: SAFARI,
    alternativeImage: EDGE,
    macExtension: ".app",
    windowsExtension: ".exe",
    dateModified: "2024-03-19T15:30:00Z",
    size: 245000000, // 245MB
    protected: false,
  } satisfies ApplicationTemplate,

  achievementsApp: {
    type: "application",
    applicationRegistryId: "achievements",
    applicationId: "achievements",
    label: "Achievements",
    image: TROPHY1,
    alternativeImage: null,
    macExtension: ".app",
    windowsExtension: ".exe",
    dateModified: "2024-03-12T10:30:00Z",
    size: 95000000, // 95MB
    protected: false,
  } satisfies ApplicationTemplate,

  gtaViApp: {
    type: "application",
    applicationRegistryId: "gtaVi",
    applicationId: "gtaVi",
    label: "GTAVI",
    image: GTA6_LOGO,
    alternativeImage: null,
    macExtension: ".app",
    windowsExtension: ".exe",
    dateModified: "2024-03-15T11:20:00Z",
    size: 185000000, // 185MB
    protected: false,
  } satisfies ApplicationTemplate,

  geoGameApp: {
    type: "application",
    applicationRegistryId: "geoGame",
    applicationId: "geoGame",
    label: "GeoQuest",
    image: PLANET,
    alternativeImage: null,
    macExtension: ".app",
    windowsExtension: ".exe",
    dateModified: "2024-03-14T14:30:00Z",
    size: 125000000, // 125MB
    protected: false,
  } satisfies ApplicationTemplate,

  finderApp: {
    type: "application",
    applicationRegistryId: "finder",
    applicationId: "finder",
    label: "Finder",
    image: FINDER,
    alternativeImage: FINDER,
    macExtension: ".app",
    windowsExtension: ".exe",
    dateModified: "2024-03-20T10:00:00Z",
    size: null,
    protected: false,
  } satisfies ApplicationTemplate,

  mapsApp: {
    type: "application",
    applicationRegistryId: "maps",
    applicationId: "maps",
    label: "Maps",
    image: MAPS,
    alternativeImage: null,
    macExtension: ".app",
    windowsExtension: ".exe",
    dateModified: "2024-03-18T13:45:00Z",
    size: 155000000, // 155MB
    protected: false,
  } satisfies ApplicationTemplate,

  settingsApp: {
    type: "application",
    applicationRegistryId: "settings",
    applicationId: "settings",
    label: "Settings",
    image: SETTINGS,
    alternativeImage: null,
    macExtension: ".app",
    windowsExtension: ".exe",
    dateModified: "2024-03-12T10:30:00Z",
    size: 95000000, // 95MB
    protected: false,
  } satisfies ApplicationTemplate,

  pagesApp: {
    type: "application",
    applicationRegistryId: "documentEditor",
    applicationId: "documentEditor",
    label: "Pages",
    image: PAGES,
    alternativeImage: WORD,
    macExtension: ".app",
    windowsExtension: ".exe",
    dateModified: "2024-03-16T11:20:00Z",
    size: 175000000, // 175MB
    protected: false,
  } satisfies ApplicationTemplate,

  // ─────────── Directory Templates ───────────
  finderDirectory: {
    type: "directory",
    applicationRegistryId: "finder",
    label: "Folder",
    image: FOLDER_MAC,
    alternativeImage: FOLDER_WINDOWS,
    macExtension: null,
    windowsExtension: null,
    dateModified: "2024-03-20T11:30:00Z",
    size: null,
    protected: false,
  } satisfies DirectoryTemplate,

  // ─────────── Document Templates ───────────
  document: {
    type: "document",
    applicationRegistryId: "documentEditor",
    applicationId: "documentEditor",
    documentConfigId: "default_document_config",
    label: "Untitled",
    image: PAGES,
    alternativeImage: WORD,
    macExtension: ".txt",
    windowsExtension: ".txt",
    dateModified: "2024-03-20T09:00:00Z",
    size: 25000, // 25KB
    protected: false,
  } satisfies DocumentTemplate,
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE-SAFE ID GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

export type NodeTemplateId = keyof typeof NODE_TEMPLATES;
export type LocationContext =
  | "desktop"
  | "dock"
  | "games"
  | "documents"
  | "portfolio"
  | string;

/**
 * Generate a consistent, readable node ID from template and context
 */
export const generateNodeId = <T extends NodeTemplateId>(
  templateId: T,
  location: LocationContext,
  suffix?: string
): string => {
  // Convert camelCase template name to kebab-case
  const baseName = templateId
    .replace(/App$/, "") // Remove 'App' suffix
    .replace(/Directory$/, "") // Remove 'Directory' suffix
    .replace(/Document$/, "") // Remove 'Document' suffix
    .replace(/([A-Z])/g, "-$1") // Add hyphens before capitals
    .toLowerCase()
    .replace(/^-/, ""); // Remove leading hyphen

  // Add location context for common locations
  const locationSuffix =
    location === "desktop" || location === "dock" ? `-${location}` : "";

  // Add custom suffix if provided
  const customSuffix = suffix ? `-${suffix}` : "";

  return `${baseName}${locationSuffix}${customSuffix}`;
};

/**
 * Create a complete node from a template with overrides
 */
export const createNodeFromTemplate = <T extends NodeTemplateId>(
  templateId: T,
  overrides: Partial<(typeof NODE_TEMPLATES)[T]> & {
    id?: string;
    location?: LocationContext;
    idSuffix?: string;
    protected?: boolean;
  }
): (typeof NODE_TEMPLATES)[T] & { id: string } => {
  const template = NODE_TEMPLATES[templateId];

  // Generate ID if not provided
  const id =
    overrides.id ||
    generateNodeId(
      templateId,
      overrides.location || "default",
      overrides.idSuffix
    );

  // Remove helper properties from overrides
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { location, idSuffix, ...templateOverrides } = overrides;

  return {
    ...template,
    ...templateOverrides,
    id,
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get all available template IDs for type-safe selection
 */
export const getAvailableTemplates = (): NodeTemplateId[] => {
  return Object.keys(NODE_TEMPLATES) as NodeTemplateId[];
};

/**
 * Check if a template is an application template
 */
export const isApplicationTemplate = (templateId: NodeTemplateId): boolean => {
  return NODE_TEMPLATES[templateId].type === "application";
};

/**
 * Check if a template is a directory template
 */
export const isDirectoryTemplate = (templateId: NodeTemplateId): boolean => {
  return NODE_TEMPLATES[templateId].type === "directory";
};

/**
 * Check if a template is a document template
 */
export const isDocumentTemplate = (templateId: NodeTemplateId): boolean => {
  return NODE_TEMPLATES[templateId].type === "document";
};

/**
 * Get template by ID with full type safety
 */
export const getTemplate = <T extends NodeTemplateId>(
  templateId: T
): (typeof NODE_TEMPLATES)[T] => {
  return NODE_TEMPLATES[templateId];
};

// ═══════════════════════════════════════════════════════════════════════════════
// WINDOWABLE NODE TYPES (For window opening type safety)
// ═══════════════════════════════════════════════════════════════════════════════

// Templates that can open windows (have applicationRegistryId)
export type WindowableTemplateId = {
  [K in NodeTemplateId]: (typeof NODE_TEMPLATES)[K] extends {
    applicationRegistryId: ApplicationRegistryId;
  }
    ? K
    : never;
}[NodeTemplateId];

// Example usage for future windowable node type
export type WindowableTemplate = (typeof NODE_TEMPLATES)[WindowableTemplateId];
