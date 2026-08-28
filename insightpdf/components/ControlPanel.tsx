import React, { useRef, useEffect, useState } from 'react';
import { AppStatus } from '../types';
import type { ChatMessage, LocatorResult } from '../types';
import { Send } from 'lucide-react';
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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, status]);

  const isUploading = status === AppStatus.PROCESSING_FILE;
  const isSearching = status === AppStatus.SEARCHING;
  const isLoading = isUploading || isSearching;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Allow typing during upload, but prevent submit until upload is complete
    if (query.trim() && currentFile && !isSearching && !isUploading) {
      onSearch(query);
      setQuery('');
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
        />

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-2 pt-0 pointer-events-none">
          <form onSubmit={handleSubmit} className="pointer-events-auto relative flex items-center gap-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-indigo-100/50 dark:shadow-none border border-gray-100 dark:border-gray-700 p-1.5 transition-all focus-within:shadow-2xl focus-within:border-indigo-100 dark:focus-within:border-indigo-900 focus-within:ring-4 focus-within:ring-indigo-500/5 dark:focus-within:ring-indigo-500/20">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={currentFile ? '询问关于 PDF 的内容...' : '请先上传文件'}
              disabled={!currentFile || isSearching}
              className="flex-1 p-3 bg-transparent border-none focus:ring-0 outline-none text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50"
              aria-label="输入问题"
            />
            <button
              type="submit"
              disabled={!currentFile || isLoading || !query.trim()}
              aria-label="发送"
              className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-300 dark:disabled:text-gray-500 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

        <div ref={messagesEndRef} />
      </div>
    </>
  );
};

export default ControlPanel;
