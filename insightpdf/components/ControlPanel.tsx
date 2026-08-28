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

      <div className="w-full h-full bg-[var(--theme-bg-secondary)] flex flex-col z-30 relative transition-colors">
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

        {/* Floating Input Dock (AMC-WebUI Composer) */}
        <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none bg-gradient-to-t from-[var(--theme-bg-secondary)] via-[var(--theme-bg-secondary)]/90 to-transparent pt-6">
          <form
            onSubmit={handleSubmit}
            className="pointer-events-auto relative flex items-center gap-1.5 rounded-[20px] border border-[var(--theme-border-secondary)]/80 bg-[var(--theme-bg-primary)] shadow-sm p-1.5 transition-all focus-within:border-[var(--theme-border-focus)] focus-within:ring-2 focus-within:ring-[var(--theme-border-focus)]/20"
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
              className="flex-1 px-3 py-1.5 bg-transparent border-none focus:ring-0 outline-none text-xs sm:text-sm text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-tertiary)] disabled:opacity-50"
              aria-label="输入问题"
            />

            {query.trim() && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="w-7 h-7 flex items-center justify-center text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-primary)] hover:bg-[var(--theme-bg-tertiary)] rounded-lg transition-colors"
                title="清除输入"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="submit"
              disabled={!currentFile || isLoading || !query.trim()}
              aria-label="发送问题"
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150 shrink-0 ${
                !currentFile || isLoading || !query.trim()
                  ? 'bg-[var(--theme-bg-tertiary)] text-[var(--theme-text-tertiary)] cursor-not-allowed opacity-40'
                  : 'bg-[var(--theme-bg-accent)] text-[var(--theme-text-accent)] hover:bg-[var(--theme-bg-accent-hover)] shadow-xs active:scale-95'
              }`}
            >
              {isLoading ? (
                <Sparkles className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
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

