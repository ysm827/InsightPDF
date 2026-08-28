import type { ChatMessage, LocatorResult } from '../types';

const DB_NAME = 'InsightPDF_DB';
const DB_VERSION = 1;
const STORE_NAME = 'files';
const KEY_FILE = 'current_pdf';

// --- IndexedDB Helpers for PDF File ---

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

export const saveFileToDB = async (file: File): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    // Store file metadata and content (Blob)
    const fileData = {
      name: file.name,
      type: file.type,
      lastModified: file.lastModified,
      content: file // File objects are Blobs and can be stored properly in IDB
    };

    const request = store.put(fileData, KEY_FILE);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getFileFromDB = async (): Promise<File | null> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(KEY_FILE);

    request.onsuccess = () => {
      const result = request.result;
      if (result) {
        // Reconstruct File object
        const file = new File([result.content], result.name, {
          type: result.type,
          lastModified: result.lastModified,
        });
        resolve(file);
      } else {
        resolve(null);
      }
    };
    request.onerror = () => reject(request.error);
  });
};

export const clearFileFromDB = async (): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(KEY_FILE);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// --- LocalStorage Helpers for Metadata ---

const KEYS = {
  MESSAGES: 'insight_messages',
  ACTIVE_RESULT: 'insight_active_result',
  MODEL: 'insight_model',
  USE_FILES_API: 'insight_use_files_api',
  UPLOADED_URI: 'insight_uploaded_uri',
  CUSTOM_CONFIG: 'insight_custom_config',
} as const;

/** JSON.parse that never throws — corrupted entries are treated as absent. */
const readJson = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (error) {
    console.warn(`[storage] Failed to parse "${key}", using fallback.`, error);
    return fallback;
  }
};

export interface CustomApiConfig {
  enabled: boolean;
  apiKey: string;
  baseUrl: string;
}

const DEFAULT_CUSTOM_CONFIG: CustomApiConfig = {
  enabled: false,
  apiKey: '',
  baseUrl: '',
};

export const storage = {
  saveMessages: (messages: ChatMessage[]) => {
    try {
      localStorage.setItem(KEYS.MESSAGES, JSON.stringify(messages));
    } catch (error) {
      // Storage can be full (quota) or unavailable (private mode) — degrade gracefully.
      console.warn('[storage] Failed to persist messages.', error);
    }
  },
  getMessages: (): ChatMessage[] => readJson<ChatMessage[]>(KEYS.MESSAGES, []),
  
  saveActiveResult: (result: LocatorResult | null) => {
    if (result) {
      localStorage.setItem(KEYS.ACTIVE_RESULT, JSON.stringify(result));
    } else {
      localStorage.removeItem(KEYS.ACTIVE_RESULT);
    }
  },
  getActiveResult: (): LocatorResult | null =>
    readJson<LocatorResult | null>(KEYS.ACTIVE_RESULT, null),

  saveModel: (model: string) => {
    localStorage.setItem(KEYS.MODEL, model);
  },
  getModel: (defaultModel: string): string => {
    return localStorage.getItem(KEYS.MODEL) || defaultModel;
  },

  saveUseFilesApi: (use: boolean) => {
    localStorage.setItem(KEYS.USE_FILES_API, JSON.stringify(use));
  },
  getUseFilesApi: (defaultVal: boolean): boolean => {
    const data = localStorage.getItem(KEYS.USE_FILES_API);
    return data === null ? defaultVal : data === 'true';
  },

  saveUploadedUri: (uri: string | null) => {
    if (uri) localStorage.setItem(KEYS.UPLOADED_URI, uri);
    else localStorage.removeItem(KEYS.UPLOADED_URI);
  },
  getUploadedUri: (): string | null => {
    return localStorage.getItem(KEYS.UPLOADED_URI);
  },

  saveCustomConfig: (config: CustomApiConfig) => {
    localStorage.setItem(KEYS.CUSTOM_CONFIG, JSON.stringify(config));
  },
  getCustomConfig: (): CustomApiConfig =>
    readJson<CustomApiConfig>(KEYS.CUSTOM_CONFIG, DEFAULT_CUSTOM_CONFIG),

  clearAllMetadata: () => {
    localStorage.removeItem(KEYS.MESSAGES);
    localStorage.removeItem(KEYS.ACTIVE_RESULT);
    localStorage.removeItem(KEYS.UPLOADED_URI);
    // Note: We deliberately don't clear settings like Model, UseFilesApi or CustomConfig
  },

  clearChatSession: () => {
    localStorage.removeItem(KEYS.MESSAGES);
    localStorage.removeItem(KEYS.ACTIVE_RESULT);
  }
};
