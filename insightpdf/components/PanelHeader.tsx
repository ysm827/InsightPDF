import React, { useRef } from 'react';
import { AppStatus } from '@/types';
import type { ChatMessage } from '@/types';
import { Upload, FileText, Loader2, RotateCcw, Settings, Zap, Sparkles } from 'lucide-react';
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
      e.target.value = '';
    }
  };

  return (
    <>
      {/* Header Bar */}
      <header className="relative px-4 py-3 border-b border-gray-100 dark:border-gray-800/80 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-20">
        <div className="flex items-center justify-between gap-2">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0 ring-2 ring-indigo-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-900 dark:from-white dark:via-gray-100 dark:to-indigo-200 bg-clip-text text-transparent tracking-tight">
                  InsightPDF
                </span>
              </div>
            </div>
            <ModelSelector selectedModel={selectedModel} onModelSelect={onModelSelect} />
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5">
            {messages.length > 0 && (
              <button
                onClick={onClearChat}
                className="p-2 text-gray-400 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-all active:scale-95"
                title="清空对话"
                aria-label="清空对话"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onOpenSettings}
              className="p-2 text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-800 rounded-xl transition-all active:scale-95"
              title="设置"
              aria-label="打开设置"
            >
              <Settings className="w-4 h-4" />
            </button>

            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-xl transition-all shadow-xs shadow-indigo-500/20 active:scale-95"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{currentFile ? '更换' : '上传 PDF'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Current File Banner */}
      {currentFile && (
        <div className={`px-4 py-2 border-b border-gray-100 dark:border-gray-800/80 flex items-center gap-2.5 transition-all text-xs ${
          isUploading
            ? 'bg-indigo-50/80 dark:bg-indigo-950/30'
            : 'bg-gray-50/70 dark:bg-gray-900/50'
        }`}>
          <div className={`p-1.5 rounded-lg shrink-0 ${
            isUploading
              ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-xs'
          }`}>
            {isUploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileText className="w-3.5 h-3.5" />
            )}
          </div>

          <div className="flex-1 min-w-0 flex items-center gap-2">
            <span className="font-medium truncate text-gray-800 dark:text-gray-200" title={currentFile.name}>
              {currentFile.name}
            </span>
            {isUploading ? (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 animate-pulse whitespace-nowrap">
                云端同步中...
              </span>
            ) : useFilesApi && (
              <span title="使用 Files API 加速" className="flex items-center gap-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-200/50 dark:border-amber-900/30 whitespace-nowrap">
                <Zap className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Files API
              </span>
            )}
          </div>

          <span className="text-[11px] text-gray-400 dark:text-gray-500 font-mono whitespace-nowrap">
            {(currentFile.size / (1024 * 1024)).toFixed(1)} MB
          </span>
        </div>
      )}
    </>
  );
};

export default PanelHeader;

