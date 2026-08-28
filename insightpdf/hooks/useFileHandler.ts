import { useState, useEffect } from 'react';
import { storage, getFileFromDB, saveFileToDB } from '../services/storageService';

export const useFileHandler = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFileUri, setUploadedFileUri] = useState<string | null>(null);
  const [isFileHydrated, setIsFileHydrated] = useState(false);

  // Hydrate File and URI. State updates inside this effect are batched,
  // so the persistence effect below never fires with stale values.
  useEffect(() => {
    const loadFileState = async () => {
      try {
        const savedUri = storage.getUploadedUri();
        setUploadedFileUri(savedUri);

        const savedFile = await getFileFromDB();
        if (savedFile) {
          setFile(savedFile);
        }
      } catch (error) {
        console.error("Failed to hydrate file state:", error);
      } finally {
        setIsFileHydrated(true);
      }
    };
    loadFileState();
  }, []);

  // Persist Uploaded URI
  useEffect(() => {
    if (isFileHydrated) {
      storage.saveUploadedUri(uploadedFileUri);
    }
  }, [uploadedFileUri, isFileHydrated]);

  const saveFile = async (newFile: File) => {
    setFile(newFile);
    await saveFileToDB(newFile);
  };

  return {
    file,
    setFile,
    saveFile,
    uploadedFileUri,
    setUploadedFileUri,
    isFileHydrated
  };
};
