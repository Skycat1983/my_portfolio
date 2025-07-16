import type { SetState, GetState } from "@/types/storeTypes";
import {
  ABOUT_DOCUMENT_CONFIG,
  DEFAULT_DOCUMENT_CONFIG,
  EMPLOYMENT_HISTORY_DOCUMENT_CONFIG,
  MY_STACK_DOCUMENT_CONFIG,
  PRIVATE_DOCUMENT_CONFIG,
  type DocumentConfig,
} from "@/constants/documentRegistry";

export interface DocumentRegistryState {
  configs: Map<string, DocumentConfig>;
}

export interface DocumentRegistryActions {
  // Core registry operations
  getDocumentConfig: (id: string) => DocumentConfig | undefined;
  setDocumentConfig: (id: string, config: DocumentConfig) => DocumentConfig;
  deleteDocumentConfig: (id: string) => boolean;

  // Utility operations
  generateConfigId: () => string;
  hasDocumentConfig: (id: string) => boolean;
  getAllDocumentConfigs: () => DocumentConfig[];

  // Registry management
  clearDocumentRegistry: () => void;
  getRegistrySize: () => number;
}

export type DocumentRegistrySlice = DocumentRegistryState &
  DocumentRegistryActions;

// Document registry slice - manages persistent document configurations
export const createDocumentRegistrySlice = (
  set: SetState<DocumentRegistrySlice>,
  get: GetState<DocumentRegistrySlice>
): DocumentRegistrySlice => {
  // Initialize with sample document configuration
  const initialConfigs = new Map<string, DocumentConfig>();
  initialConfigs.set(ABOUT_DOCUMENT_CONFIG.id, ABOUT_DOCUMENT_CONFIG);
  initialConfigs.set(DEFAULT_DOCUMENT_CONFIG.id, DEFAULT_DOCUMENT_CONFIG);
  initialConfigs.set(
    EMPLOYMENT_HISTORY_DOCUMENT_CONFIG.id,
    EMPLOYMENT_HISTORY_DOCUMENT_CONFIG
  );
  initialConfigs.set(MY_STACK_DOCUMENT_CONFIG.id, MY_STACK_DOCUMENT_CONFIG);
  initialConfigs.set(PRIVATE_DOCUMENT_CONFIG.id, PRIVATE_DOCUMENT_CONFIG);

  return {
    // State
    configs: initialConfigs,

    /**
     * Get a document configuration by ID
     */
    getDocumentConfig: (id: string): DocumentConfig | undefined => {
      console.log("getDocumentConfig: retrieving config for ID", id);
      return get().configs.get(id);
    },

    /**
     * Store a document configuration with the given ID
     */
    setDocumentConfig: (id: string, config: DocumentConfig): DocumentConfig => {
      console.log("DocumentEditorDebug: storing config for ID", id, config);
      set((state: DocumentRegistrySlice) => {
        const newConfigs = new Map(state.configs);
        newConfigs.set(id, config);
        return { configs: newConfigs };
      });
      return config;
    },

    /**
     * Delete a document configuration by ID
     */
    deleteDocumentConfig: (id: string): boolean => {
      console.log("deleteDocumentConfig: removing config for ID", id);
      const state = get();
      const isDeleteable = state.configs.get(id)?.mutable;
      if (!isDeleteable) {
        console.log("deleteDocumentConfig: config is not mutable");
        return false;
      }
      if (!state.configs.has(id)) {
        console.log("deleteDocumentConfig: config not found for ID", id);
        return false;
      }

      set((state: DocumentRegistrySlice) => {
        const newConfigs = new Map(state.configs);
        newConfigs.delete(id);
        return { configs: newConfigs };
      });

      return true;
    },

    /**
     * Generate a unique configuration ID
     */
    generateConfigId: (): string => {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 15);
      const configId = `doc_${timestamp}_${random}`;
      console.log("generateConfigId: generated new ID", configId);
      return configId;
    },

    /**
     * Check if a document configuration exists for the given ID
     */
    hasDocumentConfig: (id: string): boolean => {
      const exists = get().configs.has(id);
      console.log("hasDocumentConfig: checking ID", id, "exists:", exists);
      return exists;
    },

    /**
     * Get all document configurations as an array
     */
    getAllDocumentConfigs: (): DocumentConfig[] => {
      const configs = Array.from(get().configs.values());
      console.log(
        "getAllDocumentConfigs: returning",
        configs.length,
        "configs"
      );
      return configs;
    },

    /**
     * Clear all document configurations (for development/testing)
     */
    clearDocumentRegistry: (): void => {
      console.log("clearDocumentRegistry: clearing all document configs");
      set({ configs: new Map<string, DocumentConfig>() });
    },

    /**
     * Get the current size of the document registry
     */
    getRegistrySize: (): number => {
      const size = get().configs.size;
      console.log("getRegistrySize: registry contains", size, "configs");
      return size;
    },
  };
};
