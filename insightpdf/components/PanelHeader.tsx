import React, { useRef } from 'react';
import { AppStatus } from '../types';
import type { ChatMessage } from '../types';
import { Upload, FileText, Loader2, RotateCcw, Settings, CloudLightning } from 'lucide-react';
import ModelSelector from './ModelSelector';

interface PanelHeaderProps {
  onFileUpload: (file: File) => void;
  onClearChat: () => void;
  status: AppStatus;
  messages: ChatMessage[];
  currentFile: File | null;
  selectedModel: string;
  onModelSelect: (model: string) => void;
  onOpenSettings: () => void;
  useFilesApi: boolean;
}

const PanelHeader: React.FC<PanelHeaderProps> = ({
  onFileUpload,
  onClearChat,
  status,
  messages,
  currentFile,
  selectedModel,
  onModelSelect,
  onOpenSettings,
  useFilesApi
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isUploading = status === AppStatus.PROCESSING_FILE;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
      // Allow selecting the same file again later
      e.target.value = '';
    }
  };

  return (
    <>
      {/* Header */}
      <div className="relative p-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100 tracking-tight">
              InsightPDF
            </h1>
            <ModelSelector selectedModel={selectedModel} onModelSelect={onModelSelect} />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSettings}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
              title="设置"
              aria-label="打开设置"
            >
              <Settings className="w-4 h-4" />
            </button>

            {messages.length > 0 && (
              <button
                onClick={onClearChat}
                className="p-1.5 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                title="重置对话"
                aria-label="重置对话"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 border border-indigo-100 dark:border-indigo-900/30"
            >
              <Upload className="w-3 h-3" />
              {currentFile ? '更换' : '上传'}
            </button>
          </div>
        </div>
      </div>

      {/* File Indicator */}
      {currentFile && (
        <div className={`px-4 py-2 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2 transition-colors ${isUploading ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
          {isUploading ? (
            <Loader2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-spin" />
          ) : useFilesApi ? (
            <span title="使用 Files API" className="flex items-center">
              <CloudLightning className="w-3.5 h-3.5 text-amber-500" />
            </span>
          ) : (
            <FileText className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
          )}

          <div className="flex-1 min-w-0 flex items-center gap-2">
            <span className={`text-xs font-medium truncate flex-1 ${isUploading ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-200'}`}>
              {currentFile.name}
            </span>
            {isUploading && (
              <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 px-1.5 py-0.5 rounded-full font-medium animate-pulse whitespace-nowrap">
                上传中...
              </span>
            )}
          </div>

          <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
            {(currentFile.size / 1024 / 1024).toFixed(1)}MB
          </span>
        </div>
      )}
    </>
  );
};

export default PanelHeader;
