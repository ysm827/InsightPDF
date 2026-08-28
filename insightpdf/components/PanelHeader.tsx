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
      <header className="h-14 px-4 border-b border-[var(--theme-border-primary)] bg-[var(--theme-bg-secondary)] flex items-center justify-between gap-3 z-20 select-none">
        {/* Left: Logo & Model Selector */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold tracking-tight text-[var(--theme-text-primary)]">
            InsightPDF
          </span>
          <ModelSelector selectedModel={selectedModel} onModelSelect={onModelSelect} />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={onClearChat}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-[var(--theme-text-secondary)] hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all duration-150 active:scale-95"
              title="清空对话"
              aria-label="清空对话"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-[var(--theme-text-secondary)] hover:bg-[var(--theme-bg-tertiary)] hover:text-[var(--theme-text-primary)] transition-all duration-150 active:scale-95"
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
            className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-[var(--theme-text-accent)] bg-[var(--theme-bg-accent)] hover:bg-[var(--theme-bg-accent-hover)] rounded-lg transition-all duration-150 shadow-xs active:scale-95 shrink-0 ml-1"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{currentFile ? '更换' : '上传 PDF'}</span>
          </button>
        </div>
      </header>

      {/* Current File Banner */}
      {currentFile && (
        <div className={`px-4 py-2 border-b border-[var(--theme-border-primary)] flex items-center gap-2.5 transition-all text-xs ${
          isUploading
            ? 'bg-[var(--theme-bg-accent)]/10 text-[var(--theme-text-link)]'
            : 'bg-[var(--theme-bg-tertiary)]/40 text-[var(--theme-text-secondary)]'
        }`}>
          <div className={`p-1 rounded-md shrink-0 ${
            isUploading
              ? 'bg-[var(--theme-bg-accent)]/20 text-[var(--theme-text-link)]'
              : 'bg-[var(--theme-bg-primary)] text-[var(--theme-text-secondary)] shadow-2xs'
          }`}>
            {isUploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileText className="w-3.5 h-3.5" />
            )}
          </div>

          <div className="flex-1 min-w-0 flex items-center gap-2">
            <span className="font-medium truncate text-[var(--theme-text-primary)]" title={currentFile.name}>
              {currentFile.name}
            </span>
            {isUploading ? (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-[var(--theme-bg-accent)]/15 text-[var(--theme-text-link)] animate-pulse whitespace-nowrap">
                云端同步中...
              </span>
            ) : useFilesApi && (
              <span title="使用 Files API 加速" className="flex items-center gap-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 whitespace-nowrap">
                <Zap className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Files API
              </span>
            )}
          </div>

          <span className="text-[11px] text-[var(--theme-text-tertiary)] font-mono whitespace-nowrap">
            {(currentFile.size / (1024 * 1024)).toFixed(1)} MB
          </span>
        </div>
      )}
    </>
  );
};

export default PanelHeader;

