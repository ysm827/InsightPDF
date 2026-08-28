import { useCallback, useEffect, useRef } from 'react';
import type { ChatMessage, LocatorResult } from '@/types';
import { AppStatus, generateId } from '@/types';
import { fileToGenerativePart, chatWithPdf, uploadFileToGemini } from '@/services/geminiService';
import type { GenerativeFilePart } from '@/services/geminiService';
import { useSettings } from '@/hooks/useSettings';
import { useFileHandler } from '@/hooks/useFileHandler';
import { useChatSession } from '@/hooks/useChatSession';

const isPdfFile = (file: File): boolean =>
  file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

export const useChatController = () => {
  // Use modular hooks
  const { 
    model, 
    setModel, 
    useFilesApi, 
    toggleFilesApi 
  } = useSettings();

  const { 
    file, 
    saveFile, 
    uploadedFileUri, 
    setUploadedFileUri 
  } = useFileHandler();

  const { 
    status, 
    setStatus, 
    messages, 
    setMessages, 
    activeResult, 
    setActiveResult, 
    errorMessage,
    setErrorMessage,
    clearSession 
  } = useChatSession();

  // Remembers the last question so the error state can offer a one-click retry
  const lastQueryRef = useRef<string | null>(null);
  // Ref mirrors so runSearch never works with stale closures on retry
  const fileRef = useRef<File | null>(null);
  fileRef.current = file;
  const uploadedUriRef = useRef<string | null>(null);
  uploadedUriRef.current = uploadedFileUri;

  // Reset retry state when a new file is loaded
  useEffect(() => {
    lastQueryRef.current = null;
  }, [file]);

  const runSearch = useCallback(async (query: string, currentFile: File) => {
    setErrorMessage(null);
    setStatus(AppStatus.SEARCHING);

    try {
      let filePart: GenerativeFilePart;

      if (useFilesApi) {
        let currentUri = uploadedUriRef.current;

        // Fallback: If not uploaded yet (e.g. toggled setting on after upload), upload now
        if (!currentUri) {
          setStatus(AppStatus.PROCESSING_FILE);
          currentUri = await uploadFileToGemini(currentFile);
          setUploadedFileUri(currentUri);
          setStatus(AppStatus.SEARCHING); // Restore searching status
        }

        filePart = {
          fileData: {
            mimeType: currentFile.type || 'application/pdf',
            fileUri: currentUri
          }
        };
      } else {
        // Use inline base64
        filePart = await fileToGenerativePart(currentFile);
      }

      // Pass the selected model to the service
      const result = await chatWithPdf(filePart, query, model);

      const aiMsg: ChatMessage = {
        id: generateId(),
        role: 'ai',
        text: result.answer,
        locationData: result,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMsg]);

      // If location found, auto-select it
      if (result.pageNumber) {
        setActiveResult(result);
      }

      setStatus(AppStatus.SUCCESS);
      lastQueryRef.current = null;
    } catch (error) {
      console.error(error);
      lastQueryRef.current = query;
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred while generating content."
      );
      setStatus(AppStatus.ERROR);
    }
  }, [model, useFilesApi, setMessages, setStatus, setActiveResult, setUploadedFileUri, setErrorMessage]);

  const handleFileUpload = useCallback(async (uploadedFile: File) => {
    // Validate before touching any state
    if (!isPdfFile(uploadedFile)) {
      setErrorMessage('仅支持 PDF 文件，请重新选择。');
      setStatus(AppStatus.ERROR);
      return;
    }

    // 1. Reset Chat Session
    clearSession();
    
    // 2. Save File State (IDB)
    try {
      await saveFile(uploadedFile);
    } catch (err) {
      console.error("Failed to save file to DB", err);
    }

    // 3. Clear old URI since we have a new file
    setUploadedFileUri(null);
    setErrorMessage(null);

    // 4. Handle Upload if using Files API
    if (useFilesApi) {
      setStatus(AppStatus.PROCESSING_FILE);
      try {
        const uri = await uploadFileToGemini(uploadedFile);
        setUploadedFileUri(uri);
        setStatus(AppStatus.IDLE);
      } catch (error) {
        console.error("File upload failed:", error);
        setErrorMessage(
          error instanceof Error ? error.message : "File upload failed."
        );
        setStatus(AppStatus.ERROR);
      }
    } else {
      setStatus(AppStatus.IDLE);
    }
  }, [useFilesApi, clearSession, saveFile, setStatus, setUploadedFileUri, setErrorMessage]);

  const handleClearChat = useCallback(() => {
    // Just clear the conversation, keep the file
    lastQueryRef.current = null;
    clearSession();
  }, [clearSession]);

  const handleViewLocation = useCallback((result: LocatorResult) => {
    setActiveResult({ ...result });
  }, [setActiveResult]);

  const handleSearch = useCallback(async (query: string) => {
    const currentFile = fileRef.current;
    if (!currentFile || !query.trim()) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      text: query,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);

    await runSearch(query, currentFile);
  }, [runSearch, setMessages]);

  /** Re-sends the last failed question without duplicating the user message. */
  const handleRetry = useCallback(async () => {
    const currentFile = fileRef.current;
    const query = lastQueryRef.current;
    if (!currentFile || !query) return;
    await runSearch(query, currentFile);
  }, [runSearch]);

  const canRetry = status === AppStatus.ERROR && lastQueryRef.current !== null;

  return {
    file,
    status,
    messages,
    activeResult,
    model,
    useFilesApi,
    errorMessage,
    setModel,
    handleFileUpload,
    handleClearChat,
    handleSearch,
    handleRetry,
    canRetry,
    handleViewLocation,
    toggleFilesApi
  };
};
