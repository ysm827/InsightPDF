/**
 * Application-wide constants and configuration values.
 */

export const APP_CONFIG = {
  NAME: 'InsightPDF',
  VERSION: '1.1.0',
  GITHUB_REPO_URL: 'https://github.com/yeahhe365/InsightPDF',
  GITHUB_API_URL: 'https://api.github.com/repos/yeahhe365/InsightPDF',
} as const;

export const PDF_CONFIG = {
  /** Number of pages to keep rendered around the current page for virtualization */
  WINDOW_RENDER_SIZE: 2,
  /** Zoom scale bounds */
  SCALE_MIN: 0.2,
  SCALE_MAX: 3.0,
  SCALE_STEP: 0.1,
  DEFAULT_SCALE: 1.0,
} as const;

export const SIDEBAR_CONFIG = {
  MIN_WIDTH: 300,
  MAX_WIDTH: 800,
  DEFAULT_WIDTH: 385,
} as const;

export const API_CONFIG = {
  /** Maximum time (ms) to wait for a Gemini request before failing gracefully */
  REQUEST_TIMEOUT_MS: 120_000,
  DEFAULT_MODEL: 'gemini-3.7-flash',
} as const;

export const STORAGE_KEYS = {
  MESSAGES: 'insight_messages',
  ACTIVE_RESULT: 'insight_active_result',
  MODEL: 'insight_model',
  USE_FILES_API: 'insight_use_files_api',
  UPLOADED_URI: 'insight_uploaded_uri',
  CUSTOM_CONFIG: 'insight_custom_config',
  THEME: 'theme',
} as const;
