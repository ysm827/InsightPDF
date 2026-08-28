import { useState, useEffect, useCallback } from 'react';
import { storage } from '../services/storageService';

export const DEFAULT_MODEL = 'gemini-3-flash-preview';

export const useSettings = () => {
  const [model, setModel] = useState<string>(DEFAULT_MODEL);
  const [useFilesApi, setUseFilesApi] = useState<boolean>(true);
  const [isSettingsHydrated, setIsSettingsHydrated] = useState(false);

  useEffect(() => {
    setModel(storage.getModel(DEFAULT_MODEL));
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
    toggleFilesApi,
    isSettingsHydrated
  };
};
