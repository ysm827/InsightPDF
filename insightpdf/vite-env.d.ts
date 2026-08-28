/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Gemini API key, injected from GEMINI_API_KEY / VITE_GEMINI_API_KEY at build time */
  readonly VITE_GEMINI_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
