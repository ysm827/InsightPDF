import React, { useRef, useEffect, useState } from 'react';
import { AppStatus } from '@/types';
import type { ChatMessage, LocatorResult } from '@/types';
import { Send, Sparkles, X } from 'lucide-react';
import PanelHeader from './PanelHeader';
import SettingsModal from './SettingsModal';
import ChatMessages from './ChatMessages';

interface ControlPanelProps {
  onFileUpload: (file: File) => void;
  onSearch: (query: string) => void;
  onRetry: () => void;
  canRetry: boolean;
  onViewLocation: (result: LocatorResult) => void;
  onClearChat: () => void;
  status: AppStatus;
  messages: ChatMessage[];
  currentFile: File | null;
  selectedModel: string;
  onModelSelect: (model: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  useFilesApi: boolean;
  onToggleFilesApi: () => void;
  errorMessage: string | null;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onFileUpload,
  onSearch,
  onRetry,
  canRetry,
  onViewLocation,
  onClearChat,
  status,
  messages,
  currentFile,
  selectedModel,
  onModelSelect,
  theme,
  onToggleTheme,
  useFilesApi,
  onToggleFilesApi,
  errorMessage
}) => {
  const [query, setQuery] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, status]);

  // Focus input when file is loaded
  useEffect(() => {
    if (currentFile && status === AppStatus.IDLE) {
      inputRef.current?.focus();
    }
  }, [currentFile, status]);

  const isUploading = status === AppStatus.PROCESSING_FILE;
  const isSearching = status === AppStatus.SEARCHING;
  const isLoading = isUploading || isSearching;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && currentFile && !isSearching && !isUploading) {
      onSearch(query);
      setQuery('');
    }
  };

  const handleSuggestion = (suggestedQuery: string) => {
    if (currentFile && !isLoading) {
      onSearch(suggestedQuery);
    }
  };

  return (
    <>
      <SettingsModal
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onToggleTheme={onToggleTheme}
        useFilesApi={useFilesApi}
        onToggleFilesApi={onToggleFilesApi}
      />

      <div className="w-full h-full bg-white dark:bg-gray-900 flex flex-col z-30 shadow-lg relative transition-colors duration-300">
        <PanelHeader
          onFileUpload={onFileUpload}
          onClearChat={onClearChat}
          status={status}
          messages={messages}
          currentFile={currentFile}
          selectedModel={selectedModel}
          onModelSelect={onModelSelect}
          onOpenSettings={() => setIsSettingsOpen(true)}
          useFilesApi={useFilesApi}
        />

        {/* Chat Area */}
        <ChatMessages
          messages={messages}
          status={status}
          errorMessage={errorMessage}
          canRetry={canRetry}
          currentFile={currentFile}
          onRetry={onRetry}
          onViewLocation={onViewLocation}
          onSuggestionClick={handleSuggestion}
        />

        {/* Floating Input Dock */}
        <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none bg-gradient-to-t from-white via-white/80 dark:from-gray-900 dark:via-gray-900/80 to-transparent pt-6">
          <form
            onSubmit={handleSubmit}
            className="pointer-events-auto relative flex items-center gap-2 glass-card bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-xl shadow-indigo-500/5 dark:shadow-black/40 border border-gray-200/90 dark:border-gray-700/80 p-1.5 transition-all focus-within:ring-2 focus-within:ring-indigo-500/40 focus-within:border-indigo-500/50"
          >
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                !currentFile
                  ? '请先上传 PDF 文档...'
                  : isUploading
                  ? '文档正在上传解析中...'
                  : '向 Gemini 提问文档内容，支持定位与公式...'
              }
              disabled={!currentFile || isSearching}
              className="flex-1 px-3 py-2 bg-transparent border-none focus:ring-0 outline-none text-xs sm:text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60"
              aria-label="输入问题"
            />

            {query.trim() && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                title="清除输入"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              disabled={!currentFile || isLoading || !query.trim()}
              aria-label="发送问题"
              className={`p-2.5 rounded-xl text-white transition-all shadow-xs flex items-center justify-center ${
                !currentFile || isLoading || !query.trim()
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-indigo-600/20 active:scale-95'
              }`}
            >
              {isLoading ? (
                <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
        </div>

        <div ref={messagesEndRef} />
      </div>
    </>
  );
};

export default ControlPanel;

