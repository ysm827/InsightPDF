import { useState, useEffect, useCallback } from 'react';
import type { ChatMessage, LocatorResult } from '@/types';
import { AppStatus } from '@/types';
import { storage } from '@/services/storageService';

export const useChatSession = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeResult, setActiveResult] = useState<LocatorResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isChatHydrated, setIsChatHydrated] = useState(false);

  // Hydrate Chat Session. State updates inside this effect are batched,
  // so the persistence effects below never fire with stale values.
  useEffect(() => {
    try {
      const savedMessages = storage.getMessages();
      const savedActiveResult = storage.getActiveResult();

      setMessages(savedMessages);
      setActiveResult(savedActiveResult);

      // If we restored messages, update status to show content
      if (savedMessages.length > 0) {
        setStatus(AppStatus.SUCCESS);
      }
    } catch (error) {
      console.error("Failed to hydrate chat session:", error);
    } finally {
      setIsChatHydrated(true);
    }
  }, []);

  // Persist Messages
  useEffect(() => {
    if (isChatHydrated) {
      storage.saveMessages(messages);
    }
  }, [messages, isChatHydrated]);

  // Persist Active Result
  useEffect(() => {
    if (isChatHydrated) {
      storage.saveActiveResult(activeResult);
    }
  }, [activeResult, isChatHydrated]);

  const clearSession = useCallback(() => {
    setMessages([]);
    setActiveResult(null);
    setErrorMessage(null);
    setStatus(AppStatus.IDLE);
    storage.clearChatSession();
  }, []);

  return {
    status,
    setStatus,
    messages,
    setMessages,
    activeResult,
    setActiveResult,
    errorMessage,
    setErrorMessage,
    clearSession
  };
};
