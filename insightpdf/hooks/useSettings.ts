import { useState, useEffect, useCallback } from 'react';
import { storage } from '@/services/storageService';
import { API_CONFIG } from '@/constants';

export const DEFAULT_MODEL = API_CONFIG.DEFAULT_MODEL;

/** Automatic migration map for legacy/deprecated model names */
const DEPRECATED_MODEL_MIGRATIONS: Record<string, string> = {
  'gemini-3-flash-preview': 'gemini-3.7-flash',
  'gemini-3-pro-preview': 'gemini-3.1-pro',
  'gemini-3.5-flash': 'gemini-3.7-flash',
  'gemini-3.5-flash-lite': 'gemini-3.7-flash',
};

export const useSettings = () => {
  const [model, setModel] = useState<string>(DEFAULT_MODEL);
  const [useFilesApi, setUseFilesApi] = useState<boolean>(true);
  const [isSettingsHydrated, setIsSettingsHydrated] = useState(false);

  useEffect(() => {
    let savedModel = storage.getModel(DEFAULT_MODEL);
    if (savedModel && DEPRECATED_MODEL_MIGRATIONS[savedModel]) {
      savedModel = DEPRECATED_MODEL_MIGRATIONS[savedModel];
      storage.saveModel(savedModel);
    }
    setModel(savedModel);
    setUseFilesApi(storage.getUseFilesApi(true));
    setIsSettingsHydrated(true);
  }, []);

  useEffect(() => {
    if (isSettingsHydrated) {
      storage.saveModel(model);
    }
  }, [model, isSettingsHydrated]);

  useEffect(() => {
    if (isSettingsHydrated) {
      storage.saveUseFilesApi(useFilesApi);
    }
  }, [useFilesApi, isSettingsHydrated]);

  const toggleFilesApi = useCallback(() => {
    setUseFilesApi(prev => !prev);
  }, []);

  return {
    model,
    setModel,
    useFilesApi,
    toggleFilesApi
  };
};
